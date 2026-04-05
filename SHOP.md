# Shop Lists — Concept & Architecture

## Overview

The **Shop** feature lets users organise pet-product SKUs into named lists.
Each list is a floating widget (icon button → expanded panel) registered in
the shelly dial, and can be toggled from the **Settings → Shop** tab.

---

## Prefab Lists

Six lists are built in and always available. They cannot be deleted, but most
can be disabled (removed from the dial and home screen).

| ID       | Name       | Icon | Default | Qty meaning            | Special widget    |
|----------|------------|------|---------|------------------------|-------------------|
| `cart`   | Cart       | 🛒   | ✅ ON   | Qty to buy now         | Checkout wizard   |
| `want`   | Want       | ⭐   | ✅ ON   | Desired qty            | —                 |
| `need`   | Need       | 📋   | ✅ ON   | Needed qty             | —                 |
| `have`   | Have       | 🏠   | ❌ OFF  | Qty on hand            | —                 |
| `pick`   | Pick Up    | 🏪   | ❌ OFF  | Qty to reserve         | Store-locator carousel |
| `auto`   | Autoship   | 🔄   | ❌ OFF  | Qty per shipment       | —                 |

**Cart is always enabled** — it cannot be disabled.

---

## Custom Lists

Users can create any number of additional lists (e.g. "Buddy", "Nemo", "Hamster cage").
Each custom list:

- Has a user-chosen name
- Has a user-chosen icon from the **pet / animal emoji palette**
- Behaves like the **Want** / **Need** lists (quantity = desired amount)
- Can be deleted at any time

---

## List Items

Every item in a list stores:

```ts
{
  sku: string       // schema.org/Product @id / sku
  name: string      // denormalised for display
  qty: number       // see table above for semantic
  addedAt: string   // ISO timestamp
}
```

Items are added from the search results page via an "Add to list" action on
product cards (future), or directly inside each list widget.

---

## Persistence

All lists are stored in **`localStorage`** under the key `petblack:shop-lists`.
No server round-trip is needed. Data is loaded eagerly on mount and saved on
every mutation.

---

## Widget Pattern

Each **enabled** list gets:

1. A **FAB** entry in the shelly speed-dial (bottom-right dial button)
2. A floating **widget** (positioned by shelly's `<Widget>` shell)

Clicking the FAB opens the widget panel.

### Generic List Widget (want / need / have / auto / custom)

```
[ Icon ] List Name                         [×]
──────────────────────────────────────────────
  🐾 Royal Canin Maxi  ×1  [−] [+] [🗑]
  🐾 KONG Classic       ×2  [−] [+] [🗑]
──────────────────────────────────────────────
[ Add by SKU… ]  [Search products]
```

### Cart Widget — Checkout Wizard

A **5-step wizard** dialog (uses `DialogLayouts.Wizard`):

| Step | Name              | Content                                  |
|------|-------------------|------------------------------------------|
| 1    | Cart              | Basket review, qty edit, remove items    |
| 2    | Delivery          | Speed selector (Standard/Express/Same-day) + address form |
| 3    | Payment           | Card number / PayPal / Apple Pay mock    |
| 4    | Review            | Order summary, total, "Place Order" CTA  |
| 5    | Confirmation      | Order number, thank-you message          |

Navigation: Next / Back buttons. Confirmation has no Back.

### Pick-Up Widget — Store-Locator Carousel

A **3-slide carousel** dialog (uses `DialogLayouts.Carousel`):

| Slide | Name       | Content                                      |
|-------|------------|----------------------------------------------|
| 1     | By State   | Dropdown of US states → list of stores       |
| 2     | By Zip     | Zip-code input → nearest stores list         |
| 3     | Map        | Embedded map (placeholder) + nearby stores   |

---

## Settings → Shop Section

The **Shop** settings section (added to shelly's Settings dialog) provides:

- **Prefab list toggles** — a checkbox row per prefab list to enable/disable it
  (Cart is always checked and disabled)
- **Custom lists** — a list editor: add new list (name + icon picker), delete
  existing custom lists, rename lists
- **Icon picker** — a grid of pet/animal emojis to assign to a list

---

## Autoship (`auto`) Semantics

Items in the **Autoship** list are products the user wants delivered on a
recurring schedule. The quantity represents the amount per shipment.
The autoship widget (future phase) will allow selecting shipment frequency
per item.

---

## Pickup (`pick`) Semantics

Items in the **Pick Up** list are products the user wants to reserve for
collection at a physical store. The store-locator carousel dialog assists
the user in selecting their preferred store.

---

## Widget Install Pattern

```
installShop(get, set)
  ├── installSection(SETTINGS_DIALOG_PATH, ShopSettingsSection)   // Settings tab
  ├── for each enabled list:
  │     ├── set(workspaceTreeAtom(LIST_TOGGLE_PATH), toggleEntry)
  │     ├── installWidget(widgetEntry)                            // <Widgets />
  │     └── installDialAction('shop-{id}', toggleEntry)          // Dial button
  └── return cleanup
```

The install function re-runs reactively whenever `enabledListsAtom` changes
(lists toggled on/off in Settings).
