
// main.js: Steuert die Logik der Startseite (index.html)
// Musik-Logik jetzt zentral in music.js gekapselt
import { initMusicToggle } from './music.js';
document.addEventListener('DOMContentLoaded', () => {
    initMusicToggle();
    // Wenn der Play-Button geklickt wird, gehe zur Level-Auswahl
    document.getElementById('playBtn').addEventListener('click', () => {
        // Navigiert zur Level-Auswahl-Seite
        window.location.href = 'levels.html';
    });
});
