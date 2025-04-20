/**
 * Gemeinsames Musik-Modul für das Slide Puzzle Spiel.
 *
 * Diese Funktion initialisiert den Musik-Schalter und sorgt dafür,
 * dass die Musik-Logik überall auf allen Seiten identisch, synchron und robust funktioniert.
 * Einfach in jeder Seite aufrufen: initMusicToggle();
 *
 * Vorteile:
 * - Kein doppelter Code mehr in game.js, levels.js, tutorial.js etc.
 * - Musik-Einstellungen bleiben überall konsistent.
 * - Einfach erweiterbar (z.B. für Lautstärkeregelung, weitere Sounds).
 */
export function initMusicToggle() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    if (!bgMusic) {
        console.warn('[initMusicToggle] Kein bgMusic-Element gefunden!');
    }
    if (!musicToggle) {
        console.warn('[initMusicToggle] Kein musicToggle-Button gefunden!');
    }
    if (bgMusic && musicToggle) {
        // Debug: Elemente gefunden
        console.log('[initMusicToggle] bgMusic und musicToggle gefunden');
        window._slidePuzzleBgMusicStarted = window._slidePuzzleBgMusicStarted || false;
        let bgMusicStarted = window._slidePuzzleBgMusicStarted;
        let musicEnabled = localStorage.getItem('slidePuzzleMusic') !== 'off';
        function updateMusicToggle() {
            musicToggle.textContent = musicEnabled ? '🔊' : '🔇';
            musicToggle.setAttribute('aria-pressed', musicEnabled ? 'true' : 'false');
        }
        function startBgMusic() {
            if (!bgMusicStarted && musicEnabled) {
                bgMusic.volume = 0.22;
                bgMusic.play().catch(()=>{});
                bgMusicStarted = true;
                window._slidePuzzleBgMusicStarted = true;
            }
        }
        if (!musicToggle._listenerAttached) {
            console.log('[initMusicToggle] Musikschalter-Listener wird gesetzt.');
            console.log('[initMusicToggle] Musikschalter-Listener wird gesetzt.');
            musicToggle.addEventListener('click', function() {
                musicEnabled = !musicEnabled;
                localStorage.setItem('slidePuzzleMusic', musicEnabled ? 'on' : 'off');
                updateMusicToggle();
                musicToggle.classList.add('music-animate');
                setTimeout(()=>musicToggle.classList.remove('music-animate'), 400);
                if (musicEnabled) {
                    bgMusic.volume = 0.22;
                    bgMusic.play().catch(()=>{});
                } else {
                    bgMusic.pause();
                }
            });
            musicToggle._listenerAttached = true;
        }
        updateMusicToggle();
        function interactionHandler() {
            startBgMusic();
            window.removeEventListener('pointerdown', interactionHandler);
            window.removeEventListener('keydown', interactionHandler);
        }
        window.addEventListener('pointerdown', interactionHandler);
        window.addEventListener('keydown', interactionHandler);
        // Debug-Log: Status nach Initialisierung
        console.log('[initMusicToggle] Musikschalter initialisiert. Aktueller Status:', musicEnabled ? 'AN' : 'AUS');
        if (musicEnabled) {
            bgMusic.volume = 0.22;
            bgMusic.play().catch(()=>{});
        } else {
            bgMusic.pause();
        }
    }
}
