"""Exercise the actual JS/Python state engines and atomic file bridge."""
import json
from pathlib import Path
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parent.parent
PLUGIN = ROOT / "plugins" / "wavepet"
SAMPLE = PLUGIN / "examples" / "sample_events.jsonl"
EVENT_COUNT = len([line for line in SAMPLE.read_text().splitlines() if line.strip()])


def run(*args):
    return subprocess.run(args, cwd=ROOT, check=True, capture_output=True, text=True).stdout


for name, args in [
    ("desktop JS", ("node", "scripts/replay-wavepet.js", str(SAMPLE))),
    ("plugin Python", (sys.executable, str(PLUGIN / "scripts/pet_state_engine.py"), "--events", str(SAMPLE))),
]:
    rows = [json.loads(line) for line in run(*args).splitlines()]
    assert len(rows) == EVENT_COUNT == 8, (name, len(rows))
    assert rows[-1]["state"] == "overheat_debugging", (name, rows[-1]["state"])
    assert rows[-1]["presentation"]["motion"] == "shake", name
    assert rows[-1]["session_id"] == "sample", name
    assert {"signals", "presentation", "smoothing"} <= rows[-1].keys(), name
    print(f"{name}: {len(rows)} input events, failed-test pressure -> overheat_debugging")

with tempfile.TemporaryDirectory(prefix="ai-pets-bridge-") as directory:
    summary = json.loads(run(
        sys.executable, str(PLUGIN / "scripts/pet_state_bridge.py"),
        "--events", str(SAMPLE), "--out-dir", directory, "--history",
    ))
    latest = json.loads((Path(directory) / "current_state.json").read_text())
    history = [json.loads(line) for line in (Path(directory) / "state_history.jsonl").read_text().splitlines()]
    assert summary["states_written"] == len(history) == EVENT_COUNT
    assert latest == history[-1]
    assert latest["state"] == "overheat_debugging"
    print("file bridge: all 8 states recorded, latest snapshot matches final history record")
