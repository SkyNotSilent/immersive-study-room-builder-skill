# Customization Map

Use this file only when changing user-facing copy or timing defaults.

## Text changes

Edit `index.html`:

- Browser title: `<title>窗边自习室</title>`
- Product name: `<strong>窗边自习室</strong>`
- Subtitle: `<small>让时间慢下来</small>`
- Intro sentence: element with `id="timer-note"`
- Footer sentence: `.footer-note`

## Timing changes

Edit `index.html`:

- Change each preset button's visible label and `data-minutes` together.

Edit `app.js`:

- Change every `25` in `initialState` to the requested default duration.
- Keep the allowed custom range at 1–180 unless explicitly requested otherwise.

## Background/readability changes

Edit `styles.css`:

- Background path is `url("./assets/background.png")`.
- Increase overlay opacity only if text is difficult to read.
- Do not add a card behind the timer.

## User prompt template

The user can provide:

```text
Use the immersive study room skill.
Background image: <attached image>
Product name: <name>
Subtitle: <short sentence>
Default duration: <minutes>
Presets: <three minute values>
Keep the page completely transparent with no central card.
```
