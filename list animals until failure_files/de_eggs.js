// Easter Eggs und Spezialfunktionen für die deutsche Version
// Die meisten Q-IDs bleiben gleich, da sie sprachunabhängig sind

function ancests(possible_ancestor_id, guess_id) {
    var ancestor_id = PARENT[guess_id];
    while (PARENT[ancestor_id]) {
        if (ancestor_id == possible_ancestor_id) { return true; }
        ancestor_id = PARENT[ancestor_id];
    }
}

major_groups = {
    Bird: 'Q5113'  // Vögel
}

function descendant_streak(ancestor, length) {
    if (guessed_ids.length < length) { return false; }
    for (guess_id of guessed_ids.slice(-length)) {
        if (!ancests(ancestor, guess_id)) { return false; }
    }
    return true;
}

function progress_egg() {
    // Himmel-Hintergrund bei vielen Vögeln
    if (descendant_streak(major_groups.Bird, 16) && !document.body.classList.contains('sky')) {
        document.body.classList = ['sky']
    }
    // Wasser-Hintergrund bei vielen Fischen (Q25371 = Fische)
    if (descendant_streak('Q25371', 8)) {
        document.body.classList = ['water'];
    }
    // Spinne bei vielen Spinnen (Q1357 = Spinnen)
    if (descendant_streak('Q1357', 8)) {
        spider.style.display = 'block';
        visualshint.style.display = 'block';
    }
    // Fledermaus bei vielen Fledermäusen (Q28425 = Fledermäuse)
    if (descendant_streak('Q28425', 3)) {
        bat.style.display = 'block';
        visualshint.style.display = 'block';
    }
    // Schnecke bei vielen Schnecken (Q4867740 = Landschnecken)
    if (descendant_streak('Q4867740', 3)) {
        snail.style.display = 'block';
        visualshint.style.display = 'block';
    }
}

function invalid_guess_egg_message(guess) {
    // Mythische Kreaturen
    if (guess=='drache' || guess=='einhorn' || guess=='yeti' || guess=='bigfoot') {
        return 'Nur echte Tiere, bitte.';
    }
    
    // Keine Tiere
    if (guess=='alge' || guess=='algen' || guess=='seetang') { return 'Nein.'; }
    if (guess=='bakterie' || guess=='bakterien') { return 'Bakterien sind keine Tiere.'; }
    if (guess=='pilz') { return 'Nein, Pilze sind keine Tiere.'; }
    if (guess=='pflanze') { h1.innerText = "TIERE auflisten bis zum Versagen"; return ' '; }
    
    // Zu vage
    if (guess=='fisch') { return 'Du kannst doch bestimmt einen bestimmten Fisch nennen!'; }
    if (guess=='plankton') { return 'Der Begriff „Plankton" bezeichnet alle treibenden Organismen ohne Antrieb.'; }
    if (guess=='larve') { return 'Viele Tiere haben ein Larvenstadium. Kannst du spezifischer sein?'; }
    
    // Kulinarische Begriffe
    if (guess=='schnitzel' || guess=='steak' || guess=='schinken' || guess=='speck') {
        return 'Das bezeichnet nur das Fleisch des Tieres.';
    }
    
    // Hilfe
    if (guess=='hilfe' || guess=='hint' || guess=='tipp') {
        return 'Denk an ' + choice(['Insekten','Bauernhoftiere','Dinosaurier','Fische','Vögel']) + '.';
    }
    if (guess=='hilfe' && !guessed_ids.length) { rules.open = true; return ' '; }
}

awoo = 'awu';
function valid_guess_egg_message(guess, guess_id) {
    // Einhorn (als Spinnenart)
    if (guess == 'einhorn') {
        return 'Du meinst wahrscheinlich nicht die Spinnenart, aber okay.';
    }
    // Mensch
    if (guess_id == 'Q15978631') { return 'Das bin ich!'; }
    // Wolf-Geheul
    if (LOWER_TITLE_TO_ID.wolf && ancests(LOWER_TITLE_TO_ID.wolf, guess_id)) {
        awoo += 'u';
        return awoo + '!';
    } else { awoo='awu'; }
}

const HUNDE_NACHRICHT = [
    "Hunde sind Hunde.",
    "Das ist immer noch ein Hund.",
    "Hunde sind das gleiche Tier!",
    "Die sind nicht so unterschiedlich!",
    "Es sind alle gleich!!",
    "Hör auf, Hunde aufzulisten!!"
]
dog_index = 0;

function equivalence_egg_message(guess, guess_id) {
    // Taube/Tauben-Check
    if (guess_id == 'Q10856' && (guess=='taube' || guess=='tauben')) {
        return 'Tauben und Tauben sind... nun ja, das gleiche Wort auf Deutsch.';
    }
    // Hunde-Check
    if (LOWER_TITLE_TO_ID.hund && guess_id==LOWER_TITLE_TO_ID.hund) {
        if (dog_index > 3) { h1.innerText = "Tiere AUSSER HUNDEN auflisten"; }
        return HUNDE_NACHRICHT[dog_index++] || "Das reicht!!";
    }
}

function ancestry_egg_message(guess, descendant_id, ancestor_id) {
    // Kröte/Frosch
    if (LOWER_TITLE_TO_ID['kröte'] && descendant_id==LOWER_TITLE_TO_ID['kröte'] && ancestor_id=='Q53636') {
        return '(Kröten sind Frösche.)';
    }
    // Schildkröten
    if (LOWER_TITLE_TO_ID['landschildkröte'] && LOWER_TITLE_TO_ID['schildkröte'] &&
        descendant_id==LOWER_TITLE_TO_ID['landschildkröte'] && ancestor_id==LOWER_TITLE_TO_ID['schildkröte']) {
        return '(Im Deutschen ist die Unterscheidung klarer als im Englischen.)';
    }
}

function egg_manipulate_li(li, guess, guess_id) {
    // Tropfenbär fällt von oben
    if (guess == 'tropfenbär' || guess == 'drop bear') {
        li.style.position='relative';
        li.style.top='-200vh';
        li.style.transition='top 1s ease-in';
        setTimeout(()=>{ li.style.top=0; }, 10)
    }
}

// Trivia-Funktionen
localStorage.triviaHashes ||= '';

function queue_trivium_once(html) {
    let h = hashString(html);
    if (!localStorage.triviaHashes.split(' ').includes(''+h)) {
        queue_trivium(html);
        localStorage.triviaHashes += ' ' + h;
    }
}

function queue_trivium(html) {
    let p = document.createElement('p');
    p.innerHTML = html;
    p.classList.add('trivium');
    trivia.append(p);
}

shy_trivia = [];
function queue_shy_trivium(html) {
    if (!localStorage.triviaHashes.split(' ').includes(''+hashString(html))) {
        shy_trivia.push(html);
    }
}

// Häufige Tiere für "Du hast X vergessen"
COMMONS = ['Q26972265','Q140','Q18498','Q780','Q787','Q19939','Q29350771','Q146']; // Hund, Löwe, Wolf, Huhn, Schwein, Tiger, Schaf, Katze
DU_HAST_VERGESSEN = [
    "Du hast * nicht genannt.", "Du hast * vergessen.",
    'Hast du nicht an * gedacht?', 'Nächstes Mal: *!',
    'Was ist mit *?', 'Noch nie von * gehört?'
]

function queue_final_trivia() {
    if (!trivia.innerText && shy_trivia[0]) {
        queue_trivium_once(shy_trivia.pop());
    }
    shy_trivia = [];
    
    // "Du hast X vergessen" Nachricht
    if (
        !trivia.innerText
        && score > 3
        && LOWER_TITLE_TO_ID.vogel && guessed_descendant[LOWER_TITLE_TO_ID.vogel]
        && LOWER_TITLE_TO_ID.insekt && guessed_descendant[LOWER_TITLE_TO_ID.insekt]
    ) {
        for (common_id of COMMONS) {
            if (Math.random() < 0.15) break;
            if (!guessed_ids.includes(common_id) && !guessed_descendant[common_id] && ID_TO_TITLE[common_id]) {
                let msg = DU_HAST_VERGESSEN[Math.floor(Math.random() * DU_HAST_VERGESSEN.length)];
                queue_trivium_once(msg.replace('*', ID_TO_TITLE[common_id]));
                break;
            }
        }
    }
}

function try_queue_pic_for(guess_id) {
    // Bilder sind optional
    if (typeof ID_TO_PICS !== 'undefined') {
        let pics = ID_TO_PICS[guess_id];
        if (pics) {
            return queue_pic_once(choice(pics));
        }
    }
    return 0;
}

localStorage.picHashes ||= '';
function queue_pic_once(pic) {
    if (!pic) return 0;
    let h = hashString(pic.src);
    if (localStorage.picHashes.split(' ').includes(''+h)) { return 0; }
    localStorage.picHashes += ' ' + h;
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    details.append(summary);
    summary.innerText = 'Foto: ' + (pic.title || pic.alt)
    const img = document.createElement('img');
    img.setAttribute('src', pic.src);
    img.setAttribute('alt', pic.alt);
    details.append(img);
    if (pic.artist && pic.artist.attribution) {
        const p = document.createElement('p');
        p.innerHTML = pic.artist.attribution;
        details.append(p);
    }
    details.classList.add('pic');
    trivia.append(details);
    return 1;
}

// Einfache Hash-Funktion
function hashString(str) {
    let h1 = 3735928559, h2 = 0x41c6ce57;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

// Alias für Kompatibilität
const hash = hashString;

function choice(l) { return l[Math.floor(Math.random()*l.length)]; }
