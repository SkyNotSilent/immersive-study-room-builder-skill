#!/usr/bin/env python3
"""Copy the verified study-room template and install a background image."""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True, help="Directory to create")
    parser.add_argument("--background", help="Landscape PNG/JPG/WebP background")
    args = parser.parse_args()

    skill_dir = Path(__file__).resolve().parent.parent
    template_dir = skill_dir / "assets" / "template"
    output_dir = Path(args.output).expanduser().resolve()

    output_dir.mkdir(parents=True, exist_ok=True)
    shutil.copytree(template_dir, output_dir, dirs_exist_ok=True)

    if args.background:
        background = Path(args.background).expanduser().resolve()
        if not background.is_file():
            raise SystemExit(f"Background image not found: {background}")
        shutil.copy2(background, output_dir / "assets" / "background.png")

    print(f"Created study room: {output_dir / 'index.html'}")


if __name__ == "__main__":
    main()
