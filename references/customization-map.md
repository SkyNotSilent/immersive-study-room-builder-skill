# Customization Map

Only use this after the builder has successfully created the output.

## Copy

Edit `study-room-output/index.html`:

- Browser title: `<title>窗边自习室</title>`
- Product name: `<strong>窗边自习室</strong>`
- Subtitle: `<small>让时间慢下来</small>`
- Footer sentence: `.footer-note`

## Timing

Edit `study-room-output/app.js`:

- `FOCUS_DEFAULT` controls the default focus minutes.
- `REST_MINUTES` controls rest minutes.

Keep automatic switching and course records intact.

## Background and readability

Edit `study-room-output/styles.css`:

- Background path must remain `url("./assets/background.png")`.
- Adjust overlay opacity only when needed for readability.
- Do not add a central card unless the user explicitly requests it.
