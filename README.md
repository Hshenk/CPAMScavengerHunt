# CPAM Scavenger Hunt Generator

A free, no-install web tool that builds printable scavenger hunts for the
College Park Aviation Museum. Teachers and families pick a preset or mix
hand-picked and random questions; the site produces a letter-size hunt sheet,
a hint map with stars, and a separate answer sheet — all printed straight from
the browser ("Save as PDF" works too). Every hunt carries a short code (e.g.
`CPAM1-K7F9Q`) that rebuilds the identical hunt when re-entered.

Question bubbles are designed in Canva and exported as standardized PNGs — the
site only assembles them, so museum staff can add questions with **zero coding**
(see [ADDING-QUESTIONS.md](ADDING-QUESTIONS.md)). For data schemas, the
hunt-code format, JS function signatures, and the asset filename contract, see
[ARCHITECTURE.md](ARCHITECTURE.md).

## Project layout

```
index.html      builder UI          data/questions.json  question metadata
hunt.html       printable hunt      data/presets.json    ready-made hunts
answers.html    answer sheet        data/locations.json  map star positions
css/            styling             js/                  generation logic (in progress)
assets/         logos, maps, fonts; assets/questions/ holds the Canva bubble PNGs
```

## Running locally

Browsers block `fetch()` of local JSON files over `file://`, so use any static
server from the repo root:

```
python -m http.server
```

then open <http://localhost:8000>. (`hunt.html` and `answers.html` currently
show a hardcoded sample hunt, so they can be opened directly to check print
styling even before the JS exists.)

## Printing

Open a hunt → **Print / Save as PDF** → destination "Save as PDF" or a printer.
Make sure **margins: None** and **background graphics: On** are selected in the
print dialog so the bubbles fill edge to edge.

## Deploying to GitHub Pages

1. Push to GitHub (`main` branch).
2. Repo **Settings → Pages → Build and deployment**: Source = "Deploy from a
   branch", Branch = `main`, folder = `/ (root)`. Save.
3. After a minute the site is live at `https://<username>.github.io/<repo>/`.
   Every later push to `main` redeploys automatically.
