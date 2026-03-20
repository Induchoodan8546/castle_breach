/* ═══════════════════════════════════════════════
   CASTLE BREACH — game.js
   Core engine: state, scene switching, timer
════════════════════════════════════════════════ */

// ── Global Game State ──────────────────────────
const GameState = {
    playerName: '',
    teamId: null,
    flagsCaptured: 0,
    totalFlags: 4,
    currentCP: 1,
    timerSeconds: 30 * 60,
    timerInterval: null,
    startTime: null,
    checkpointTimes: {},
    isRunning: false,
};

// ── Scene Switcher ─────────────────────────────
function switchScene(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('screen-' + name);
    if (target) target.classList.add('active');
}

// ── Timer ──────────────────────────────────────
function startTimer() {
    GameState.startTime = Date.now();
    GameState.isRunning = true;
    GameState.timerSeconds = 30 * 60;

    GameState.timerInterval = setInterval(() => {
        GameState.timerSeconds--;
        updateTimerDisplay();
        if (GameState.timerSeconds <= 0) {
            clearInterval(GameState.timerInterval);
            gameOver();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(GameState.timerInterval);
    GameState.isRunning = false;
}

function updateTimerDisplay() {
    const m = Math.floor(GameState.timerSeconds / 60);
    const s = GameState.timerSeconds % 60;
    const display = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    const el = document.getElementById('timerDisplay');
    if (!el) return;
    el.textContent = display;
    if (GameState.timerSeconds <= 300) el.classList.add('warning');
}

function getElapsed() {
    if (!GameState.startTime) return 0;
    return Math.floor((Date.now() - GameState.startTime) / 1000);
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ── Flag capture ───────────────────────────────
function captureFlag(checkpointNum) {
    GameState.flagsCaptured++;
    GameState.checkpointTimes[checkpointNum] = getElapsed();
    document.getElementById('hudFlags').textContent =
        `${GameState.flagsCaptured}/${GameState.totalFlags}`;
    API.updateScore(GameState.teamId, checkpointNum, getElapsed());
}

// ── Game Over ──────────────────────────────────
function gameOver() {
    stopTimer();
    document.getElementById('goPlayer').textContent = GameState.playerName;
    document.getElementById('goFlags').textContent = `${GameState.flagsCaptured} / ${GameState.totalFlags}`;
    document.getElementById('goTime').textContent = formatTime(30 * 60 - GameState.timerSeconds);
    switchScene('gameover');
}

// ── Game Win ───────────────────────────────────
function gameWin() {
    stopTimer();
    document.getElementById('goPlayer').textContent = GameState.playerName;
    document.getElementById('goFlags').textContent = '4 / 4';
    document.getElementById('goTime').textContent = formatTime(getElapsed());
    switchScene('gameover');
}

// ── Begin game after registration ─────────────
function beginGame(playerName, teamId) {
    GameState.playerName = playerName;
    GameState.teamId = teamId;
    GameState.flagsCaptured = 0;
    GameState.currentCP = 1;

    document.getElementById('hudPlayer').textContent = playerName;
    document.getElementById('hudFlags').textContent = '0/4';
    document.getElementById('hudCheckpoint').textContent = '1/4';

    switchScene('game');
    startTimer();
    // Load Checkpoint 1
    if (typeof CP1 !== 'undefined') CP1.load();
}

// ═══════════════════════════════════════════════
//  CASTLE PIXEL ART
// ═══════════════════════════════════════════════
function buildCastle() {
    // Colour palette
    const P = {
        '0': 'transparent',
        '1': '#120600',   // sky dark
        '2': '#1e0c00',   // darkest stone
        '3': '#2e1500',   // dark stone
        '4': '#3d1e00',   // mid stone
        '5': '#4e2800',   // lighter stone
        '6': '#6a3800',   // highlight stone
        '7': '#ff7700',   // torch flame
        '8': '#ff4400',   // torch glow
        '9': '#0a0400',   // window dark
        'a': '#160900',   // deep shadow
        'b': '#080300',   // gate void
        'c': '#251100',   // mortar
        'd': '#5a3200',   // battlement cap
    };

    // Castle map — 32 cols × 24 rows
    // Central tower (tall), flanked by two side towers, outer wall, gate arch
    const map = [
        '00020002000000020002000000020002',  // merlon top gaps
        '00020002000000020002000000020002',
        '00323323000000323323000000323323',  // merlon bodies
        '00323323000000323323000000323323',
        '33333333333333333333333333333333',  // merlon base / walkway
        '44444444444444444444444444444444',  // wall
        '44870444444444444444444440784444',  // torches on side towers
        '44480444444444444444444404840444',  // torch glow
        '44444494444444444444444449444444',  // arrow-slit windows
        '44444444444444444444444444444444',  // wall
        '22022022020222022022022020222022',  // outer battlements
        '33033033030333033033033030333033',  // outer merlon bodies
        '33333333333333333333333333333333',  // outer walkway
        '44494444444444949444444444494444',  // outer windows
        '44444444444444444444444444444444',  // outer wall
        '55555555555555555555555555555555',  // lower wall
        '55555555555445554445554455545555',  // gate arch top
        '5555555555b44bb44bb44bb555555555',  // gate arch
        '555555555bb4abbb4abbb4ab55555555',  // portcullis bars
        '55555555bba44bba44bba44b55555555',  // gate open
        '5555555bbbbbbbbbbbbbbbbb55555555',  // gate base
        '66666666666666666666666666666666',  // ground wall
        '33333333333333333333333333333333',  // foundation
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',  // shadow
    ];

    const art = document.getElementById('castleArt');
    if (!art) return;
    art.innerHTML = '';

    map.forEach(rowStr => {
        const row = document.createElement('div');
        row.className = 'castle-row';
        for (let i = 0; i < 32; i++) {
            const ch = rowStr[i] || '0';
            const px = document.createElement('span');
            px.className = 'px';
            px.style.background = P[ch] || 'transparent';
            row.appendChild(px);
        }
        art.appendChild(row);
    });
}

// ═══════════════════════════════════════════════
//  START SCREEN HELPERS
// ═══════════════════════════════════════════════
function buildDivider() {
    const el = document.getElementById('pixelDivider');
    if (!el) return;
    for (let i = 0; i < 8; i++) {
        const d = document.createElement('div');
        d.className = 'pdot';
        el.appendChild(d);
    }
}

function buildStars() {
    const container = document.getElementById('stars');
    if (!container) return;
    const colors = ['#ff4400', '#ff6600', '#ffaa00', '#ff2200', '#cc3300', '#ff8800'];
    for (let i = 0; i < 65; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        const size = Math.random() < 0.3 ? 2 : 1;
        s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random() * colors.length)]}`;
        s.style.setProperty('--d', (1.5 + Math.random() * 4) + 's');
        s.style.setProperty('--delay', (-Math.random() * 4) + 's');
        container.appendChild(s);
    }
}

function animateHiScore() {
    const el = document.getElementById('hiScore');
    if (!el) return;
    let val = 0;
    const target = 24680;
    const t = setInterval(() => {
        val = Math.min(val + Math.floor(Math.random() * 800 + 200), target);
        el.textContent = String(val).padStart(5, '0');
        if (val >= target) clearInterval(t);
    }, 60);
}

function animatePlayerCount() {
    const el = document.getElementById('playerCount');
    if (!el) return;
    let count = 0;
    const t = setInterval(() => {
        count = Math.min(count + 1, 12);
        el.textContent = String(count).padStart(2, '0');
        if (count >= 12) clearInterval(t);
    }, 200);
}

// ── Handle START button ────────────────────────
function handleStart() {
    const nameInput = document.getElementById('nameInput');
    const errorMsg = document.getElementById('errorMsg');
    const startBtn = document.getElementById('startBtn');
    const loadBar = document.getElementById('loadBar');
    const loadInner = document.getElementById('loadBarInner');

    const name = nameInput.value.trim();
    if (!name) {
        errorMsg.classList.add('show');
        nameInput.focus();
        return;
    }

    errorMsg.classList.remove('show');
    startBtn.disabled = true;
    startBtn.textContent = 'REGISTERING...';
    loadBar.classList.add('show');
    setTimeout(() => { loadInner.style.width = '100%'; }, 50);

    // Call friend's API — falls back gracefully if server not ready
    API.registerTeam(name)
        .then(data => {
            GameState.playerName = name;
            GameState.teamId = data.teamId || null;
            localStorage.setItem('playerName', name);
            showSuccess(name);
        })
        .catch(() => {
            // Offline / test mode — works without backend
            GameState.playerName = name;
            localStorage.setItem('playerName', name);
            showSuccess(name);
        });
}

function showSuccess(name) {
    document.getElementById('successName').textContent = name;
    document.getElementById('successScreen').classList.add('show');
    // In production: wait for admin WebSocket signal to call beginGame()
    // For testing: auto-start after 2 seconds
    setTimeout(() => beginGame(name, GameState.teamId), 2000);
}

// ── Play Again ─────────────────────────────────
function setupRetry() {
    const btn = document.getElementById('retryBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        // Reset all state
        GameState.flagsCaptured = 0;
        GameState.currentCP = 1;
        GameState.timerSeconds = 30 * 60;
        GameState.checkpointTimes = {};

        // Reset start screen UI
        const nameInput = document.getElementById('nameInput');
        const startBtn = document.getElementById('startBtn');
        const loadBar = document.getElementById('loadBar');
        const loadInner = document.getElementById('loadBarInner');
        const successScr = document.getElementById('successScreen');
        const timerEl = document.getElementById('timerDisplay');

        if (nameInput) nameInput.value = '';
        if (startBtn) { startBtn.disabled = false; startBtn.textContent = '► START GAME'; }
        if (loadBar) loadBar.classList.remove('show');
        if (loadInner) loadInner.style.width = '0%';
        if (successScr) successScr.classList.remove('show');
        if (timerEl) { timerEl.textContent = '30:00'; timerEl.classList.remove('warning'); }

        switchScene('start');
    });
}
// ── Checkpoint Loader System ──────────────────
const Checkpoints = {
    1: () => CP1.load(),
    2: () => CP2.load(),
    3: () => CP3.load(),
    4: () => typeof CP4 !== 'undefined' ? CP4.load() : console.warn('CP4 not loaded'),
};

function loadCheckpoint(num) {
    GameState.currentCP = num;

    const cpEl = document.getElementById('hudCheckpoint');
    if (cpEl) cpEl.textContent = `${num}/4`;

    if (Checkpoints[num]) {
        Checkpoints[num]();
    } else {
        console.warn("Checkpoint not found:", num);
    }
}

// ═══════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    buildCastle();
    buildDivider();
    buildStars();
    animateHiScore();
    animatePlayerCount();
    setupRetry();

    const nameInput = document.getElementById('nameInput');
    if (nameInput) {
        nameInput.addEventListener('input', () => {
            const pos = nameInput.selectionStart;
            nameInput.value = nameInput.value.toUpperCase();
            nameInput.setSelectionRange(pos, pos);
            document.getElementById('errorMsg').classList.remove('show');
        });
        nameInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') handleStart();
        });
    }

    const startBtn = document.getElementById('startBtn');
    if (startBtn) startBtn.addEventListener('click', handleStart);
});