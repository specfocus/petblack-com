import test, { afterEach, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createActor } from '@specfocus/atoms/lib/machine';
import { buildBuddyProfile } from '@/widgets/buddy/domain/deterministic';
import agentMachine from '@/machines/agent/agent-machine';
import { AgentEventTypes } from '@/machines/agent/agent-event-types';

type FetchMock = typeof fetch;

const visitorId = 'buddy-test-visitor';
const profile = buildBuddyProfile(visitorId);

const makePayload = (message: string) => ({
    visitorId,
    message,
    buddy: profile,
    shopSnapshot: {
        stateValue: 'ready',
        context: {
            lists: [],
            dirty: false,
        },
    },
    shopMachineDoc: 'test shop machine docs',
});

const createTestAgentActor = () => createActor(agentMachine, { input: {} }).start();

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const waitFor = async (predicate: () => boolean, timeoutMs = 800, intervalMs = 20): Promise<void> => {
    const started = Date.now();
    while (!predicate()) {
        if (Date.now() - started > timeoutMs) {
            throw new Error('Timeout waiting for predicate');
        }
        await sleep(intervalMs);
    }
};

let originalFetch: FetchMock;

beforeEach(() => {
    originalFetch = globalThis.fetch;
});

afterEach(() => {
    globalThis.fetch = originalFetch;
});

test('agent-machine binds buddy profile and seeds greeting message', () => {
    const actor = createTestAgentActor();
    actor.send({ type: AgentEventTypes.BindBuddyProfile, profile });
    const snapshot = actor.getSnapshot();
    assert.equal(snapshot.context.buddyProfile?.visitorId, visitorId);
    assert.ok(snapshot.context.conversation.length >= 1);
    assert.equal(snapshot.context.conversation[0]?.speaker, 'buddy');
    actor.stop();
});

test('agent-machine controls chat request lifecycle and records response', async () => {
    globalThis.fetch = (async () =>
        ({
            ok: true,
            status: 200,
            text: async () =>
                JSON.stringify({
                    reply: 'Sure, I can help with that.',
                    emotion: 'playful',
                    events: [],
                }),
        }) as Response) as FetchMock;

    const actor = createTestAgentActor();
    actor.send({ type: AgentEventTypes.BindBuddyProfile, profile });
    actor.send({
        type: AgentEventTypes.ChatRequestSubmitted,
        payload: makePayload('open cart'),
    });

    await waitFor(() => actor.getSnapshot().context.isSending === false);
    const snapshot = actor.getSnapshot();
    assert.equal(snapshot.context.lastUserMessage, 'open cart');
    assert.equal(snapshot.context.lastReply, 'Sure, I can help with that.');
    assert.ok(snapshot.context.debugTraces.some(trace => trace.direction === 'request'));
    assert.ok(snapshot.context.debugTraces.some(trace => trace.direction === 'response'));
    actor.stop();
});

test('agent-machine queues model-proposed events from buddy response', async () => {
    globalThis.fetch = (async () =>
        ({
            ok: true,
            status: 200,
            text: async () =>
                JSON.stringify({
                    reply: 'I can do that now.',
                    emotion: 'happy',
                    events: [
                        {
                            id: 'evt-1',
                            target: 'shop',
                            eventType: 'shop.addItem',
                            payload: { listId: 'cart', sku: 'toy-001', qty: 1 },
                        },
                    ],
                }),
        }) as Response) as FetchMock;

    const actor = createTestAgentActor();
    actor.send({ type: AgentEventTypes.BindBuddyProfile, profile });
    actor.send({
        type: AgentEventTypes.ChatRequestSubmitted,
        payload: makePayload('add a toy to the cart'),
    });

    await waitFor(() => actor.getSnapshot().context.isSending === false);
    const snapshot = actor.getSnapshot();
    assert.equal(snapshot.context.pendingEvents.length, 1);
    assert.equal(snapshot.context.pendingEvents[0]?.eventType, 'shop.addItem');
    actor.stop();
});

// ---------------------------------------------------------------------------
// Aspirational tests (intentionally failing right now)
// These define the behavior we WANT buddy+agent to support soon.
// ---------------------------------------------------------------------------

test('intent "open cart" should forward a shell event to open cart UI', async () => {
    const actor = createTestAgentActor();
    actor.send({ type: AgentEventTypes.IntentOpenCart });
    const snapshot = actor.getSnapshot();
    assert.ok(
        snapshot.context.forwardedShellEvents.length > 0,
        'expected at least one forwarded shell event for open cart'
    );
    actor.stop();
});

test('intent "open autoship" should open autoship workflow panel', async () => {
    const actor = createTestAgentActor();
    actor.send({ type: AgentEventTypes.IntentOpenAutoship });
    const snapshot = actor.getSnapshot();
    assert.ok(
        snapshot.context.forwardedShellEvents.length > 0,
        'expected shell forwarding for autoship workflow'
    );
    actor.stop();
});

test('intent "add a toy to the cart" should translate into concrete shop.addItem', async () => {
    const actor = createTestAgentActor();
    actor.send({ type: AgentEventTypes.IntentAddToyToCart });
    const snapshot = actor.getSnapshot();
    const hasAddItem = snapshot.context.forwardedShopEvents.some(event => event.type === 'shop.addItem');
    assert.equal(hasAddItem, true, 'expected shop.addItem translation for toy intent');
    actor.stop();
});

test('intent "add dog food to the cart" should search then add selected sku', async () => {
    const actor = createTestAgentActor();
    actor.send({ type: AgentEventTypes.IntentAddDogFoodToCart });
    const snapshot = actor.getSnapshot();
    const hasSearchThenAdd = snapshot.context.forwardedShopEvents.some(event => event.type === 'shop.searchProducts');
    assert.equal(hasSearchThenAdd, true, 'expected shop.searchProducts orchestration before add');
    actor.stop();
});

test('intent "clean the cart" should remove all cart items', async () => {
    const actor = createTestAgentActor();
    actor.send({ type: AgentEventTypes.IntentCleanCart });
    const snapshot = actor.getSnapshot();
    const hasClearCart = snapshot.context.forwardedShopEvents.some(event => event.type === 'shop.clearCart');
    assert.equal(hasClearCart, true, 'expected a clear cart event');
    actor.stop();
});

test('buddy should execute a multi-step plan for pickup flow', async () => {
    const actor = createTestAgentActor();
    actor.send({
        type: AgentEventTypes.ChatRequestSubmitted,
        payload: makePayload('I want pickup in my area for dog food'),
    });
    await waitFor(() => actor.getSnapshot().context.isSending === false);
    const snapshot = actor.getSnapshot();
    const hasOrchestration = snapshot.context.pendingEvents.some(event => event.eventType === 'shop.pickup.selectStore');
    assert.equal(hasOrchestration, true, 'expected pickup orchestration event');
    actor.stop();
});

test('buddy should be able to open cart and autoship in one orchestration', async () => {
    const actor = createTestAgentActor();
    actor.send({ type: AgentEventTypes.IntentOpenCart });
    actor.send({ type: AgentEventTypes.IntentOpenAutoship });
    const snapshot = actor.getSnapshot();
    assert.ok(
        snapshot.context.forwardedShellEvents.length >= 2,
        'expected two shell events for dual workflow orchestration'
    );
    actor.stop();
});

