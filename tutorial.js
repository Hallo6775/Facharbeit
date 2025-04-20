// tutorial.js: Steuert das interaktive Tutorial (Level 0), erklärt Spielmechaniken und UI
// Schritt-für-Schritt-Anleitung mit interaktivem Mini-Puzzle


// Schritt-für-Schritt-Anleitung für das Tutorial, jeder Schritt enthält Text, Aktion und ggf. Hervorhebung
/**
 * Array mit allen Schritten des Tutorials.
 * Jeder Schritt enthält:
 * - text: Anleitungstext für den Schritt
 * - action: Funktion, die beim Schritt aufgerufen wird
 * - highlight: Array mit Indexen der hervorzuhebenden Kacheln
 */
const steps = [
    {
        text: "Willkommen zum Slide Puzzle! Ziel ist es, die Kacheln in die richtige Reihenfolge zu bringen. Klicke auf 'Nächster Schritt', um das Tutorial zu starten.",
        action: () => renderPuzzle([1,2,3,0]), // Start: fast gelöst
        highlight: null
    },
    {
        text: "Du kannst immer nur die Kachel bewegen, die neben dem leeren Feld (weiß) liegt. Das leere Feld ist unten rechts.",
        action: () => highlightMovable([2]),
        highlight: [2]
    },
    {
        text: "Klicke auf die hervorgehobene Kachel, um sie zu verschieben!",
        action: () => enableMove([2]),
        highlight: [2]
    },
    {
        text: "Super! Jetzt noch einen Zug, um das Puzzle zu lösen.",
        action: () => enableMove([3]),
        highlight: [3]
    },
    {
        text: "Herzlichen Glückwunsch! Du hast das Tutorial geschafft. Jetzt kannst du mit Level 1 weitermachen!",
        action: () => showFinish(),
        highlight: null
    }
];

// Aktueller Schritt im Tutorial
/**
 * Aktueller Schritt im Tutorial (Index im steps-Array).
 */
let currentStep = 0;
/**
 * Aktueller Zustand des Puzzles (Array mit Kacheln).
 * 0 = leere Kachel
 */
let puzzleState = [1,2,3,0]; // 0 = leer

function renderPuzzle(state) {
    const puzzle = document.getElementById('tutorialPuzzle');
    puzzle.innerHTML = '';
    for(let i=0;i<4;i++) {
        const tile = document.createElement('div');
        tile.className = 'tutorial-tile';
        tile.textContent = state[i] === 0 ? '' : state[i];
        if(state[i] === 0) tile.classList.add('empty');
        tile.dataset.pos = i;
        puzzle.appendChild(tile);
    }
    stylePuzzleGrid();
}

/**
 * Stylt das Puzzle-Grid.
 */
function stylePuzzleGrid() {
    const puzzle = document.getElementById('tutorialPuzzle');
    puzzle.style.display = 'grid';
    puzzle.style.gridTemplateColumns = '50px 50px';
    puzzle.style.gridTemplateRows = '50px 50px';
    puzzle.style.gap = '10px';
}

/**
 * Hebt die Kacheln an den angegebenen Indexen hervor.
 * @param {Array} indices - Array mit Indexen der hervorzuhebenden Kacheln
 */
function highlightMovable(indices) {
    document.querySelectorAll('.tutorial-tile').forEach(tile => {
        tile.classList.remove('highlight');
        if (indices && indices.includes(Number(tile.dataset.pos))) {
            tile.classList.add('highlight');
        }
    });
}

/**
 * Aktiviert die Kacheln an den angegebenen Indexen für Bewegungen.
 * @param {Array} indices - Array mit Indexen der zu aktivierenden Kacheln
 */
function enableMove(indices) {
    highlightMovable(indices);
    document.querySelectorAll('.tutorial-tile').forEach(tile => {
        tile.onclick = null;
        if(indices && indices.includes(Number(tile.dataset.pos))) {
            tile.onclick = () => {
                moveTile(Number(tile.dataset.pos));
            };
        }
    });
}

/**
 * Bewegt die Kachel an der angegebenen Position.
 * @param {Number} idx - Index der zu bewegenden Kachel
 */
function moveTile(idx) {
    // Finde das leere Feld
    const empty = puzzleState.indexOf(0);
    if([idx-1,idx+1,idx-2,idx+2].includes(empty)) {
        [puzzleState[idx], puzzleState[empty]] = [puzzleState[empty], puzzleState[idx]];
        renderPuzzle(puzzleState);
        document.querySelectorAll('.tutorial-tile').forEach(tile => tile.onclick = null);
        nextStep();
    }
}

/**
 * Zeigt die Abschluss-Seite des Tutorials an.
 */
function showFinish() {
    // Fortschritt speichern: Level 1 freischalten
    localStorage.setItem('slidePuzzleLevel', '1');
    document.getElementById('nextStepBtn').style.display = 'none';
    setTimeout(() => {
        document.getElementById('tutorialSteps').textContent = "Du hast das Tutorial abgeschlossen! Klicke unten, um Level 1 zu starten.";
        const nextBtn = document.createElement('button');
        nextBtn.className = 'play-btn';
        nextBtn.textContent = 'Level 1 starten';
        nextBtn.onclick = () => window.location.href = 'levels.html';
        document.querySelector('.tutorial-container').appendChild(nextBtn);
    }, 600);
}

/**
 * Zeigt den aktuellen Tutorial-Schritt an (Text und Puzzle).
 * @param {Number} step - Index des Schritts im steps-Array
 */
function showStep(step) {
    document.getElementById('tutorialSteps').textContent = steps[step].text;
    steps[step].action();
    if(steps[step].highlight) highlightMovable(steps[step].highlight);
}

/**
 * Geht zum nächsten Schritt im Tutorial über.
 */
function nextStep() {
    currentStep++;
    if(currentStep < steps.length) {
        showStep(currentStep);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderPuzzle(puzzleState);
    showStep(currentStep);
    // Button für den nächsten Schritt im Tutorial
    // Bei letztem Schritt wird zur Level-Auswahl zurückgeleitet
    document.getElementById('nextStepBtn').addEventListener('click', () => {
        nextStep();
    });
});

// Zusätzliche Styles für Tiles direkt hier, damit sie sofort wirken
const style = document.createElement('style');
style.textContent = `
.tutorial-puzzle { min-height: 120px; }
.tutorial-tile {
  width: 50px; height: 50px;
  background: #fff;
  border-radius: 0.7rem;
  border: 2.5px solid #6366f1;
  box-shadow: 0 2px 8px #6366f122;
  font-size: 1.3rem;
  font-family: 'Poppins', Arial, sans-serif;
  font-weight: 700;
  color: #222;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.18s, border-color 0.18s;
  cursor: pointer;
  user-select: none;
}
.tutorial-tile.empty {
  background: #e7eaf1;
  border: 2.5px dashed #b3c6e0;
  cursor: default;
}
.tutorial-tile.highlight {
  border-color: #5eead4;
  background: #e0fdfa;
}
`;
document.head.appendChild(style);
