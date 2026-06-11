const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // No I,L,O,U to prevent mix-ups

export function encodeHunt(questionIds) {
    let bits = 0, value = 0, out = "";

    // Loop over every id in question IDs
    for (const id of questionIds){
        value = (value << 8) | id;
        bits += 8;

        while (bits >= 5){
            out += ALPHABET[(value >>> bits-5) & 31];
            bits -= 5;
        }
    }

    // handle left over bits
    if (bits > 0){
        out += ALPHABET[(value << (5-bits)) & 31];
    }

    return "CPAM1-" + out;
}

export function decodeHunt(code){

    // Replace I, L, and O with numbers in case it was mistyped and change to uppercase 
    const m = /^CPAM(\d+)-([0-9A-TV-Z]+)$/i.exec(
        code.trim().toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1"));

    if (!m || m[1] !== "1") return null;


    let bits = 0, value = 0;
    const ids = [];



    // loop through each character of our code
    for (const ch of m[2]){
        value = (value << 5) | ALPHABET.indexOf(ch);
        bits += 5

        if (bits >= 8){
            ids.push((value >>> (bits - 8)) & 255);
            bits -= 8;
        }

    }

    return ids.length > 0 && ids.every(id => id >= 1) ? ids : null;

}