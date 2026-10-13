"use strict";

// Replay normalized WavePet events through the desktop's JavaScript engine.
// Each session owns an engine; unrelated sessions must not share pressure.
const fs = require("node:fs");
const path = require("node:path");
const { WavePetEngine } = require("../src/wavepet/engine");

const input = process.argv[2] || path.join(
  __dirname, "..", "plugins", "wavepet", "examples", "sample_events.jsonl"
);
const sessions = new Map();
for (const [index, line] of fs.readFileSync(input, "utf8").split(/\r?\n/).entries()) {
  if (!line.trim()) continue;
  let event;
  try {
    event = JSON.parse(line);
  } catch (error) {
    throw new Error(`Invalid JSON at line ${index + 1}: ${error.message}`);
  }
  if (!event || typeof event !== "object" || Array.isArray(event) || typeof event.event !== "string") {
    throw new Error(`Expected a normalized WavePet event at line ${index + 1}`);
  }
  const sessionId = String(event.session_id || "default");
  if (!sessions.has(sessionId)) sessions.set(sessionId, new WavePetEngine());
  process.stdout.write(JSON.stringify(sessions.get(sessionId).update(event)) + "\n");
}
