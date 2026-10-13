"use strict";

const test = require("node:test");
const assert = require("node:assert");

const { mapWavePetToClawd } = require("../src/wavepet/clawd-mapper");

function wave(state, extra = {}) {
  return {
    state,
    intensity: 0.8,
    confidence: 0.9,
    presentation: { min_visible_ms: 12000 },
    smoothing: { remaining_hold_ms: 10000 },
    ...extra,
  };
}

test("maps reading to thinking visual", () => {
  const out = mapWavePetToClawd(wave("reading_understanding"));
  assert.equal(out.state, "thinking");
  assert.equal(out.displayHint, "clawd-working-thinking.svg");
});

test("maps deep output to active ultrathink visual", () => {
  const out = mapWavePetToClawd(wave("deep_output"));
  assert.equal(out.state, "working");
  assert.equal(out.displayHint, "clawd-working-ultrathink.svg");
});

test("maps overheat to ultrathink unless hard failure requested", () => {
  assert.deepEqual(mapWavePetToClawd(wave("overheat_debugging"), { hardFailure: false }).state, "working");
  assert.equal(mapWavePetToClawd(wave("overheat_debugging"), { hardFailure: false }).displayHint, "clawd-working-ultrathink.svg");
  assert.equal(mapWavePetToClawd(wave("overheat_debugging"), { hardFailure: true }).state, "error");
});

test("maps completed closing to attention and active closing to thinking", () => {
  assert.equal(mapWavePetToClawd(wave("closing"), { completed: true }).state, "attention");
  assert.equal(mapWavePetToClawd(wave("closing"), { completed: false }).state, "thinking");
});

test("active tools temporarily interrupt ultrathink with task-specific visuals", () => {
  const deep = (kind) => wave("deep_output", {
    online_features: { open_tool_kind: kind },
    smoothing: { state_age_ms: 30000, remaining_hold_ms: 10000 },
  });

  assert.equal(mapWavePetToClawd(deep("read")).displayHint, "clawd-working-thinking.svg");
  assert.equal(mapWavePetToClawd(deep("command")).displayHint, "clawd-working-typing.svg");
  assert.equal(mapWavePetToClawd(deep("edit")).displayHint, "clawd-working-typing-boss.svg");
  assert.equal(mapWavePetToClawd(deep("test")).displayHint, "clawd-working-debugger.svg");
});

test("ultrathink takes a short visual break after one continuous minute", () => {
  const at = (age) => wave("deep_output", {
    smoothing: { state_age_ms: age, remaining_hold_ms: 0 },
  });

  assert.equal(mapWavePetToClawd(at(59999)).displayHint, "clawd-working-ultrathink.svg");
  assert.equal(mapWavePetToClawd(at(60000)).displayHint, "clawd-working-typing-boss.svg");
  assert.equal(mapWavePetToClawd(at(71999)).displayHint, "clawd-working-typing-boss.svg");
  assert.equal(mapWavePetToClawd(at(72000)).displayHint, "clawd-working-ultrathink.svg");
});

test("hard failures override active-tool visual interruptions", () => {
  const state = wave("overheat_debugging", {
    online_features: { open_tool_kind: "test" },
  });
  const out = mapWavePetToClawd(state, { hardFailure: true });
  assert.equal(out.state, "error");
  assert.equal(out.displayHint, null);
});
