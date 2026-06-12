#!/usr/bin/env python3
"""Create a runnable study-room webpage from the bundled verified template."""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output",
        default="study-room-output",
        help="Output directory. Defaults to ./study-room-output",
    )
    parser.add_argument(
        "--background",
        help="Optional PNG/JPG/WebP background. Uses bundled image if omitted.",
    )
    args = parser.parse_args()

    skill_dir = Path(__file__).resolve().parent.parent
    template_dir = skill_dir / "assets" / "template"
    output_dir = Path(args.output).expanduser().resolve()
    background = (
        Path(args.background).expanduser().resolve()
        if args.background
        else skill_dir / "assets" / "example-background.png"
    )

    if not template_dir.is_dir():
        raise SystemExit(f"Bundled template not found: {template_dir}")
    if not background.is_file():
        raise SystemExit(f"Background image not found: {background}")

    output_dir.mkdir(parents=True, exist_ok=True)
    shutil.copytree(template_dir, output_dir, dirs_exist_ok=True)
    (output_dir / "assets").mkdir(exist_ok=True)
    shutil.copy2(background, output_dir / "assets" / "background.png")

    required = ["index.html", "styles.css", "app.js", "assets/background.png"]
    missing = [name for name in required if not (output_dir / name).is_file()]
    if missing:
        raise SystemExit(f"Generation failed; missing files: {', '.join(missing)}")

    print(f"SUCCESS: {output_dir / 'index.html'}")


if __name__ == "__main__":
    main()
