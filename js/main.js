import { encodeHunt, decodeHunt } from "./seed.js";
import { generateHunt } from "./generator.js";
import { renderHunt, renderMap } from "./render.js";

// check what page we're on
const page = document.body.dataset.page;

if (page === "hunt" || page === "answers") {
    initHuntPage(page);
} else if (page === "builder") {
    initBuilderPage();
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}


// async is a javascript thing that allows a function to fetch info, returning a 'promise'
// The browser will still work with that placeholder 'promise'
// Then, when the function finishes, it resolves with the real info
async function initHuntPage(page) {
    // ?code=... from URL
    const code = new URLSearchParams(location.search).get("code");
    const ids = code ? decodeHunt(code) : null; // null if missing or malformed

    // load master question list
    const data = await fetch("data/questions.json").then(r => r.json());

    // Map id -> question object
    const byId = new Map(data.questions.map(q => [q.id, q]));

    // Valid only if the code decoded and every id is real
    if (!ids || !ids.every(id => byId.has(id))) {
        document.body.innerHTML = 
        "<p style='padding:2rem;font:bold 1.2rem sans-serif'>" + 
        "Sorry - that hunt code isn't valid. Please check it and try again.</p>";
        return; // Nothing else to render so we exit
    }

    //Rebuild the questions in the code's exact order
    const questions = ids.map(id => byId.get(id));

    renderHunt(questions, page === "answers");
    if (page === "hunt") {
        const locations = await
        fetch("data/locations.json").then(r => r.json());
        renderMap(questions, locations);
    }

    // Always display the canonical code
    const canonical = encodeHunt(ids);
    setText("hunt-code", canonical);
    setText("hunt-code-map", canonical);
    setText("toolbar-code-value", canonical);

    const linkId = page === "hunt" ? "answers-link" : "hunt-link";
    const target = page === "hunt" ? "answers.html" : "hunt.html";
    const link = document.getElementById(linkId);
    if (link) link.href = `${target}?code=${canonical}`;
}


async function initBuilderPage() {
    // Fetch both files at once
    // Promise.all waits for both to finish.
    const [questionsData, presetsData] = await Promise.all([
        fetch("data/questions.json").then(r => r.json()),
        fetch("data/presets.json").then(r => r.json()),
    ]);
    const pool = questionsData.questions;

    buildPresets(presetsData.presets);
    buildCategoryControls(questionsData.categories, pool);
    buildQuestionList(pool);
    wireGenerate(pool);
    wireLoadCode(pool);
    updateSummary(); // set the initial "0 questions" line and button state
}

function buildPresets(presets) { 
    const list = document.getElementById("preset-list");
    const template = document.getElementById("preset-template");
    for (const preset of presets) {
        const fragment = template.content.cloneNode(true);
        fragment.querySelector(".preset-name").textContent = preset.name;
        fragment.querySelector(".preset-description").textContent = preset.description;
        fragment.querySelector(".preset-count").textContent = `${preset.questionIds.length} questions`;
        // Clicking a preset jumps straight to its hunt
        fragment.querySelector(".preset-card").addEventListener("click", () => {
            location.href = `hunt.html?code=${encodeHunt(preset.questionIds)}`;
        });
        list.appendChild(fragment);
    }
}



function buildCategoryControls(categories, pool) {
    const container = document.getElementById("category-controls");
    const template = document.getElementById("category-template");
    for (const category of categories) {
        const available = pool.filter(q => q.category === category).length;
        const fragment = template.content.cloneNode(true);
        fragment.querySelector(".category-name").textContent = category;
        const input = fragment.querySelector(".category-count");
        input.dataset.category = category;
        input.max = available;
        input.addEventListener("input", () => {
            if (Number(input.value) > available) input.value = available;
            updateSummary();
        });
        container.appendChild(fragment);
    }
}

function buildQuestionList(pool) {
    const list = document.getElementById("question-list");
    const template = document.getElementById("question-template");

    // Sort the list by category 
    const sorted = [...pool].sort((a, b) => 
        a.category.localeCompare(b.category) || a.id - b.id
    );


    for (const q of sorted) {
        const fragment = template.content.cloneNode(true);
        const checkbox = fragment.querySelector(".question-pin");
        checkbox.value = q.id;
        checkbox.addEventListener("change", updateSummary);
        fragment.querySelector(".question-find").textContent = q.title;
        fragment.querySelector(".question-category").textContent = q.category;
        list.appendChild(fragment);
    }
}


// Checks what questions are pinned
// Returns an array of numeric ids.
function getPinnedIds() {
    const checked = document.querySelectorAll(".question-pin:checked");
    // Convert from string id
    return [...checked].map(box => Number(box.value));
}

// Check random extras per category
function getCategoryCounts() {
    const counts = {};
    document.querySelectorAll(".category-count").forEach(input => {
        const n = Number(input.value);
        if (n > 0) counts[input.dataset.category] = n;
    });
    return counts;
}

function updateSummary() {
    const pinned = getPinnedIds().length;

    // Calculate how many pinned we have per category
    const pinnedPerCat = {};
    document.querySelectorAll(".question-pin:checked").forEach(box =>{
        const cat = box.closest(".question-row").querySelector(".question-category").textContent;
        pinnedPerCat[cat] = (pinnedPerCat[cat] || 0) + 1;
    });


    let random = 0;

    document.querySelectorAll(".category-count").forEach(input => {
        const requested = Number(input.value);
        const available = Number(input.max);
        const room = available - (pinnedPerCat[input.dataset.category] || 0);
        random += Math.max(0, Math.min(requested, room));
    });

    const total = pinned + random;

    const summary = document.getElementById("selection-summary");
    const button = document.getElementById("generate-btn");
    summary.textContent = `${pinned} pinned + ${random} random = ${total} questions`;

    if (total > 9) {
        summary.textContent += " too many! The page fits only 9 questions.";
        button.disabled = true;
    } else {
        button.disabled = total === 0;
    }
}


function wireGenerate(pool) {
    document.getElementById("generate-btn").addEventListener("click", () => {
        const ids = generateHunt({
            pinnedIds: getPinnedIds(),
            categoryCounts: getCategoryCounts(),
            pool,
        });
        location.href = `hunt.html?code=${encodeHunt(ids)}`;
    });
}


function wireLoadCode(pool) {
    const validIds = new Set (pool.map(q => q.id));
    const input = document.getElementById("code-input");
    const error = document.getElementById("code-error");
    document.getElementById("load-code-btn").addEventListener("click", () => {
        const ids = decodeHunt(input.value);
        if (ids && ids.every(id => validIds.has(id))) {
            location.href = `hunt.html?code=${encodeHunt(ids)}`;
        } else {
            error.hidden = false;
        }
    });
}