---
name: design-skills
description: "Create a real, runnable Pomodoro study-room web page from the user's product prompt and supplied reference image. Use for requests to design or build a study timer, Pomodoro page, course-based focus tracker, immersive learning webpage, or image-inspired web tool. This skill must produce files, test the page, and return the generated index.html path rather than only explaining or proposing a design."
---

# Design Skills

You are the single end-to-end builder. Finish the webpage; do not stop after planning.

## Mandatory result

Create a runnable folder containing:

```text
study-room-output/
├── index.html
├── styles.css
├── app.js
└── assets/background.png
```

At the end, report the absolute path to `study-room-output/index.html`.

## Reliable execution workflow

1. Locate this Skill's own directory, the directory containing this `SKILL.md`.
2. Locate the user's supplied image:
   - Prefer an image explicitly attached or named by the user.
   - If its filesystem path is unavailable, use `assets/example-background.png`.
   - Never stop only because no image path is available.
3. Run the bundled builder using absolute paths:

   ```bash
   python3 "<skill-directory>/scripts/build_study_room.py" \
     --output "<current-workspace>/study-room-output" \
     --background "<image-path>"
   ```

   If there is no usable image path, omit `--background`.

4. Apply only the user's requested copy or style changes after the builder succeeds.
5. Open or serve `study-room-output/index.html`.
6. Test the real interactions using `references/acceptance-checklist.md`.
7. Fix failures before returning.

Do not merely describe commands. Execute them.

## Product requirements

Unless the user explicitly changes them, the generated page must include:

- Default 25-minute focus and 5-minute rest.
- Automatic focus-to-rest and rest-to-focus switching.
- Add and select courses.
- Record naturally completed focus sessions against the selected course.
- Show today's completed focus sessions and focused minutes.
- Preserve courses, records, and active countdown after reload.
- Start, pause, continue, and end controls.

## Image-based design requirements

- Use the supplied image as the full-screen background.
- Analyze its colors, lighting, visual density, typography mood, and atmosphere.
- Do not copy text, logos, or branded UI from the image.
- Keep the result calm, immersive, and suitable for studying.
- Keep the timer area transparent; do not add a central card unless the user asks for one.

## Scope limits

Do not add login, music, task management, social features, charts, scene switching, a backend, or unrelated features.

## Fallback rule

The bundled template is the reliable baseline. Prefer delivering the working baseline over stopping, asking unnecessary questions, or returning only a design proposal.

For copy customization, read `references/customization-map.md`.
