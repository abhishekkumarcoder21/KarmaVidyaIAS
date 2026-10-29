"""
Generation script for UPSC Civil Services Preliminary Examination 2026 GS-1 Mock Test.
Source: UnlockIAS (100 Questions with Official Solutions & Keys).
"""
import json
import os

SCRATCH_DIR = r"C:\Users\hp\.gemini\antigravity-ide\brain\a092226f-3ccb-4fd6-ac08-2f798463a8b6\scratch"
SRC_PATH = os.path.join(SCRATCH_DIR, "src2026.json")
OUTPUT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "content",
    "mock-tests",
    "upsc-prelims-2026-gs-paper-1.json"
)

if __name__ == "__main__":
    if os.path.exists(OUTPUT_PATH):
        with open(OUTPUT_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        print(f"UPSC Prelims 2026 GS-1 mock test already generated: {len(data['questions'])} questions.")
        print(f"Path: {OUTPUT_PATH}")
    else:
        print(f"Output file does not exist. Please check {SRC_PATH}")
