"use strict";

const ULTRATHINK_ACTIVE_MS = 60_000;
const ULTRATHINK_BREAK_MS = 12_000;

function getUltrathinkDisplayHint(waveState) {
  const stateAgeMs = Math.max(
    0,
    Number(waveState.smoothing && waveState.smoothing.state_age_ms) || 0
  );
  const cycleAgeMs = stateAgeMs % (ULTRATHINK_ACTIVE_MS + ULTRATHINK_BREAK_MS);
  return cycleAgeMs >= ULTRATHINK_ACTIVE_MS
    ? "clawd-working-typing-boss.svg"
    : "clawd-working-ultrathink.svg";
}

function mapWavePetToClawd(waveState, options = {}) {
  const input = waveState && typeof waveState === "object" ? waveState : {};
  const state = input.state || "steady_work";
  const onlineFeatures = input.online_features && typeof input.online_features === "object"
    ? input.online_features
    : {};
  const openToolKind = String(onlineFeatures.open_tool_kind || "");

  if (state === "overheat_debugging" && options.hardFailure === true) {
    return {
      state: "error",
      displayHint: null,
      wavepet: input,
    };
  }

  if (openToolKind === "read") {
    return {
      state: "thinking",
      displayHint: "clawd-working-thinking.svg",
      wavepet: input,
    };
  }

  if (openToolKind) {
    let displayHint = "clawd-working-typing.svg";
    if (openToolKind === "test") displayHint = "clawd-working-debugger.svg";
    else if (openToolKind === "edit") displayHint = "clawd-working-typing-boss.svg";
    return {
      state: "working",
      displayHint,
      wavepet: input,
    };
  }

  let clawdState = "working";
  let displayHint = "clawd-working-typing.svg";

  if (state === "reading_understanding") {
    clawdState = "thinking";
    displayHint = "clawd-working-thinking.svg";
  } else if (state === "steady_work") {
    clawdState = "working";
    displayHint = "clawd-working-typing.svg";
  } else if (state === "deep_output") {
    clawdState = "working";
    displayHint = getUltrathinkDisplayHint(input);
  } else if (state === "overheat_debugging") {
    clawdState = "working";
    displayHint = getUltrathinkDisplayHint(input);
  } else if (state === "closing") {
    clawdState = options.completed === true ? "attention" : "thinking";
    displayHint = options.completed === true ? null : "clawd-working-thinking.svg";
  }

  return {
    state: clawdState,
    displayHint,
    wavepet: input,
  };
}

module.exports = {
  mapWavePetToClawd,
};
