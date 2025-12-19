---
published: true
layout: post
title: "Do Newer Models Hold Up as Context Fills?"
description: "Results from a small test of context-window fill effects on newer and older models."
modified: 2025-12-18
tags:
  - AI
  - LLMs
  - Experiments
categories:
  - AI and Technology
---

My experience has always been that AI models get pretty dumb after about
50% of their context window is filled. [@vikhyatk](https://x.com/vikhyatk)
on x.com challenged my assumption and said it's been getting better. I
decided to put on a little test. The below experiment was fully conducted
and documented by gpt-5.2-codex and the codex CLI. We used the copilot cli
for the sonnet 4.5 part of the experiment.


## Experiment setup

- **Models:** `gpt-5.1-codex-max`, `gpt-5.2-codex`, `claude-sonnet-4.5`
- **Tasks:**
  - Recall: three facts inserted around ~10k tokens into the prompt
  - SVG: output a single SVG of a pelican riding a bicycle
- **Context fill levels:** 0%, 25%, 50%, 75%, 98%
- **Runs:** one run per task per context fill
- **Filler:** deterministic structured text so the prompt reaches the target token count
- **Tooling:** `uv run context_window_experiment.py`
- **CLI runners:** Codex CLI (default) and Copilot CLI via `--runner copilot --models claude-sonnet-4.5`

If you want to reproduce the results, save the script below as `context_window_experiment.py` and run `uv run context_window_experiment.py`.

<details markdown="1">
<summary>Experiment script (uv run)</summary>

```python
# /// script
# dependencies = ["tiktoken>=0.7.0"]
# ///
"""Run context window performance experiments using the Codex or Copilot CLI.

Usage:
  uv run context_window_experiment.py
  uv run context_window_experiment.py --runner copilot --models claude-sonnet-4.5
"""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import pathlib
import random
import subprocess
import time
from dataclasses import dataclass
from typing import List, Optional, Tuple

import tiktoken

DEFAULT_MODELS = ["gpt-5.1-codex-max", "gpt-5.2-codex"]
DEFAULT_CONTEXT_PCTS = [0, 25, 50, 75, 98]
DEFAULT_RUNS = 1
DEFAULT_FACT_OFFSET_TOKENS = 10_000
DEFAULT_CONTEXT_WINDOW = 200_000
DEFAULT_ENCODING = "o200k_base"
DEFAULT_RUNNER = "codex"
DEFAULT_OUTPUT_DIR = "context-window-results"

FACTS = [
    "The pelican's name is Harbor.",
    "The bicycle is painted teal with a white bell.",
    "The experiment code word is WINTER-ALPHA-7.",
]

TASK_PELICAN = "pelican_code"
TASK_RECALL = "fact_recall"

PELICAN_INSTRUCTIONS = (
    "TASK: Output a single SVG of a pelican riding a bicycle.\n"
    "Requirements:\n"
    "- Output SVG only, no Markdown, no code fences.\n"
    "- Keep the SVG within a 400x300 viewBox.\n"
    "- Use simple shapes and paths; no external assets.\n"
)

RECALL_INSTRUCTIONS = (
    "TASK: List the three facts exactly as stated in the IMPORTANT FACTS block.\n"
    "Return them as three bullet points, nothing else.\n"
)

INTRO_TEXT = (
    "You are participating in a context window experiment.\n"
    "Ignore filler text. Only follow the TASK at the end.\n"
    "Filler text begins below.\n"
)

FILLER_HEADER = "BEGIN FILLER\n"
FILLER_FOOTER = "END FILLER\n"

FACTS_HEADER = "IMPORTANT FACTS (memorize for later):\n"
FACTS_FOOTER = "END FACTS\n"

WORD_BANK = [
    "alpha",
    "bravo",
    "charlie",
    "delta",
    "echo",
    "foxtrot",
    "golf",
    "hotel",
    "india",
    "juliet",
    "kilo",
    "lima",
    "mike",
    "november",
    "oscar",
    "papa",
    "quebec",
    "romeo",
    "sierra",
    "tango",
    "uniform",
    "victor",
    "whiskey",
    "xray",
    "yankee",
    "zulu",
    "amber",
    "basil",
    "cedar",
    "dune",
    "ember",
    "fjord",
    "grove",
    "harbor",
    "ivory",
    "jade",
    "kelp",
    "linen",
    "moss",
    "nova",
    "onyx",
    "pearl",
    "quartz",
    "reef",
    "stone",
    "tulip",
    "umber",
    "velvet",
    "willow",
    "xenon",
    "yellow",
    "zephyr",
]


@dataclass
class PromptParts:
    prompt: str
    total_tokens: int
    filler_before_tokens: int
    filler_after_tokens: int
    facts_start_tokens: Optional[int]
    target_total_tokens: int


class TokenCounter:
    def __init__(self, encoding_name: str) -> None:
        self.encoding_name = encoding_name
        self.encoding = tiktoken.get_encoding(encoding_name)

    def count(self, text: str) -> int:
        return len(self.encoding.encode(text))


def parse_model_contexts(raw_pairs: List[str]) -> dict:
    model_contexts: dict = {}
    for item in raw_pairs:
        if "=" not in item:
            raise ValueError(f"Invalid model context override: {item}")
        model, window = item.split("=", 1)
        model = model.strip()
        window_value = int(window.strip())
        model_contexts[model] = window_value
    return model_contexts


def stable_seed(*parts: str) -> int:
    payload = "|".join(parts).encode("utf-8")
    digest = hashlib.sha256(payload).digest()
    return int.from_bytes(digest[:8], "big")


def make_sentence(rng: random.Random, index: int) -> str:
    words = rng.sample(WORD_BANK, 12)
    return f"FILLER {index:05d}: " + " ".join(words) + ".\n"


def build_block(rng: random.Random, sentences: int = 25) -> str:
    return "".join(make_sentence(rng, i + 1) for i in range(sentences))


def build_filler(
    target_tokens: int, counter: TokenCounter, seed_label: str
) -> Tuple[str, int]:
    if target_tokens <= 0:
        return "", 0

    rng = random.Random(stable_seed(seed_label))
    block = build_block(rng)
    block_tokens = counter.count(block)

    parts: List[str] = []
    total_tokens = 0
    index_offset = 0

    if block_tokens > 0:
        while total_tokens + block_tokens <= target_tokens:
            parts.append(block)
            total_tokens += block_tokens
            index_offset += 25

    # Build remainder with fresh sentences to avoid repeating the same block too much.
    remainder_rng = random.Random(stable_seed(seed_label, "remainder"))
    sentence_index = index_offset + 1
    while total_tokens < target_tokens:
        sentence = make_sentence(remainder_rng, sentence_index)
        sentence_tokens = counter.count(sentence)
        if total_tokens + sentence_tokens > target_tokens:
            break
        parts.append(sentence)
        total_tokens += sentence_tokens
        sentence_index += 1

    padding_unit = " filler"
    padding_tokens = counter.count(padding_unit)
    while total_tokens + padding_tokens <= target_tokens:
        parts.append(padding_unit)
        total_tokens += padding_tokens

    parts.append("\n")
    return "".join(parts), total_tokens


def build_facts_block() -> str:
    lines = [FACTS_HEADER]
    for fact in FACTS:
        lines.append(f"- {fact}\n")
    lines.append(FACTS_FOOTER)
    return "".join(lines)


def build_prompt(
    *,
    task: str,
    target_total_tokens: int,
    counter: TokenCounter,
    fact_offset_tokens: int,
    seed_label: str,
) -> PromptParts:
    if task == TASK_PELICAN:
        task_instructions = PELICAN_INSTRUCTIONS
        include_facts = False
    elif task == TASK_RECALL:
        task_instructions = RECALL_INSTRUCTIONS
        include_facts = True
    else:
        raise ValueError(f"Unknown task: {task}")

    intro = INTRO_TEXT + FILLER_HEADER
    intro_tokens = counter.count(intro)

    facts_block = build_facts_block() if include_facts else ""
    facts_tokens = counter.count(facts_block)

    task_tokens = counter.count(task_instructions)
    footer_tokens = counter.count(FILLER_FOOTER)

    if include_facts:
        filler_before_target = max(0, fact_offset_tokens - intro_tokens)
        filler_before, filler_before_tokens = build_filler(
            filler_before_target, counter, f"{seed_label}|before"
        )
        facts_start_tokens = intro_tokens + filler_before_tokens
    else:
        filler_before = ""
        filler_before_tokens = 0
        facts_start_tokens = None

    fixed_tokens = (
        intro_tokens
        + filler_before_tokens
        + facts_tokens
        + footer_tokens
        + task_tokens
    )

    filler_after_target = max(0, target_total_tokens - fixed_tokens)
    filler_after, filler_after_tokens = build_filler(
        filler_after_target, counter, f"{seed_label}|after"
    )

    prompt = "".join(
        [
            intro,
            filler_before,
            facts_block,
            filler_after,
            FILLER_FOOTER,
            task_instructions,
        ]
    )

    total_tokens = counter.count(prompt)

    return PromptParts(
        prompt=prompt,
        total_tokens=total_tokens,
        filler_before_tokens=filler_before_tokens,
        filler_after_tokens=filler_after_tokens,
        facts_start_tokens=facts_start_tokens,
        target_total_tokens=target_total_tokens,
    )


def run_cli(
    *,
    runner: str,
    prompt: str,
    prompt_path: pathlib.Path,
    model: str,
    output_path: pathlib.Path,
    log_path: pathlib.Path,
) -> Tuple[int, float]:
    if runner == "codex":
        cmd = [
            "codex",
            "exec",
            "-m",
            model,
            "--color",
            "never",
            "--output-last-message",
            str(output_path),
        ]

        start = time.time()
        with log_path.open("w", encoding="utf-8") as log_file:
            proc = subprocess.run(
                cmd,
                input=prompt,
                text=True,
                stdout=log_file,
                stderr=log_file,
                check=False,
            )
        end = time.time()
        return proc.returncode, end - start

    if runner == "copilot":
        cmd = [
            "copilot",
            "--model",
            model,
            "--no-color",
            "--stream",
            "off",
            "--silent",
            "--add-dir",
            str(prompt_path.parent),
            "--prompt",
            f"@{prompt_path}",
        ]

        start = time.time()
        with output_path.open("w", encoding="utf-8") as output_file, log_path.open(
            "w", encoding="utf-8"
        ) as log_file:
            proc = subprocess.run(
                cmd,
                text=True,
                stdout=output_file,
                stderr=log_file,
                check=False,
            )
        end = time.time()
        return proc.returncode, end - start

    raise ValueError(f"Unknown runner: {runner}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run context window experiments with Codex or Copilot CLI."
    )
    parser.add_argument(
        "--runner",
        choices=["codex", "copilot"],
        default=DEFAULT_RUNNER,
        help="CLI runner to use.",
    )
    parser.add_argument(
        "--models",
        default=",".join(DEFAULT_MODELS),
        help="Comma-separated model list.",
    )
    parser.add_argument(
        "--context-percentages",
        default=",".join(str(pct) for pct in DEFAULT_CONTEXT_PCTS),
        help="Comma-separated target context percentages.",
    )
    parser.add_argument(
        "--runs",
        type=int,
        default=DEFAULT_RUNS,
        help="Number of repetitions per task and context percentage.",
    )
    parser.add_argument(
        "--context-window",
        type=int,
        default=DEFAULT_CONTEXT_WINDOW,
        help="Context window size in tokens (default applies to all models).",
    )
    parser.add_argument(
        "--model-context",
        action="append",
        default=[],
        help="Override context window for a model (format: model=window).",
    )
    parser.add_argument(
        "--encoding",
        default=DEFAULT_ENCODING,
        help="Tokenizer encoding name for tiktoken.",
    )
    parser.add_argument(
        "--fact-offset-tokens",
        type=int,
        default=DEFAULT_FACT_OFFSET_TOKENS,
        help="Place facts around this token offset for recall tests.",
    )
    parser.add_argument(
        "--seed",
        default="context-window-experiment",
        help="Base seed label for deterministic filler generation.",
    )
    parser.add_argument(
        "--output-dir",
        default=DEFAULT_OUTPUT_DIR,
        help="Base output directory for prompts and responses.",
    )
    parser.add_argument(
        "--run-id",
        default=None,
        help="Optional run id; defaults to timestamp.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Only generate prompts and metadata; do not call the CLI.",
    )
    parser.add_argument(
        "--skip-existing",
        action="store_true",
        help="Skip runs where output files already exist.",
    )
    return parser.parse_args()


def ensure_dir(path: pathlib.Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def main() -> int:
    args = parse_args()

    models = [item.strip() for item in args.models.split(",") if item.strip()]
    percentages = [
        int(item.strip())
        for item in args.context_percentages.split(",")
        if item.strip()
    ]

    model_contexts = {model: args.context_window for model in models}
    if args.model_context:
        model_contexts.update(parse_model_contexts(args.model_context))

    run_id = args.run_id
    if not run_id:
        run_id = dt.datetime.now(dt.timezone.utc).strftime("%Y%m%dT%H%M%SZ")

    base_dir = pathlib.Path(args.output_dir) / run_id
    ensure_dir(base_dir)

    counter = TokenCounter(args.encoding)

    results_path = base_dir / "results.jsonl"

    tasks = [TASK_PELICAN, TASK_RECALL]

    for model in models:
        context_window = model_contexts.get(model, args.context_window)
        for pct in percentages:
            target_total = int(context_window * (pct / 100.0))
            for task in tasks:
                seed_label = f"{args.seed}|{task}|{pct}"
                prompt_parts = build_prompt(
                    task=task,
                    target_total_tokens=target_total,
                    counter=counter,
                    fact_offset_tokens=args.fact_offset_tokens,
                    seed_label=seed_label,
                )

                for run_index in range(1, args.runs + 1):
                    run_name = f"{model}__{pct}pct__{task}__run{run_index}"
                    run_dir = base_dir / run_name
                    ensure_dir(run_dir)

                    prompt_path = run_dir / "prompt.txt"
                    output_path = run_dir / "response.txt"
                    log_path = run_dir / "cli.log"
                    meta_path = run_dir / "meta.json"

                    if args.skip_existing and output_path.exists():
                        continue

                    prompt_path.write_text(prompt_parts.prompt, encoding="utf-8")

                    exit_code = None
                    elapsed = None
                    if not args.dry_run:
                        exit_code, elapsed = run_cli(
                            runner=args.runner,
                            prompt=prompt_parts.prompt,
                            prompt_path=prompt_path,
                            model=model,
                            output_path=output_path,
                            log_path=log_path,
                        )

                    actual_pct = (
                        prompt_parts.total_tokens / context_window
                        if context_window > 0
                        else None
                    )

                    meta = {
                        "run_name": run_name,
                        "runner": args.runner,
                        "model": model,
                        "context_window": context_window,
                        "target_context_pct": pct,
                        "target_total_tokens": prompt_parts.target_total_tokens,
                        "actual_total_tokens": prompt_parts.total_tokens,
                        "actual_context_pct": actual_pct,
                        "task": task,
                        "runs": args.runs,
                        "run_index": run_index,
                        "facts": FACTS if task == TASK_RECALL else [],
                        "facts_start_tokens": prompt_parts.facts_start_tokens,
                        "fact_offset_tokens": args.fact_offset_tokens,
                        "filler_before_tokens": prompt_parts.filler_before_tokens,
                        "filler_after_tokens": prompt_parts.filler_after_tokens,
                        "encoding": args.encoding,
                        "prompt_path": str(prompt_path),
                        "response_path": str(output_path),
                        "log_path": str(log_path),
                        "exit_code": exit_code,
                        "elapsed_seconds": elapsed,
                        "timestamp_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
                    }

                    meta_path.write_text(json.dumps(meta, indent=2), encoding="utf-8")
                    with results_path.open("a", encoding="utf-8") as results_file:
                        results_file.write(json.dumps(meta) + "\n")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

</details>

## Recall results

Exact means bullet-only output with no extra commentary.

| Context % | gpt-5.1-codex-max | gpt-5.2-codex | claude-sonnet-4.5         |
| --------- | ----------------- | ------------- | ------------------------- |
| 0         | Exact             | Exact         | Facts correct, extra text |
| 25        | Exact             | Exact         | Facts correct, extra text |
| 50        | Exact             | Exact         | Facts correct, extra text |
| 75        | Exact             | Exact         | Facts correct, extra text |
| 98        | Exact             | Exact         | Facts correct, extra text |

Copilot responses included additional commentary and formatting beyond the requested bullet-only output.

## SVG results

Below are the SVG outputs for each model at each context fill level. The response files were renamed and moved into `images/context-window-performance-dropoff/` for rendering.

### gpt-5.1-codex-max

| Context % | Output                                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| 0         | {% include image.html path="gpt-5.1-codex-max-0pct.svg" alt="gpt-5.1-codex-max SVG output at 0 percent context" %}   |
| 25        | {% include image.html path="gpt-5.1-codex-max-25pct.svg" alt="gpt-5.1-codex-max SVG output at 25 percent context" %} |
| 50        | {% include image.html path="gpt-5.1-codex-max-50pct.svg" alt="gpt-5.1-codex-max SVG output at 50 percent context" %} |
| 75        | {% include image.html path="gpt-5.1-codex-max-75pct.svg" alt="gpt-5.1-codex-max SVG output at 75 percent context" %} |
| 98        | {% include image.html path="gpt-5.1-codex-max-98pct.svg" alt="gpt-5.1-codex-max SVG output at 98 percent context" %} |

### gpt-5.2-codex

| Context % | Output                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| 0         | {% include image.html path="gpt-5.2-codex-0pct.svg" alt="gpt-5.2-codex SVG output at 0 percent context" %}   |
| 25        | {% include image.html path="gpt-5.2-codex-25pct.svg" alt="gpt-5.2-codex SVG output at 25 percent context" %} |
| 50        | {% include image.html path="gpt-5.2-codex-50pct.svg" alt="gpt-5.2-codex SVG output at 50 percent context" %} |
| 75        | {% include image.html path="gpt-5.2-codex-75pct.svg" alt="gpt-5.2-codex SVG output at 75 percent context" %} |
| 98        | {% include image.html path="gpt-5.2-codex-98pct.svg" alt="gpt-5.2-codex SVG output at 98 percent context" %} |

### claude-sonnet-4.5 (Copilot CLI)

| Context % | Output                                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| 0         | {% include image.html path="claude-sonnet-4.5-0pct.svg" alt="claude-sonnet-4.5 SVG output at 0 percent context" %}   |
| 25        | {% include image.html path="claude-sonnet-4.5-25pct.svg" alt="claude-sonnet-4.5 SVG output at 25 percent context" %} |
| 50        | No SVG output (response asked for file access)                                                                       |
| 75        | {% include image.html path="claude-sonnet-4.5-75pct.svg" alt="claude-sonnet-4.5 SVG output at 75 percent context" %} |
| 98        | {% include image.html path="claude-sonnet-4.5-98pct.svg" alt="claude-sonnet-4.5 SVG output at 98 percent context" %} |

## Takeaway

This is totally unscientific... but pretty much blows my idea out of the water.
The funny part is that I think some of the svgs actually improve as the context
window gets filled up which is... bizarre and kind of funny lol.

Hope you enjoyed the read!