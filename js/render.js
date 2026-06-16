export function renderHunt(questions, showAnswers) {
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
        img.src = `assets/questions/q${q.id}${suffix}.png`;
        img.alt = q.title; // If we can't find an image with that idea, just show text

        const column = index % 2 === 0 ? right : left; // decides what place the bubble is in based on its index
        column.appendChild(fragment); // Moves the bubble out of the fragment and into the page
    });
}

// displays stars on the map based on what questions we were given
// They are already placed, just hidden
export function renderMap(questions) {
    const wanted = new Set(questions.map(q => q.locationId));

    document.querySelectorAll(".star").forEach(star => {
        // star.dataset.location reads the data-location attribute
        star.hidden = !wanted.has(star.dataset.location);
    });
}