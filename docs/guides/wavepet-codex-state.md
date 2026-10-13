# WavePet Codex State

WavePet is a Codex-specific state layer for Clawd. It maps Codex JSONL activity into persistent user-perceived waiting states:

- reading/understanding
- steady work
- deep output
- overheat debugging
- closing

WavePet does not estimate exact model compute or remaining turns. It is a presentation signal for the desktop pet.

## Runtime Switch

WavePet is enabled by default. Select the behavior when launching Clawd:

```bash
# WavePet behavior
CLAWD_WAVEPET=1 npm start

# Upstream-compatible behavior without WavePet raw JSONL processing
CLAWD_WAVEPET=0 npm start
```

`0`, `false`, `off`, and `no` disable WavePet. Disabling it does not remove Codex hooks or disable Clawd's original Codex lifecycle, permission, completion, JSONL fallback, or session behavior; it only omits the additional WavePet runtime and its fine-grained state updates.

## State Triggers And Visuals

| WavePet state | Typical trigger | Clawd visual intent |
|---|---|---|
| `reading_understanding` | Early low-pressure turn, read/search tools, context gathering | Thinking / reading |
| `steady_work` | Normal command, edit, or tool progress without strong pressure | Typing / working |
| `deep_output` | User-visible assistant output around 190+ estimated tokens, long thinking, long waits, or heavier edits | Ultrathink |
| `overheat_debugging` | Failed tests, repeated errors, heavy feedback, or stalled debugging pressure | Ultrathink |
| `closing` | `task_complete` / assistant stop / wrap-up signal | Existing completion behavior |

The WavePet state and the currently displayed animation are related but not identical. Live tool activity temporarily interrupts a long-running ultrathink animation without discarding the underlying state:

| Live activity | Temporary visual |
|---|---|
| Read / search tool | Thinking |
| Command | Typing |
| File edit | Boss typing |
| Test / diagnostic command | Debugger / magnifying glass |

Continuous `deep_output` or `overheat_debugging` uses ultrathink for up to 60 seconds, then takes a 12-second boss-typing visual break before the cycle can repeat. A real hard failure still overrides these presentation rules with Clawd's error state.

## Manual Smoke

1. Start Clawd with Codex enabled.
2. Start a Codex session.
3. Ask a prompt that requires reading several files.
4. Confirm the pet shows a thinking or reading visual.
5. Ask for a code edit.
6. Confirm the pet shows active working.
7. Ask for a long explanation or wait through a long command.
8. Confirm the pet shows a deep-output style visual.
9. Trigger a failing test.
10. Confirm the running test briefly shows the debugger visual and failed-test pressure returns to ultrathink.
11. Let the turn complete.
12. Confirm completion still uses the existing happy/attention behavior and does not double-fire.
