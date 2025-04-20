// levels.js: Steuert die Level-Auswahl, Freischalten und Navigation

// Wird aufgerufen, wenn die Seite vollständig geladen wurde
// Musik-Logik jetzt zentral in music.js gekapselt
import { initMusicToggle } from './music.js';
document.addEventListener('DOMContentLoaded', () => {
    initMusicToggle();

    // Level-Karten-Elemente
    // Array mit allen Levelkarten-Elementen im DOM
    const levelCards = [
        document.getElementById('level0'),
        document.getElementById('level1'),
        document.getElementById('level2'),
        document.getElementById('level3'),
        document.getElementById('level4'),
        document.getElementById('level5')
    ];
    // Debug-Ausgabe: Levelkarten prüfen
    for (let i = 0; i < levelCards.length; i++) {
        if (!levelCards[i]) {
            console.error(`FEHLER: Levelkarte mit ID 'level${i}' wurde NICHT gefunden! Prüfe die levels.html.`);
        } else {
            console.log(`Levelkarte gefunden: #level${i}`);
        }
    }

    // Fortschritt aus localStorage lesen
    // 0 = nur Tutorial, 1 = Level 1 frei, ... 5 = Level 5 frei
    let unlocked = 0;
    try {
        unlocked = parseInt(localStorage.getItem('slidePuzzleLevel') || '0', 10);
    } catch(e) { unlocked = 0; }
    // Level freischalten
    for(let i=0;i<=unlocked;i++) {
        if(levelCards[i]) levelCards[i].classList.remove('locked');
    }
    // Klick auf Level 0 startet das Tutorial
    if (levelCards[0]) {
        levelCards[0].addEventListener('click', () => {
            if (levelCards[0].classList.contains('locked')) return;
            console.log('Level 0 (Tutorial) geklickt! Navigiere zu tutorial.html');
            window.location.href = 'tutorial.html';
        });
    }
    // Klick auf Level 1
    if (levelCards[1]) {
        levelCards[1].addEventListener('click', () => {
            if (levelCards[1].classList.contains('locked')) return;
            window.location.href = 'game.html?level=1';
        });
    }
    // Klick auf Level 2
    if (levelCards[2]) {
        levelCards[2].addEventListener('click', () => {
            if (levelCards[2].classList.contains('locked')) return;
            window.location.href = 'game.html?level=2';
        });
    }
    // Klick auf Level 3
    if (levelCards[3]) {
        levelCards[3].addEventListener('click', () => {
            if (levelCards[3].classList.contains('locked')) return;
            window.location.href = 'game.html?level=3';
        });
    }
    // Klick auf Level 4
    if (levelCards[4]) {
        levelCards[4].addEventListener('click', () => {
            if (levelCards[4].classList.contains('locked')) return;
            window.location.href = 'game.html?level=4';
        });
    }
    // Klick auf Level 5
    if (levelCards[5]) {
        levelCards[5].addEventListener('click', () => {
            if (levelCards[5].classList.contains('locked')) return;
            window.location.href = 'game.html?level=5';
        });
    }
});
