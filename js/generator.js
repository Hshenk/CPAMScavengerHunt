export function generateHunt({ pinnedIds, categoryCounts, pool }) {
    const chosen = [...pinnedIds];

    for (const [category, count] of Object.entries(categoryCounts)) {
        const candidates = pool
        .filter(q => q.category === category &&!chosen.includes(q.id)) // right category, not already taken
        .map(q => q.id);
        
        shuffle(candidates);

        // Take up to 'count', but stop if category ran out
        for (let i = 0; i < count && i < candidates.length; i++) {
            chosen.push(candidates[i]);
        }
    }

    shuffle(chosen); // randomize page order
    
    return chosen;
}


// Fisher-Yates shuffle as JS does not have
// a built-in shuffler
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // random index 0..i
        [array[i], array[j]] = [array[j], array[i]];
    }
}