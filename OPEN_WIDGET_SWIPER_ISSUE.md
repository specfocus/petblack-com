# Bug: Opening a widget on slide ≥ 2 jumps swiper back to slide 1

**Status:** Open  
**Shelly version at time of writing:** `@specfocus/shelly@0.0.72`  
**Repo:** `apps/petblack-com`, shell machine in `packages/shelly`

---

## Symptoms (production-confirmed)

1. User navigates to slide 2 (product view, 0-based index 1) by clicking a product card in Explore.
2. User opens any widget (e.g. Buddy, Cart, Budget) while on that slide.
3. The Swiper **immediately jumps back to slide 1** (Explore, index 0).
4. The product slide content **appears to disappear / close** (we dont know if it is still in the view-stack but all the slide button are dissabled and opening the views overlay only shows the first slide view).

---

## What was already fixed (and verified in the published package)

| Fix | File | Status |
|-----|------|--------|
| `setSwiperInstance` no longer overwrites `activeIndex` from `swiper.activeIndex` (was always 0) | `shell/machine/shell-actions.ts` → `setSwiperInstance` assign | ✅ in 0.0.70+ |
| Same fix for the standalone swiper machine | `layouts/swiper/machine/swiper-actions.ts` → `setSwiperInstance` assign | ✅ in 0.0.70+ |
| `handleSwiper` uses `clampedExternalIndexRef` so its identity is stable across re-renders | `layouts/swiper/swiper-container.tsx` | ✅ in 0.0.70+ |
| `viewIndex` field removed from `WorkspaceWidgetEntry`; replaced entirely by `viewId` | `widgets/atoms/widget-entry.ts` + `widgets/widgets.tsx` | ✅ in 0.0.71+ |
| Auto-close widget when its owning view is popped (uses `viewId`, not slide count) | `widgets/widgets.tsx` → `SlotSync` auto-close effect | ✅ in 0.0.70+ |

---

## What still happens (the unresolved bug)

Despite the above fixes, the swiper still jumps back when a widget is opened on a
non-first slide.  All obvious direct causes have been eliminated.  The root cause
is somewhere in the interaction between:

- the `SwiperMounted` event chain
- the `slotsPerSlideEffectAtom` / `SetMaxPerView` chain
- the `useEffect([clampedExternalIndex])` navigation effect inside `SwiperContainer`
- a possible deferred `rAF + setTimeout(50 ms)` navigation in `performNavigation`

---

## Architecture quick-reference

### The `SwiperMounted` action chain (in `swiper-states.ts` `sharedOn`)
```
SwiperMounted
  → SetSwiperInstance       (stores instance; does NOT touch activeIndex ✅)
  → CalculateTargetIndex    (sets targetIndex = first slide of LAST view in stack)
  → CalculateActiveView
  → PerformNavigation       (slides to targetIndex if ≠ activeIndex)
```
`CalculateTargetIndex` always navigates to the **first slide of the last-pushed view**.
If `SwiperMounted` fires spuriously while the user is on a non-first slide, the
machine recalculates `targetIndex` as that view's first slide and navigates there.

**`SwiperMounted` is fired** every time `setSwiperInstance(swiper)` is called, which
happens inside `handleSwiper` (Swiper's `onSwiper` prop in `SwiperContainer`).
`onSwiper` is supposed to fire only once on initial DOM mount.

### `handleSwiper` stability
```tsx
// swiper-container.tsx
const handleSwiper = useCallback(
    (swiper: SwiperType) => {
        swiperRef.current = swiper;
        const idx = clampedExternalIndexRef.current;   // ← ref, not state
        if (idx !== 0) swiper.slideTo(idx, 0);
        setIndex(idx);          // → TransitionEnd → updateActiveIndex
        setSwiperInstance(swiper); // → SwiperMounted event
    },
    [setIndex, setSwiperInstance]  // both stable jotai setters
);
```
With the `clampedExternalIndexRef` fix and stable deps, `handleSwiper` should not
change identity and Swiper should not re-fire `onSwiper`.

### `useEffect([clampedExternalIndex])` in `SwiperContainer`
```tsx
useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    if (swiper.activeIndex === clampedExternalIndex) return;
    swiper.slideTo(clampedExternalIndex);
}, [clampedExternalIndex]);
```
`clampedExternalIndex` = `min(externalActiveIndex, sections.length - 1)`.
`externalActiveIndex` = `swiperSnapshot.context.activeIndex`.

If `context.activeIndex` transiently becomes 0 while the Swiper is showing slide 1,
this effect fires `slideTo(0)` → jump back.

### `slotsPerSlideEffectAtom` (in `atoms/slots-per-slide-effect-atom.ts`)
```typescript
atomEffect((get, set) => {
    const swiperInstance = get(swiperInstanceAtom);   // stable after mount
    const windowSize    = get(windowSizeAtom);         // changes on resize only
    const viewStack     = get(viewStackAtom);          // changes on push/pop
    const breakpoint    = get(swiperBreakpointAtom);   // stable
    ...
    set(shellActorAtom, { type: SwiperEventTypes.SetMaxPerView, ... });
});
```
`SetMaxPerView` triggers `RemapIndexesForLayout → ClampIndexes → SyncSwiperToActiveIndex`.
`SyncSwiperToActiveIndex` calls `swiperInstance.slideTo(context.activeIndex, 0)`.
If `context.activeIndex` has been transiently reset to 0 by a prior action,
this slides the carousel to 0 with no animation.

### `performNavigation` deferred path
```typescript
if (context.swiperInstance.slides.length !== slideCount) {
    requestAnimationFrame(() => {
        setTimeout(() => {
            instance.update();
            instance.slideTo(clampedTarget, context.speed);
        }, 50);
    });
    return;
}
```
When `PushView` fires before React has rendered the new `<SwiperSlide>`,
`slides.length` is stale so this deferred `slideTo` path runs ~50 ms later.
During that window `activeIndex` in the machine is still 0, and
`slotsPerSlideEffectAtom` / other re-renders might race.

---

## Key files

| File | Role |
|------|------|
| `packages/shelly/src/layouts/swiper/swiper-container.tsx` | Renders `<Swiper>`, owns `handleSwiper`, `useEffect([clampedExternalIndex])` |
| `packages/shelly/src/layouts/swiper/machine/swiper-states.ts` | `SwiperMounted` action chain |
| `packages/shelly/src/layouts/swiper/machine/swiper-actions.ts` | `setSwiperInstance`, `calculateTargetIndex`, `performNavigation` |
| `packages/shelly/src/shell/machine/shell-actions.ts` | Shell-side `setSwiperInstance` (inlined) |
| `packages/shelly/src/shell/atoms/swiper/swiper-instance-atom.ts` | Setter fires `SwiperMounted` on every call |
| `packages/shelly/src/atoms/slots-per-slide-effect-atom.ts` | `atomEffect` → `SetMaxPerView` → `SyncSwiperToActiveIndex` |
| `packages/shelly/src/widgets/widgets.tsx` | `SlotSync`: assigns `viewId`, auto-close effect |
| `packages/shelly/src/widgets/atoms/widget-entry.ts` | `WorkspaceWidgetEntry`, `viewId?: string` |
| `apps/petblack-com/src/components/product-grid.tsx` | Calls `pushView(createProductViewContext(product))` |
| `apps/petblack-com/src/views/product/product-view-entry.ts` | `id: \`product:${sku}\`` — same product opened multiple times shares the same view ID |

---

## Hypotheses to investigate (in priority order)

### H1 — `slotsPerSlideEffectAtom` fires during the deferred-navigation window
**Theory:** `PushView` → `performNavigation` defers via `rAF + setTimeout(50 ms)`.
During that 50 ms, `activeIndex` in the machine is still 0 (not yet updated by
`TransitionEnd`). If `slotsPerSlideEffectAtom` fires and `SyncSwiperToActiveIndex`
runs, it calls `slideTo(0, 0)` — jumping back.

**How to test:** Add a console.warn inside `syncSwiperToActiveIndex` logging
`context.activeIndex` and `swiperInstance.activeIndex` every time it fires.
Open a product, wait for animation, then open a widget.  Check if it fires with
`activeIndex = 0` after the widget opens.

**Potential fix:** Guard `SyncSwiperToActiveIndex` so it only runs when
`activeIndex` has actually changed (i.e., skip if `swiperInstance.activeIndex === context.activeIndex`):
```typescript
syncSwiperToActiveIndex: createAction(({ context }) => {
    const inst = context.swiperInstance;
    if (!inst?.params) return;
    if (inst.activeIndex === context.activeIndex) return;  // already correct
    inst.params.slidesPerView = 1;
    inst.update();
    inst.slideTo(context.activeIndex, 0);
}),
```
This is already in the source — verify it's actually being applied correctly in
the published build and that `inst.activeIndex` is truly reliable at that point.

### H2 — `handleSwiper` / `onSwiper` still re-fires
**Theory:** Despite `clampedExternalIndexRef`, Swiper still calls `onSwiper`
again after the widget opens.  This would fire `SwiperMounted` → `CalculateTargetIndex`
with `lastView = exploreView` (if viewStack hasn't been updated) → `targetIndex = 0`
→ `PerformNavigation` → `slideTo(0)`.

**How to test:** Add `console.warn('[handleSwiper] called, idx=', idx)` inside
`handleSwiper` and check the console when opening a widget on slide 2.

**Potential fix:** If confirmed, add a one-shot guard:
```tsx
const swiperMountedRef = useRef(false);
const handleSwiper = useCallback((swiper: SwiperType) => {
    if (swiperMountedRef.current) return;  // ignore re-fires
    swiperMountedRef.current = true;
    ...
}, [setIndex, setSwiperInstance]);
```
Or: make `SwiperMounted` a no-op if `context.swiperInstance` is already set
(idempotent mount guard in the machine state).

### H3 — `useEffect([clampedExternalIndex])` fires with 0 during widget open
**Theory:** Something causes `SwiperContainer` to re-render with
`externalActiveIndex = 0` while the swiper DOM is already at slide 1.
`clampedExternalIndex` becomes 0, the effect fires, and `slideTo(0)` runs.

**How to test:** Add a `console.warn` inside the `useEffect([clampedExternalIndex])`
body that always logs the index (even when skipped), and a stack trace when
`swiper.slideTo` is actually called.

### H4 — Stale `pendingViewStack` flushed on widget-triggered transition
**Theory:** A prior `PopView` left a stale `pendingViewStack` (pop was deferred
but `TransitionEnd` never flushed it because `clampedTarget === activeIndex` at
the time).  When the widget opens and triggers any transition, `TransitionEnd`
fires → `flushDeferredSlideRemoval` commits the trimmed `viewStack` → the product
slide disappears.

**How to test:** Log `context.pendingViewStack` inside `flushDeferredSlideRemoval`.
Check if it is non-null when it shouldn't be.

### H5 — Same product pushed multiple times (`id: product:sku` collision)
**Theory:** User opens the same product twice.  Both views share `id: 'product:sku'`.
The `viewId` stored on the widget matches both, so auto-close logic behaves
unexpectedly (or `calculateTargetIndex` sees duplicate IDs and resolves to the
wrong slide).

**Fix (regardless of swiper issue):** Make view IDs unique per push:
```typescript
// product-view-entry.ts
export const createProductViewContext = (product: ProductJsonLd): ViewContext => {
    const sku = product.sku ?? product['@id'] ?? product.name;
    return {
        id: `product:${sku}:${Date.now()}`,  // unique per open
        ...
    };
};
```

---

## Diagnostics to add before next session

Add these temporary logs to `swiper-container.tsx`, build, and deploy to petblack-com:

```tsx
// 1. Inside handleSwiper — detect spurious re-fires
const handleSwiper = useCallback((swiper: SwiperType) => {
    console.warn('[handleSwiper] fired', { idx: clampedExternalIndexRef.current, activeIndex: swiper.activeIndex });
    ...
}, [setIndex, setSwiperInstance]);

// 2. Inside useEffect([clampedExternalIndex]) — detect spurious slideTo calls
useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    console.warn('[clampedIdx effect]', { clampedExternalIndex, swiperActiveIndex: swiper.activeIndex });
    if (swiper.activeIndex === clampedExternalIndex) return;
    console.warn('[clampedIdx effect] SLIDING TO', clampedExternalIndex);
    swiper.slideTo(clampedExternalIndex);
}, [clampedExternalIndex]);
```

And in `swiper-actions.ts` `syncSwiperToActiveIndex`:
```typescript
syncSwiperToActiveIndex: createAction(({ context }) => {
    const inst = context.swiperInstance;
    if (!inst?.params) return;
    console.warn('[syncSwiperToActiveIndex]', { ctxActiveIndex: context.activeIndex, swiperActiveIndex: inst.activeIndex });
    if (inst.activeIndex === context.activeIndex) return;
    ...
}),
```

---

## Non-swiper issue also noted

`viewId` in `WorkspaceWidgetEntry` relies on `swiperSnapshot.context.viewStack`
at the time the widget opens.  If `viewStack` hasn't been updated yet (stale
closure in `setViewIndex`), `viewId` will be empty and the auto-close-on-pop
feature won't work for that widget open.

The `setViewIndex` function in `SlotSync` captures `swiperSnapshot` from
`useAtomValue(swiperSnapshotAtom)` which is the latest committed snapshot — this
should be fine.  But worth verifying in the same debug session.
