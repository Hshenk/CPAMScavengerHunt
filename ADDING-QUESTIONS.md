# How to Add a Scavenger Hunt Question

*A guide for museum staff — no programming knowledge needed. Adding a question
takes about 10 minutes and never touches the website's code.*

Each question on a printed hunt is really just a **picture** — the question's
text and images, designed in Canva. The website draws the colored rounded
bubble itself (colors follow a fixed pattern on the page), places your picture
on top, adds the numbers, and lights up stars on the map. So adding a question
means: make the picture, save two copies, and fill in one short form-style
text entry.

## Step 1 — Design the question in Canva

1. Open the shared **"Scavenger Hunt Bubbles"** Canva file and **duplicate any
   existing question page** (right-click the page → Duplicate). Starting from a
   copy keeps the size and style consistent.
2. Edit the text: the **"Find …"** line, the question, and leave the blank
   answer line. Add any pictures you like (hint photos, logos, things to circle).
3. **Three rules that keep the page assembly working:**
   - Don't resize the page. It must stay **3.8 × 1.7 inches**.
   - **Don't add a background or colored box** — the page background must stay
     transparent (the website draws the colored bubble behind your design).
   - Keep the **top-left corner** (about a half-inch square) **empty** — the
     website prints the question's number there automatically.

## Step 2 — Make the answer version

1. Duplicate your finished bubble page.
2. On the copy, type the answer on the blank line (bold), circle the correct
   picture if it's a circle-the-answer question, etc. This page becomes the
   teacher answer key.

## Step 3 — Pick the question's ID number and export

1. Open the `assets/questions/` folder in the project and look at the existing
   files (`q1.png`, `q2.png`, … `q9.png`). Your new question's ID is the **next
   number that has never been used** — if the highest is `q9`, yours is `10`.
   ⚠️ Never reuse an old number, even if that question was retired — printed
   hunt codes from past visitors depend on the old numbers staying put.
2. In Canva: **Share → Download → PNG**, size **1140 × 510 px** (that's 300 DPI),
   **check the "Transparent background" box**, and select just your two pages.
   ⚠️ The transparent checkbox matters — a normal export has a solid white
   background that would hide the bubble's color on the printed page.
3. Rename and save both files into `assets/questions/`:
   - Question version → `q10.png`
   - Answer version → `q10-a.png`

## Step 4 — Register the question (one text entry)

Open `data/questions.json` in any text editor (Notepad is fine). Find the last
question entry — it looks like the block below. Add a **comma after its closing
brace**, then paste and fill in your own block before the final `]`:

```json
    {
      "id": 10,
      "title": "Short label shown in the hunt builder",
      "category": "history",
      "difficulty": "easy",
      "locationId": "gallery-1",
      "answer": "the plain-text answer, for reference"
    }
```

- `id` — the number you chose in Step 3.
- `title` — a short label so people building hunts know what the question is.
- `category` — one of the categories listed at the top of the same file
  (currently: `history`, `planes`, `people`, `science`).
- `difficulty` — how hard the question is: one of the `id`s in
  `data/age-ranges.json` (currently `easy`, `medium`, `hard`, `very hard`). This
  sets the "Recommended for ages …" line: a hunt is rated for the **hardest**
  question it contains, so one `hard` question makes the whole sheet read as the
  older range.
- `hasSpanish` — `true` if you've also made the Spanish version (see below),
  otherwise `false`. Questions marked `false` simply don't appear when someone
  builds a hunt in Spanish.
- `locationId` — where in the museum the answer is found; this controls the
  star on the hint map. Valid names are in `data/locations.json`
- `answer` — for museum records and the builder; the printed answer key uses
  your `q10-a.png` image.

> **Want a new difficulty tier or different age ranges?** Edit
> `data/age-ranges.json`: each entry is `{ "id", "name", "range", "level" }`.
> `range` is the text printed on the hunt (e.g. `"8–12"`), `name` is the builder
> tag label, and `level` orders them (bigger = harder). Keep the `level` numbers
> distinct.

**Careful with commas:** every `{ … }` block is separated from the next by a
comma, but the *last* block has no comma after it. If the website's builder page
stops loading after your edit, it's almost always a missing or extra comma here.
Paste the whole file into <https://jsonlint.com> to find the exact spot.

## Step 5 — Check your work

1. Open the hunt builder website.
2. Your new question should appear in the **hand-pick list**. Tick it, generate
   a hunt, and check:
   - the bubble looks right and the number badge isn't covering anything;
   - the answer sheet shows your answer version;
   - the map star appears in the right place.
3. Done — publish/commit the three changed items (`q10.png`, `q10-a.png`,
   `questions.json`) the usual way for this project.

## Adding a Spanish version of a question

The website can print hunts in Spanish. A question appears in Spanish mode once
it has Spanish artwork:

1. In the Canva file, duplicate the question's two pages and translate the text
   (same size, same rules: transparent background, top-left corner clear).
2. Export both with **Transparent background**, named with an `s-` prefix:
   `s-q10.png` and `s-q10-a.png`.
3. Save them into `assets/questions/spanish/` (note: the *plain* English files
   stay where they were).
4. In `data/questions.json`, change that question's `"hasSpanish": false` to
   `true`, and add a Spanish label line right under the English `"title"`:

   ```json
   "titleEs": "La versión en español del título",
   ```

   (Without it, the builder's Spanish list shows the English title.)
5. Check it: switch the builder's language dropdown to Español — the question
   should now appear in the list, and a hunt containing it should show the
   Spanish bubble.

A question without a Spanish version is never offered when building in Spanish,
so there's no rush — translate at your own pace.

## Retiring a question

Just delete its block from `data/questions.json` (mind the commas). Leave the
PNG files and never reuse its ID — old printed codes that include it will simply
report "this hunt contains a retired question" rather than breaking.
