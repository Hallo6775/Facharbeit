// game.js: Spiellogik und UI für das Slide Puzzle Spiel

// Liest das aktuelle Level aus der URL (z.B. ?level=2)
function getLevelFromURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('level') || '1', 10);
}

// Gibt die Konfiguration (Größe, Farben, Shuffle, Timer) für das gewählte Level zurück
function getPuzzleConfig(level) {
    // Level 1: 3x3, Level 2: 4x4, Level 3: 5x5, Level 4: 6x6, Level 5: 7x7
    switch(level) {
        case 1:
            return {
                size: 3,
                shuffle: 10,
                tileColor: '#fff',
                borderColor: '#6366f1',
                accent: '#5eead4',
                info: 'Tipp: Klicke auf die Kacheln neben dem leeren Feld, um sie zu verschieben!',
                timer: false
            };
        case 2:
            return {
                size: 4,
                shuffle: 35,
                tileColor: '#f1f5ff',
                borderColor: '#6366f1',
                accent: '#6366f1',
                info: '',
                timer: true
            };
        case 3:
            return {
                size: 5,
                shuffle: 60,
                tileColor: '#f9f871',
                borderColor: '#fbbf24',
                accent: '#fbbf24',
                info: '',
                timer: true
            };
        case 4:
            return {
                size: 6,
                shuffle: 90,
                tileColor: '#fca5a5',
                borderColor: '#ef4444',
                accent: '#ef4444',
                info: '',
                timer: true
            };
        case 5:
            return {
                size: 7,
                shuffle: 150,
                tileColor: '#a5f3fc',
                borderColor: '#0ea5e9',
                accent: '#0ea5e9',
                info: '',
                timer: true
            };
        default:
            return {
                size: 3,
                shuffle: 10,
                tileColor: '#fff',
                borderColor: '#6366f1',
                accent: '#5eead4',
                info: '',
                timer: false
            };
    }
}


// Globale Variablen für Spielfeld, Status und Einstellungen
let puzzleState = [];
let emptyIndex = 0; // Index des leeren Felds
let size = 3;      // Größe des Puzzles (z.B. 3x3)
let moves = 0;     // Anzahl der Züge
let timerInterval = null; // Timer-Intervall für Zeitmessung
let seconds = 0;   // Sekunden seit Start
let solved = false; // Status: gelöst?
let config = {};   // Level-Konfiguration

// Initialisiert das Spiel für das aktuelle Level
function initGame() {
    const level = getLevelFromURL();
    config = getPuzzleConfig(level);
    size = config.size;
    document.getElementById('levelTitle').textContent = `Level ${level}`;
    createPuzzle(size);
    shufflePuzzle(config.shuffle);
    renderPuzzle();
    moves = 0;
    seconds = 0;
    solved = false;
    updateInfo();
    // Info-Texte
    document.getElementById('gameInfo').textContent = config.info;
    // Timer für Level 2
    if(config.timer) {
        timerInterval = setInterval(() => {
            if (!solved) {
                seconds++;
                updateInfo();
            }
        }, 1000);
    }
    // Neu mischen Button nur für Level > 0 anzeigen
    const reshuffleBtn = document.getElementById('reshuffleBtn');
    if(level > 0) {
        reshuffleBtn.style.display = '';
    } else {
        reshuffleBtn.style.display = 'none';
    }
}


// Erstellt das Puzzle-Array für die gegebene Größe
function createPuzzle(s) {
    puzzleState = [];
    for(let i=1; i<=s*s-1; i++) puzzleState.push(i);
    puzzleState.push(0); // 0 = leer
    emptyIndex = puzzleState.length-1;
}

// Mischt das Puzzle durch zufällige Züge
function shufflePuzzle(times) {
    for(let i=0; i<times; i++) {
        const movable = getMovableTiles();
        const moveIdx = movable[Math.floor(Math.random()*movable.length)];
        swapTiles(moveIdx, emptyIndex);
        emptyIndex = moveIdx;
    }
}

// Gibt alle verschiebbaren Kacheln (neben dem leeren Feld) zurück
function getMovableTiles() {
    const idx = emptyIndex;
    const moves = [];
    if(idx%size !== 0) moves.push(idx-1);
    if((idx+1)%size !== 0) moves.push(idx+1);
    if(idx-size >= 0) moves.push(idx-size);
    if(idx+size < size*size) moves.push(idx+size);
    return moves;
}

// Rendert das Puzzle im DOM (anzeige der Kacheln)
function renderPuzzle() {
    const puzzle = document.getElementById('gamePuzzle');
    puzzle.innerHTML = '';
    puzzle.style.display = 'grid';
    puzzle.style.gridTemplateColumns = `repeat(${size}, 54px)`;
    puzzle.style.gridTemplateRows = `repeat(${size}, 54px)`;
    puzzle.style.gap = '10px';
    for(let i=0; i<puzzleState.length; i++) {
        const tile = document.createElement('div');
        tile.className = 'game-tile';
        tile.textContent = puzzleState[i] === 0 ? '' : puzzleState[i];
        if(puzzleState[i] === 0) tile.classList.add('empty');
        tile.dataset.pos = i;
        tile.onclick = () => tryMove(i);
        // Farbanpassung je Level
        tile.style.background = config.tileColor;
        tile.style.borderColor = config.borderColor;
        tile.style.color = config.accent;
        puzzle.appendChild(tile);
    }
}

// Versucht, die Kachel an Index idx zu verschieben
function tryMove(idx) {
    if(getMovableTiles().includes(idx) && puzzleState[idx] !== 0) {
        swapTiles(idx, emptyIndex);
        emptyIndex = idx;
        moves++;
        renderPuzzle();
        updateInfo();
        if(isSolved()) showSolved();
    }
    // Kein Sound mehr für move/error
}

// Tauscht zwei Kacheln im Puzzle-Array
function swapTiles(a, b) {
    [puzzleState[a], puzzleState[b]] = [puzzleState[b], puzzleState[a]];
}

// Prüft, ob das Puzzle gelöst ist
function isSolved() {
    for(let i=0; i<puzzleState.length-1; i++) {
        if(puzzleState[i] !== i+1) return false;
    }
    return puzzleState[puzzleState.length-1] === 0;
}

// Aktualisiert die Anzeige für Züge, Zeit und Tipps
function updateInfo() {
    if(config.timer) {
        document.getElementById('gameInfo').textContent = `Züge: ${moves} | Zeit: ${seconds}s`;
    } else {
        document.getElementById('gameInfo').textContent = config.info + (moves > 0 ? `\nZüge: ${moves}` : '');
    }
}

// Wird aufgerufen, wenn das Puzzle gelöst wurde (Highscore, Info, Weiterleitung)
function showSolved() {
    // Nächstes Level bestimmen
    const currLevel = getLevelFromURL();
    const nextLevel = currLevel < 5 ? currLevel + 1 : null;
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    if (nextLevelBtn) {
        if (nextLevel) {
            nextLevelBtn.style.display = '';
            nextLevelBtn.textContent = `Nächstes Level (${nextLevel})`;
            nextLevelBtn.onclick = () => {
                window.location.href = `game.html?level=${nextLevel}`;
            };

            // Automatische Weiterleitung nach 4 Sekunden
            setTimeout(() => {
                if (nextLevelBtn.style.display !== 'none') {
                    window.location.href = `game.html?level=${nextLevel}`;
                }
            }, 4000);

        } else {
            nextLevelBtn.style.display = 'none'; // Kein nächstes Level
        }
    }
    solved = true;
    if(timerInterval) clearInterval(timerInterval);
    // Highscore-Logik
    let highscoreKey = 'slidePuzzleHighscore_' + currLevel;
    let prev = null;
    try { prev = JSON.parse(localStorage.getItem(highscoreKey)); } catch(e) { prev = null; }
    let newScore = config.timer ? {moves: moves, time: seconds} : {moves: moves};
    let isBest = false;
    if(!prev || (config.timer && (seconds < prev.time || (seconds === prev.time && moves < prev.moves))) || (!config.timer && moves < prev.moves)) {
        localStorage.setItem(highscoreKey, JSON.stringify(newScore));
        isBest = true;
    }
    // Fortschritt: Nächstes Level freischalten
    let unlocked = 0;
    try { unlocked = parseInt(localStorage.getItem('slidePuzzleLevel') || '0', 10); } catch(e) { unlocked = 0; }
    if (currLevel >= 1 && currLevel < 5 && unlocked < currLevel + 1) {
        localStorage.setItem('slidePuzzleLevel', String(currLevel + 1));
    }
    // Animation & Info
    if(config.timer) {
        document.querySelectorAll('.game-tile').forEach(tile => {
            tile.style.background = '#5eead4';
            tile.style.borderColor = '#6366f1';
            tile.style.color = '#fff';
        });
        document.getElementById('gameInfo').textContent = `Geschafft! Level ${currLevel} in ${moves} Zügen und ${seconds}s gelöst.` + (isBest ? '\nNeuer Highscore!' : prev ? `\nHighscore: ${prev.moves} Züge, ${prev.time}s` : '');
        // Entferne automatische Weiterleitung zur Level-Auswahl (jetzt über Button)
        // setTimeout(() => {
        //     window.location.href = 'levels.html';
        // }, 2400);
    } else {
        document.getElementById('gameInfo').textContent = `Geschafft! Du hast das Puzzle in ${moves} Zügen gelöst.` + (isBest ? '\nNeuer Highscore!' : prev ? `\nHighscore: ${prev.moves} Züge` : '');
        // Entferne automatische Weiterleitung zur Level-Auswahl (jetzt über Button)
        // setTimeout(() => {
        //     window.location.href = 'levels.html';
        // }, 2200);
    }
}



// Initialisiert das Spiel und UI-Events, wenn die Seite geladen wird
// Musik-Logik jetzt zentral in music.js gekapselt
import { initMusicToggle } from './music.js';
document.addEventListener('DOMContentLoaded', () => {
    initMusicToggle();

    initGame();
    const reshuffleBtn = document.getElementById('reshuffleBtn');
    reshuffleBtn.addEventListener('click', function() {
        if(timerInterval) clearInterval(timerInterval);
        shufflePuzzle(config.shuffle);
        renderPuzzle();
        moves = 0;
        seconds = 0;
        solved = false;
        updateInfo();
        // Animation
        reshuffleBtn.style.transition = 'transform 0.35s cubic-bezier(.68,-0.55,.27,1.55)';
        reshuffleBtn.style.transform = 'rotate(-360deg) scale(1.14)';
        setTimeout(()=>{
            reshuffleBtn.style.transform = '';
        }, 370);
        // Timer ggf. neu starten
        if(config.timer) {
            timerInterval = setInterval(() => {
                if (!solved) {
                    seconds++;
                    updateInfo();
                }
            }, 1000);
        }
    });

    // Button: Zurück zur Level-Auswahl
    document.getElementById('backBtn').onclick = () => {
        window.location.href = 'levels.html';
    };
    // Highscore beim Start anzeigen
    const level = getLevelFromURL();
    let highscoreKey = 'slidePuzzleHighscore_' + level;
    let prev = null;
    try { prev = JSON.parse(localStorage.getItem(highscoreKey)); } catch(e) { prev = null; }
    if(prev) {
        if(config.timer) {
            document.getElementById('gameInfo').textContent += `\nHighscore: ${prev.moves} Züge, ${prev.time}s`;
        } else {
            document.getElementById('gameInfo').textContent += `\nHighscore: ${prev.moves} Züge`;
        }
    }
});

// Zusätzliche Styles für Tiles direkt hier, damit sie sofort wirken
const style = document.createElement('style');
style.textContent = `
.game-puzzle { min-height: 160px; }
.game-tile {
  width: 54px; height: 54px;
  border-radius: 0.7rem;
  border: 2.5px solid #6366f1;
  box-shadow: 0 2px 8px #6366f122;
  font-size: 1.3rem;
  font-family: 'Poppins', Arial, sans-serif;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.18s, border-color 0.18s, color 0.18s;
  cursor: pointer;
  user-select: none;
}
.game-tile.empty {
  background: #e7eaf1 !important;
  border: 2.5px dashed #b3c6e0 !important;
  color: #b3c6e0 !important;
  cursor: default;
}
`;
document.head.appendChild(style);
