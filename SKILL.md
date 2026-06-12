---
name: design-skills
description: "Create a real, runnable Pomodoro study-room web page from the user's product prompt and supplied reference image. Use for requests to design or build a study timer, Pomodoro page, course-based focus tracker, immersive learning webpage, or image-inspired web tool. This skill must produce files, test the page, and return the generated index.html path rather than only explaining or proposing a design."
---

# Design Skills

You are the single end-to-end builder. Finish the webpage; do not stop after planning.

## Mandatory visible progress

This is a demonstration workflow. Keep the user informed with short, visible stage updates while working.

Do not reveal private chain-of-thought or long internal reasoning. Show only concise progress, decisions, and results.

Use these stages in order:

1. **正在理解需求**
   - State the essential product requirements you extracted in one short sentence.
2. **正在分析参考图**
   - State the visual direction inferred from the supplied image in one short sentence.
3. **正在规划功能**
   - State the implementation plan: timer phases, courses, records, and persistence.
4. **正在设计交互**
   - State the main interaction decision and how the interface stays focused.
5. **正在生成网页**
   - Create the actual files. Do not stop after this status update.
6. **正在测试与优化**
   - Test real interactions and briefly report what was verified or fixed.
7. **交付完成**
   - Report the runnable `index.html` path and summarize the delivered functions.

Rules for progress updates:

- Send the first update before reading or editing files.
- Send another update whenever moving to the next major stage.
- Each update should be one or two short sentences.
- Never claim a stage is complete before performing its work.
- Do not ask the user to continue between stages.
- Continue autonomously until delivery unless genuinely blocked.

Read `references/progress-example.md` when you need an example of the expected progress tone and level of detail.

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

1. Show **正在理解需求**, then extract the mandatory requirements.
2. Show **正在分析参考图**, then inspect the supplied image.
3. Show **正在规划功能**, then locate this Skill's own directory, the directory containing this `SKILL.md`.
4. Locate the user's supplied image:
   - Prefer an image explicitly attached or named by the user.
   - If its filesystem path is unavailable, use `assets/example-background.png`.
   - Never stop only because no image path is available.
5. Show **正在设计交互**, then decide the visual and interaction treatment.
6. Show **正在生成网页**, then run the bundled builder using absolute paths:

   ```bash
   python3 "<skill-directory>/scripts/build_study_room.py" \
     --output "<current-workspace>/study-room-output" \
     --background "<image-path>"
   ```

   If there is no usable image path, omit `--background`.

7. Apply only the user's requested copy or style changes after the builder succeeds.
8. Show **正在测试与优化**, then open or serve `study-room-output/index.html`.
9. Test the real interactions using `references/acceptance-checklist.md`.
10. Fix failures before returning.
11. Show **交付完成** and report the final absolute path.

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
