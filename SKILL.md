---
name: immersive-study-room-builder
description: "Build a polished, minimal, full-screen immersive study-room web page from a user-provided background image and prompt. Use when the user asks for a study room, focus timer, Pomodoro page, ambient productivity page, or a webpage matching the bundled transparent editorial timer style. This skill is intentionally deterministic and suitable for weak models: copy the bundled template instead of designing or coding from scratch."
---

# Immersive Study Room Builder

Always start from the bundled template. Do not rebuild the page from scratch.

## Required inputs

- One user-provided landscape background image.
- The user's requested title, wording, and default focus duration, if provided.

If no image is provided, use `assets/example-background.png`.

## Build workflow

1. Create the output by running:

   ```bash
   python scripts/build_study_room.py \
     --output <output-directory> \
     --background <image-path>
   ```

2. Open `<output-directory>/index.html` in a browser.
3. Verify the checklist in `references/acceptance-checklist.md`.
4. Modify only the permitted fields below when the user's prompt requests them.
5. Keep the existing timer and local-storage logic unchanged unless the user explicitly requests different behavior.

## Permitted changes

- Page title and upper-left product name.
- Short subtitle and focus copy.
- Default focus duration.
- Preset durations.
- Background image.
- Text color or overlay strength when readability requires it.

## Do not add

- Cards, panels, boxes, dashboards, circular progress rings, or solid backgrounds behind the timer.
- Login, social features, task lists, sounds, scene selectors, charts, or server code.
- Browser-native number-input spinner arrows.
- New frameworks, package managers, build steps, or dependencies.

## Visual contract

- The background fills the entire viewport.
- The timer and controls float directly over the background.
- There is no central card.
- The countdown is the visual focus.
- Use editorial serif numerals and restrained book-like typography.
- While running, hide setup and records; retain only the large timer and quiet controls.

## Functional contract

- Presets and custom minute input support 1–180 minutes.
- Start, pause, continue, and end work.
- Ending early records only complete elapsed minutes.
- Natural completion adds one completed session and the full session duration.
- Today's totals persist in browser local storage.
- Reloading preserves an active countdown using its real end timestamp.

## Prompt handling

Treat the user's prompt as overrides to the bundled template, not permission to redesign freely. When the prompt conflicts with the visual or functional contract, preserve the contract unless the user explicitly says to remove it.

For exact copy-editing instructions, read `references/customization-map.md`.
