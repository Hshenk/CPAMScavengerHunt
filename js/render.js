export function renderHunt(questions, showAnswers, lang) {
    const left = document.getElementById("bubbles-left");
    const right = document.getElementById("bubbles-right");

    left.querySelectorAll(".bubble").forEach(node => node.remove());
    right.querySelectorAll(".bubble").forEach(node => node.remove());

    const template = document.getElementById("bubble-template");

    questions.forEach((q, index) => {
        const fragment = template.content.cloneNode(true); // stamp a new bubble
        const bubble = fragment.querySelector(".bubble"); // grab the new bubble to fill in


        bubble.querySelector(".bubble-number").textContent = index + 1;

        const img = bubble.querySelector(".bubble-img");
        const suffix = showAnswers ? "-a" : ""; // adds an 'a' if we are showing answers
        const useSpanish = lang === "es" && q.hasSpanish;
        const folder = useSpanish ? "spanish/s-" : "";
        img.src = `assets/questions/${folder}q${q.id}${suffix}.png`;
        img.alt = (lang === "es" && q.titleEs) || q.title; // If we can't find an image with that idea, just show text

        const column = index % 2 === 0 ? right : left; // decides what place the bubble is in based on its index
        column.appendChild(fragment); // Moves the bubble out of the fragment and into the page
    });
}

// places stars on the map based on what questions and locations we're given
export function renderMap(questions, locations) {
    // Stores the location ids and locations for each desired location
    const byId = new Map(locations.map(loc => [loc.id, loc]));
    const wanted = new Set(questions.map(q => q.locationId));

    // Clear any stars from past generations 
    document.querySelectorAll(".star").forEach(star => star.remove());

    // Loop over our wanted locations and place them
    for (const id of wanted) {
        const loc = byId.get(id);
        if (!loc) continue; // skip if we can't find a matching location

        const floor = document.querySelector(`.map-floor[data-floor="${loc.floor}"]`);
        if (!floor) continue;

        const star = document.createElement("span");
        star.className = "star";
        star.textContent = "★";
        star.style.left = `${loc.x}%`;
        star.style.top = `${loc.y}%`;
        floor.appendChild(star);
    }
}