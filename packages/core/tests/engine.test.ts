import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { GameEngine, createInitialState } from '../src/engine.js';

function makeEngine() {
  return new GameEngine({ now: () => 0, random: () => 0.1 });
}

describe('initial state', () => {
  it('starts with one order slot and 49 empty cells', () => {
    const engine = makeEngine();
    assert.equal(engine.state.energy, 60);
    assert.equal(engine.state.coins, 0);
    assert.equal(engine.state.unlockedSlots, 1);
    assert.equal(engine.state.slots[0], 1);
    assert.equal(engine.state.board.length, 49);
    assert.equal(engine.state.board.filter(Boolean).length, 0);
  });
});

describe('producer', () => {
  it('spawns a level-1 item and spends one energy', () => {
    const engine = makeEngine();
    const result = engine.tapProducer('old');
    assert.equal(result.ok, true);
    assert.equal(engine.state.energy, 59);
    assert.equal(engine.state.board.filter((id) => id === 'old_1').length, 1);
  });

  it('locks food producer until 2 orders', () => {
    const engine = makeEngine();
    assert.equal(engine.tapProducer('food').event, 'producer_locked');
    engine.state.completedOrders = 2;
    assert.equal(engine.tapProducer('food').ok, true);
  });
});

describe('merge', () => {
  it('merges two same items into the next level', () => {
    const engine = makeEngine();
    engine.state.board[0] = 'old_1';
    engine.state.board[1] = 'old_1';
    const result = engine.mergeCells(0, 1);
    assert.equal(result.ok, true);
    assert.equal(engine.state.board[0], null);
    assert.equal(engine.state.board[1], 'old_2');
    assert.equal(engine.state.totalMerges, 1);
  });

  it('rejects different items', () => {
    const engine = makeEngine();
    engine.state.board[0] = 'old_1';
    engine.state.board[1] = 'food_1';
    const result = engine.mergeCells(0, 1);
    assert.equal(result.ok, false);
    assert.equal(result.event, 'merge_mismatch');
  });

  it('rejects max-level merge', () => {
    const engine = makeEngine();
    engine.state.board[0] = 'old_6';
    engine.state.board[1] = 'old_6';
    const result = engine.mergeCells(0, 1);
    assert.equal(result.ok, false);
    assert.equal(result.event, 'merge_max');
  });
});

describe('orders', () => {
  it('completes order 1, rewards coins and unlocks slot 2', () => {
    const engine = makeEngine();
    engine.state.board[0] = 'old_2';
    const result = engine.completeOrder(0);
    assert.equal(result.ok, true);
    assert.equal(engine.state.coins, 120);
    assert.equal(engine.state.completedOrders, 1);
    assert.equal(engine.state.unlockedSlots, 2);
    assert.equal(engine.state.slots[0], 2);
    assert.equal(engine.state.slots[1], 3);
  });

  it('rejects incomplete order', () => {
    const engine = makeEngine();
    const result = engine.completeOrder(0);
    assert.equal(result.ok, false);
    assert.equal(result.event, 'order_incomplete');
  });

  it('applies door + counter order bonus', () => {
    const engine = makeEngine();
    engine.state.coins = 2000;
    assert.equal(engine.chooseRenovation('door', 'door_warm').ok, true);
    assert.equal(engine.chooseRenovation('counter', 'counter_glass').ok, true);
    assert.equal(engine.orderBonus(), 6);
    engine.state.board[0] = 'old_2';
    const result = engine.completeOrder(0);
    assert.equal(result.ok, true);
    assert.equal(engine.state.coins, 2000 - 300 - 600 + 127);
  });
});

describe('renovation', () => {
  it('enforces zone order and parts cost', () => {
    const engine = makeEngine();
    engine.state.coins = 5000;
    assert.equal(engine.chooseRenovation('counter', 'counter_glass').event, 'renovation_locked');
    assert.equal(engine.chooseRenovation('door', 'door_warm').ok, true);
    assert.equal(engine.chooseRenovation('counter', 'counter_glass').ok, true);
    assert.equal(engine.chooseRenovation('wall', 'wall_photos').event, 'renovation_insufficient');
    engine.state.parts = 3;
    assert.equal(engine.chooseRenovation('wall', 'wall_photos').ok, true);
    assert.equal(engine.allRenovated(), true);
    assert.equal(engine.state.parts, 0);
  });
});

describe('energy regen', () => {
  it('regenerates one energy per 45 seconds', () => {
    const engine = new GameEngine({ now: () => 0, random: () => 0.1 });
    engine.state.energy = 10;
    engine.state.lastEnergyAt = 0;
    engine.tick(90_000);
    assert.equal(engine.state.energy, 12);
  });
});

describe('snapshot', () => {
  it('round-trips state', () => {
    const engine = makeEngine();
    engine.state.coins = 123;
    engine.state.board[0] = 'old_1';
    const state = engine.snapshot();
    const restored = new GameEngine({ now: () => 0 }, state);
    assert.equal(restored.state.coins, 123);
    assert.equal(restored.state.board[0], 'old_1');
    assert.notEqual(restored.state, state);
  });

  it('creates a clean initial state', () => {
    const state = createInitialState(0);
    assert.equal(state.energy, 60);
    assert.equal(state.slots[0], null);
  });
});
