/* ═══════════════════════════════════════════════
   CASTLE BREACH — checkpoints/cp1.js
   Checkpoint 1: Castle Gate
   Puzzle: Base64 decode → flag{gate_open}
════════════════════════════════════════════════ */

const CP1 = (() => {

    // ── Puzzle data ────────────────────────────
    const ENCODED_MESSAGE = 'ZmxhZ3tnYXRlX29wZW59';
    const CORRECT_FLAG = 'flag{gate_open}';

    // ── Track which objects have been examined ─
    const examined = {
        torch1: false,
        torch2: false,
        statue: false,
        shield: false,
        chains: false,
        sign: false,
    };

    let flagSubmitted = false;

    // ── Object content (what shows in popup) ───
    const objectData = {
        torch1: {
            title: 'WALL TORCH',
            icon: '🔥',
            text: 'A flickering torch mounted on the ancient stone wall. The flame casts dancing shadows across the gate. Nothing unusual here... but something feels warm nearby.',
            clue: false,
        },
        torch2: {
            title: 'WALL TORCH',
            icon: '🔥',
            text: 'Another torch, identical to the first. The smoke trails upward in a strange spiral pattern. A red herring? Perhaps.',
            clue: false,
        },
        statue: {
            title: 'STONE STATUE',
            icon: '🗿',
            text: 'A crumbling stone statue of an ancient knight. Its eyes seem to follow you. Inscribed on the base: "ONLY THE WISE MAY DECODE WHAT IS HIDDEN." Whatever that means...',
            clue: false,
        },
        shield: {
            title: 'IRON SHIELD',
            icon: '🛡️',
            text: 'A battered iron shield hanging on the wall. The crest has been scratched off. On the back, someone has scrawled: "The answer is not what you see, but what you read."',
            clue: false,
        },
        chains: {
            title: 'GATE CHAINS',
            icon: '⛓️',
            text: 'Massive iron chains securing the castle gate. Each link is engraved with a symbol. The chains rattle as you touch them. The gate will not open by force alone — a code is needed.',
            clue: false,
        },
        sign: {
            title: '⚠️ ENCODED SIGN',
            icon: '📜',
            text: 'A weathered wooden sign hangs from the gate. Strange characters are burned into the wood:',
            code: ENCODED_MESSAGE,
            hint: 'This looks like it could be decoded... What encoding scheme uses only letters, numbers, + and / characters?',
            clue: true,
        },
    };

    // ═══════════════════════════════════════════
    //  BUILD THE SCENE HTML
    // ═══════════════════════════════════════════
    function buildScene() {
        const scene = document.getElementById('gameScene');
        if (!scene) return;

        scene.innerHTML = `
      <div class="cp1-scene" id="cp1Scene">

        <!-- Sky -->
        <div class="cp1-sky"></div>

        <!-- Moon -->
        <div class="cp1-moon"></div>

        <!-- Stars in sky -->
        <div class="cp1-stars" id="cp1Stars"></div>

        <!-- Stone wall background -->
        <div class="cp1-wall"></div>

        <!-- Wall cracks / texture -->
        <div class="cp1-wall-detail"></div>

        <!-- TORCH LEFT -->
        <div class="cp1-object cp1-torch" id="obj-torch1" data-obj="torch1" title="Examine">
          <div class="torch-mount"></div>
          <div class="torch-body"></div>
          <div class="torch-flame">
            <span class="flame f1"></span>
            <span class="flame f2"></span>
            <span class="flame f3"></span>
          </div>
          <div class="torch-glow"></div>
          <div class="obj-label">TORCH</div>
        </div>

        <!-- TORCH RIGHT -->
        <div class="cp1-object cp1-torch cp1-torch-right" id="obj-torch2" data-obj="torch2" title="Examine">
          <div class="torch-mount"></div>
          <div class="torch-body"></div>
          <div class="torch-flame">
            <span class="flame f1"></span>
            <span class="flame f2"></span>
            <span class="flame f3"></span>
          </div>
          <div class="torch-glow"></div>
          <div class="obj-label">TORCH</div>
        </div>

        <!-- STONE STATUE LEFT -->
        <div class="cp1-object cp1-statue" id="obj-statue" data-obj="statue" title="Examine">
          <div class="statue-head"></div>
          <div class="statue-body"></div>
          <div class="statue-base"></div>
          <div class="obj-label">STATUE</div>
        </div>

        <!-- SHIELD RIGHT -->
        <div class="cp1-object cp1-shield" id="obj-shield" data-obj="shield" title="Examine">
          <div class="shield-body">
            <div class="shield-cross-h"></div>
            <div class="shield-cross-v"></div>
          </div>
          <div class="obj-label">SHIELD</div>
        </div>

        <!-- THE GATE -->
        <div class="cp1-gate">
          <!-- Gate archway -->
          <div class="gate-arch"></div>
          <!-- Gate doors -->
          <div class="gate-door gate-door-left" id="gateDoorLeft"></div>
          <div class="gate-door gate-door-right" id="gateDoorRight"></div>
          <!-- Gate bars (portcullis) -->
          <div class="gate-portcullis" id="gatePortcullis">
            <div class="port-bar"></div><div class="port-bar"></div>
            <div class="port-bar"></div><div class="port-bar"></div>
            <div class="port-h-bar"></div><div class="port-h-bar"></div>
          </div>
          <!-- Keyhole -->
          <div class="gate-keyhole"></div>
        </div>

        <!-- CHAINS -->
        <div class="cp1-object cp1-chains" id="obj-chains" data-obj="chains" title="Examine">
          <div class="chain-link"></div><div class="chain-link"></div>
          <div class="chain-link"></div><div class="chain-link"></div>
          <div class="chain-link"></div>
          <div class="obj-label">CHAINS</div>
        </div>

        <!-- ENCODED SIGN hanging from gate -->
        <div class="cp1-object cp1-sign" id="obj-sign" data-obj="sign" title="Examine — KEY CLUE">
          <div class="sign-rope sign-rope-left"></div>
          <div class="sign-rope sign-rope-right"></div>
          <div class="sign-board">
            <div class="sign-text">NOTICE</div>
            <div class="sign-text sign-text-sm">READ ME</div>
          </div>
          <div class="obj-label sign-label">SIGN</div>
        </div>

        <!-- Ground -->
        <div class="cp1-ground">
          <div class="ground-stone"></div>
          <div class="ground-stone"></div>
          <div class="ground-stone"></div>
          <div class="ground-stone"></div>
        </div>

        <!-- STORY BANNER -->
        <div class="cp1-story-banner">
          <span class="story-text">The massive castle gate looms before you. Find the code to open it.</span>
        </div>

        <!-- OBJECT POPUP MODAL -->
        <div class="cp1-modal" id="cp1Modal">
          <div class="modal-box">
            <div class="modal-header">
              <span class="modal-icon" id="modalIcon"></span>
              <span class="modal-title" id="modalTitle"></span>
              <button class="modal-close" id="modalClose">✕</button>
            </div>
            <div class="modal-body">
              <p class="modal-text" id="modalText"></p>
              <div class="modal-code-wrap" id="modalCodeWrap">
                <div class="modal-code" id="modalCode"></div>
                <div class="modal-hint" id="modalHint"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- FLAG SUBMISSION PANEL -->
        <div class="cp1-flag-panel" id="cp1FlagPanel">
          <div class="flag-panel-inner">
            <div class="flag-panel-title">🚩 ENTER FLAG</div>
            <div class="flag-panel-sub">Decode the message and enter the flag below</div>
            <div class="flag-input-row">
              <input
                class="flag-input"
                id="flagInput"
                type="text"
                placeholder="flag{...}"
                autocomplete="off"
                spellcheck="false"
              />
              <button class="flag-submit-btn" id="flagSubmitBtn">SUBMIT</button>
            </div>
            <div class="flag-feedback" id="flagFeedback"></div>
            <div class="flag-attempts" id="flagAttempts">ATTEMPTS: 0</div>
          </div>
        </div>

        <!-- GATE OPEN OVERLAY -->
        <div class="gate-open-overlay" id="gateOpenOverlay">
          <div class="gate-open-text">⚔ GATE UNLOCKED ⚔</div>
          <div class="gate-open-sub">FLAG CAPTURED — PROCEEDING TO CHECKPOINT 2</div>
        </div>

      </div>
    `;

        // Build sky stars
        buildSkyStars();

        // Wire up all object clicks
        document.querySelectorAll('.cp1-object').forEach(el => {
            el.addEventListener('click', () => {
                const key = el.dataset.obj;
                if (key) openModal(key);
            });
        });

        // Modal close
        document.getElementById('modalClose').addEventListener('click', closeModal);
        document.getElementById('cp1Modal').addEventListener('click', e => {
            if (e.target.id === 'cp1Modal') closeModal();
        });

        // Flag submit
        document.getElementById('flagSubmitBtn').addEventListener('click', submitFlag);
        document.getElementById('flagInput').addEventListener('keydown', e => {
            if (e.key === 'Enter') submitFlag();
        });
    }

    // ── Build sky stars ───────────────────────
    function buildSkyStars() {
        const container = document.getElementById('cp1Stars');
        if (!container) return;
        for (let i = 0; i < 40; i++) {
            const s = document.createElement('div');
            s.className = 'cp1-star';
            s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 60}%;width:${Math.random() < 0.3 ? 2 : 1}px;height:${Math.random() < 0.3 ? 2 : 1}px;animation-delay:${-Math.random() * 4}s;animation-duration:${1.5 + Math.random() * 3}s`;
            container.appendChild(s);
        }
    }

    // ── Open object modal ─────────────────────
    let attempts = 0;

    function openModal(key) {
        const data = objectData[key];
        if (!data) return;

        examined[key] = true;

        document.getElementById('modalIcon').textContent = data.icon || '👁';
        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalText').textContent = data.text;

        const codeWrap = document.getElementById('modalCodeWrap');
        const codeEl = document.getElementById('modalCode');
        const hintEl = document.getElementById('modalHint');

        if (data.clue && data.code) {
            codeWrap.style.display = 'block';
            codeEl.textContent = data.code;
            hintEl.textContent = data.hint || '';
            // Show flag panel when clue is found
            document.getElementById('cp1FlagPanel').classList.add('visible');
        } else {
            codeWrap.style.display = 'none';
        }

        document.getElementById('cp1Modal').classList.add('open');
    }

    function closeModal() {
        document.getElementById('cp1Modal').classList.remove('open');
    }

    // ── Submit flag ───────────────────────────
    function submitFlag() {
        if (flagSubmitted) return;

        const input = document.getElementById('flagInput');
        const feedback = document.getElementById('flagFeedback');
        const attemptsEl = document.getElementById('flagAttempts');

        const answer = input.value.trim().toLowerCase();
        attempts++;
        attemptsEl.textContent = `ATTEMPTS: ${attempts}`;

        if (answer === CORRECT_FLAG) {
            // ── CORRECT ──
            flagSubmitted = true;
            feedback.textContent = '✅ CORRECT! FLAG CAPTURED!';
            feedback.className = 'flag-feedback success';
            input.disabled = true;
            document.getElementById('flagSubmitBtn').disabled = true;

            // Call game engine to record flag
            if (typeof captureFlag === 'function') captureFlag(1);

            // Validate with backend
            if (typeof API !== 'undefined') {
                API.validateFlag(GameState.teamId, 1, answer).catch(() => { });
            }

            // Animate gate opening after short delay
            setTimeout(() => {
                closeModal();
                openGate();
            }, 1200);

        } else {
            // ── WRONG ──
            feedback.textContent = '❌ WRONG FLAG. TRY AGAIN.';
            feedback.className = 'flag-feedback error';
            input.value = '';
            input.classList.add('shake');
            setTimeout(() => input.classList.remove('shake'), 500);
        }
    }

    // ── Gate opening animation ────────────────
    function openGate() {
        const portcullis = document.getElementById('gatePortcullis');
        const leftDoor = document.getElementById('gateDoorLeft');
        const rightDoor = document.getElementById('gateDoorRight');
        const overlay = document.getElementById('gateOpenOverlay');

        if (portcullis) portcullis.classList.add('rising');
        if (leftDoor) leftDoor.classList.add('opening-left');
        if (rightDoor) rightDoor.classList.add('opening-right');

        setTimeout(() => {
            overlay.classList.add('visible');
        }, 800);

        // Load CP2 after animation
        setTimeout(() => {
            overlay.classList.remove('visible');
            if (typeof CP2 !== 'undefined' && typeof CP2.load === 'function') {
                 loadCheckpoint(2);
            } else {
                // CP2 not built yet — show placeholder
                const scene = document.getElementById('gameScene');
                if (scene) {
                    scene.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;gap:14px;position:relative;z-index:10;">
              <div style="font-family:'Press Start 2P',monospace;font-size:18px;color:#ff4400;text-shadow:0 0 14px #cc2200;animation:flicker 3s infinite;">CHECKPOINT 2</div>
              <div style="font-family:'VT323',monospace;font-size:22px;color:#ff8800;letter-spacing:3px;animation:blink 1s step-end infinite;">HALL OF PATHS — COMING NEXT</div>
            </div>`;
                }
                // Update HUD
                if (typeof GameState !== 'undefined') {
                    GameState.currentCP = 2;
                    const cpEl = document.getElementById('hudCheckpoint');
                    if (cpEl) cpEl.textContent = '2/4';
                }
            }
        }, 3500);
    }

    // ── Public load function ──────────────────
    function load() {
        flagSubmitted = false;
        attempts = 0;
        Object.keys(examined).forEach(k => examined[k] = false);
        buildScene();
        injectStyles();
    }

    // ═══════════════════════════════════════════
    //  INJECT CP1 STYLES
    // ═══════════════════════════════════════════
    function injectStyles() {
        if (document.getElementById('cp1-styles')) return;
        const style = document.createElement('style');
        style.id = 'cp1-styles';
        style.textContent = `

    /* ── Scene container ── */
    .cp1-scene {
      position: relative;
      width: 100%; height: 100%;
      overflow: hidden;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    /* ── Sky ── */
    .cp1-sky {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, #050100 0%, #0d0300 40%, #1a0800 70%, #2a1000 100%);
      z-index: 0;
    }

    /* ── Moon ── */
    .cp1-moon {
      position: absolute;
      top: 6%; right: 12%;
      width: 52px; height: 52px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #ffd080, #cc8800);
      box-shadow: 0 0 20px rgba(255,180,0,0.4), 0 0 60px rgba(200,120,0,0.2);
      z-index: 1;
    }

    /* ── Sky stars ── */
    .cp1-stars { position: absolute; inset: 0; z-index: 1; }
    .cp1-star {
      position: absolute; border-radius: 50%;
      background: #ffcc88; opacity: 0;
      animation: cp1-twinkle 2s ease-in-out infinite;
    }
    @keyframes cp1-twinkle { 0%,100%{opacity:0} 50%{opacity:0.9} }

    /* ── Stone wall ── */
    .cp1-wall {
      position: absolute; inset: 0; top: 15%;
      z-index: 2;
      background:
        repeating-linear-gradient(
          0deg,
          transparent, transparent 28px,
          rgba(0,0,0,0.35) 28px, rgba(0,0,0,0.35) 30px
        ),
        repeating-linear-gradient(
          90deg,
          transparent, transparent 48px,
          rgba(0,0,0,0.2) 48px, rgba(0,0,0,0.2) 50px
        ),
        linear-gradient(180deg, #1e0c00 0%, #2e1500 40%, #3d1e00 100%);
    }
    .cp1-wall-detail {
      position: absolute; inset: 0; top: 15%;
      z-index: 3;
      background:
        repeating-linear-gradient(
          0deg,
          transparent, transparent 56px,
          rgba(255,60,0,0.03) 56px, rgba(255,60,0,0.03) 58px
        );
    }

    /* ── Ground ── */
    .cp1-ground {
      position: absolute; bottom: 0; left: 0; right: 0;
      height: 60px; z-index: 5;
      background: linear-gradient(180deg, #1a0900 0%, #0d0500 100%);
      display: flex; align-items: flex-start; padding-top: 4px;
      gap: 2px; overflow: hidden;
    }
    .ground-stone {
      flex: 1; height: 28px;
      background: linear-gradient(180deg, #2e1500, #1a0900);
      border-top: 2px solid #3d1e00;
    }

    /* ── Story banner ── */
    .cp1-story-banner {
      position: absolute; top: 4px; left: 0; right: 0;
      z-index: 20; text-align: center; padding: 6px 20px;
    }
    .story-text {
      font-family: 'VT323', monospace;
      font-size: 18px; color: #ff8800;
      text-shadow: 0 0 8px #ff4400;
      letter-spacing: 2px;
    }

    /* ══ OBJECTS ══════════════════════════════ */
    .cp1-object {
      position: absolute; cursor: pointer; z-index: 10;
      transition: transform 0.15s steps(2);
    }
    .cp1-object:hover { transform: scale(1.08); }

    /* Object glow pulse */
    .cp1-object::after {
      content: '';
      position: absolute; inset: -6px;
      border-radius: 4px;
      background: transparent;
      animation: obj-pulse 2s ease-in-out infinite;
      pointer-events: none;
    }
    @keyframes obj-pulse {
      0%,100% { box-shadow: 0 0 0px rgba(255,120,0,0); }
      50%      { box-shadow: 0 0 14px rgba(255,120,0,0.5); }
    }

    /* Object label */
    .obj-label {
      font-family: 'Press Start 2P', monospace;
      font-size: 5px; color: #ff8800;
      text-align: center; margin-top: 4px;
      letter-spacing: 1px;
      text-shadow: 0 0 4px #ff4400;
      animation: blink 1.5s step-end infinite;
    }

    /* ── Torches ── */
    .cp1-torch {
      left: 8%; bottom: 38%;
      display: flex; flex-direction: column; align-items: center; gap: 0;
    }
    .cp1-torch-right { left: auto; right: 8%; }
    .torch-mount {
      width: 14px; height: 6px;
      background: #3d1e00; border: 1px solid #6a3800;
    }
    .torch-body {
      width: 10px; height: 28px;
      background: linear-gradient(180deg, #6a3800, #3d1e00);
      border: 1px solid #4e2800;
    }
    .torch-flame {
      position: relative; width: 16px; height: 24px;
      margin-top: -4px;
    }
    .flame {
      position: absolute; bottom: 0;
      border-radius: 50% 50% 20% 20%;
      animation: flame-flicker 0.4s ease-in-out infinite alternate;
    }
    .f1 { width: 16px; height: 22px; left: 0; background: rgba(255,60,0,0.9); }
    .f2 { width: 10px; height: 16px; left: 3px; background: rgba(255,140,0,0.9); animation-delay: .1s; }
    .f3 { width: 6px;  height: 10px; left: 5px; background: rgba(255,220,0,0.95); animation-delay: .2s; }
    @keyframes flame-flicker {
      0%   { transform: scaleX(1)    scaleY(1)    rotate(-2deg); }
      100% { transform: scaleX(0.88) scaleY(1.08) rotate(2deg); }
    }
    .torch-glow {
      position: absolute;
      width: 60px; height: 60px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,100,0,0.18) 0%, transparent 70%);
      top: -20px; left: -22px;
      pointer-events: none;
      animation: glow-pulse 1.2s ease-in-out infinite alternate;
    }
    @keyframes glow-pulse {
      0%   { transform: scale(1);    opacity: 0.6; }
      100% { transform: scale(1.15); opacity: 1; }
    }

    /* ── Statue ── */
    .cp1-statue {
      left: 3%; bottom: 14%;
      display: flex; flex-direction: column; align-items: center;
    }
    .statue-head {
      width: 22px; height: 22px; border-radius: 50% 50% 40% 40%;
      background: linear-gradient(180deg, #4e2800, #3d1e00);
      border: 1px solid #6a3800;
    }
    .statue-body {
      width: 30px; height: 50px;
      background: linear-gradient(180deg, #3d1e00, #2e1500);
      border: 1px solid #4e2800;
      clip-path: polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%);
    }
    .statue-base {
      width: 40px; height: 14px;
      background: #2e1500; border: 1px solid #4e2800;
    }

    /* ── Shield ── */
    .cp1-shield {
      right: 3%; bottom: 30%;
      display: flex; flex-direction: column; align-items: center;
    }
    .shield-body {
      width: 36px; height: 44px; position: relative;
      background: linear-gradient(135deg, #4e2800, #2e1500);
      border: 2px solid #6a3800;
      clip-path: polygon(10% 0%, 90% 0%, 100% 60%, 50% 100%, 0% 60%);
    }
    .shield-cross-h {
      position: absolute; top: 38%; left: 10%; right: 10%; height: 4px;
      background: #6a3800;
    }
    .shield-cross-v {
      position: absolute; left: 44%; top: 15%; bottom: 25%; width: 4px;
      background: #6a3800;
    }

    /* ── Chains ── */
    .cp1-chains {
      left: 50%; bottom: 20%;
      transform: translateX(-50%);
      display: flex; flex-direction: column; align-items: center; gap: 1px;
    }
    .chain-link {
      width: 12px; height: 8px;
      border: 3px solid #4e2800;
      border-radius: 4px;
      background: transparent;
      animation: chain-sway 2s ease-in-out infinite alternate;
    }
    .chain-link:nth-child(odd)  { transform: rotate(90deg); }
    .chain-link:nth-child(even) { animation-delay: 0.3s; }
    @keyframes chain-sway {
      0%   { transform: rotate(90deg) translateX(-1px); }
      100% { transform: rotate(90deg) translateX(1px); }
    }
    .chain-link:nth-child(even) {
      transform: rotate(0deg);
    }

    /* ── Sign ── */
    .cp1-sign {
      left: 50%; top: 32%;
      transform: translateX(-50%);
      display: flex; flex-direction: column; align-items: center;
      animation: sign-sway 3s ease-in-out infinite alternate;
    }
    @keyframes sign-sway {
      0%   { transform: translateX(-50%) rotate(-1.5deg); }
      100% { transform: translateX(-50%) rotate(1.5deg); }
    }
    .sign-rope-left, .sign-rope-right {
      position: absolute; top: -14px; width: 2px; height: 16px;
      background: #4e2800;
    }
    .sign-rope-left  { left: 8px; }
    .sign-rope-right { right: 8px; }
    .sign-board {
      width: 110px; padding: 8px 10px;
      background: linear-gradient(135deg, #3d1e00, #2e1500);
      border: 2px solid #ff4400;
      box-shadow: 0 0 12px rgba(255,68,0,0.5), inset 0 0 8px rgba(0,0,0,0.5);
      display: flex; flex-direction: column; align-items: center; gap: 4px;
    }
    .sign-text {
      font-family: 'Press Start 2P', monospace;
      font-size: 7px; color: #ff8800;
      text-shadow: 0 0 6px #ff4400;
      letter-spacing: 1px; text-align: center;
    }
    .sign-text-sm { font-size: 5px; color: #ff4400; animation: blink 0.8s step-end infinite; }
    .sign-label { color: #ff4400 !important; text-shadow: 0 0 8px #ff2200 !important; }

    /* ── Gate ── */
    .cp1-gate {
      position: absolute; bottom: 55px;
      left: 50%; transform: translateX(-50%);
      width: 160px; z-index: 6;
    }
    .gate-arch {
      position: absolute; top: -40px; left: -10px; right: -10px; height: 60px;
      background: linear-gradient(180deg, #2e1500, #3d1e00);
      border-radius: 50% 50% 0 0 / 80% 80% 0 0;
      border: 3px solid #4e2800; border-bottom: none;
      z-index: 6;
    }
    .gate-door {
      position: absolute; bottom: 0; width: 76px; height: 110px;
      background:
        repeating-linear-gradient(0deg, transparent, transparent 14px, rgba(0,0,0,0.3) 14px, rgba(0,0,0,0.3) 16px),
        linear-gradient(180deg, #2e1500, #1e0c00);
      border: 2px solid #4e2800;
      transition: transform 1.2s ease-in-out;
      z-index: 7;
    }
    .gate-door-left  { left: 0;   transform-origin: left center; }
    .gate-door-right { right: 0;  transform-origin: right center; }
    .gate-door-left.opening-left   { transform: perspective(300px) rotateY(-80deg); }
    .gate-door-right.opening-right { transform: perspective(300px) rotateY(80deg); }

    /* Portcullis */
    .gate-portcullis {
      position: absolute; bottom: 0; left: 4px; right: 4px; height: 110px;
      z-index: 8; overflow: hidden;
      transition: transform 1s ease-in-out;
      display: flex; flex-direction: column; justify-content: space-around;
      padding: 4px 0;
    }
    .gate-portcullis.rising { transform: translateY(-120px); }
    .port-bar {
      height: 3px; background: #4e2800;
      box-shadow: 0 0 4px rgba(255,60,0,0.3);
    }
    .port-h-bar { /* vertical bars handled via background */ }
    .gate-keyhole {
      position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
      width: 10px; height: 16px; z-index: 9;
      background: #0d0500; border: 1px solid #6a3800;
      border-radius: 50% 50% 0 0;
    }
    .gate-keyhole::after {
      content: ''; position: absolute; bottom: 0; left: 50%;
      transform: translateX(-50%);
      width: 6px; height: 8px;
      background: #0d0500; border: 1px solid #6a3800;
    }

    /* ══ MODAL ══════════════════════════════ */
    .cp1-modal {
      position: absolute; inset: 0; z-index: 50;
      background: rgba(0,0,0,0.85);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; pointer-events: none;
      transition: opacity 0.2s;
    }
    .cp1-modal.open { opacity: 1; pointer-events: all; }
    .modal-box {
      width: 90%; max-width: 480px;
      background: linear-gradient(135deg, #1a0800, #0d0500);
      border: 2px solid #ff4400;
      box-shadow: 0 0 30px rgba(255,68,0,0.4), inset 0 0 20px rgba(0,0,0,0.5);
      padding: 0;
    }
    .modal-header {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255,68,0,0.3);
      background: rgba(255,68,0,0.08);
    }
    .modal-icon { font-size: 20px; }
    .modal-title {
      font-family: 'Press Start 2P', monospace;
      font-size: 10px; color: #ff8800;
      text-shadow: 0 0 8px #ff4400;
      flex: 1; letter-spacing: 1px;
    }
    .modal-close {
      background: none; border: 1px solid #ff4400;
      color: #ff4400; font-size: 12px;
      width: 24px; height: 24px;
      cursor: pointer; padding: 0;
      font-family: monospace;
      transition: all 0.1s;
    }
    .modal-close:hover { background: #ff4400; color: #0d0500; }
    .modal-body { padding: 16px; }
    .modal-text {
      font-family: 'VT323', monospace;
      font-size: 18px; color: #ffcc88;
      line-height: 1.5; letter-spacing: 1px;
      margin-bottom: 12px;
    }
    .modal-code-wrap { display: none; }
    .modal-code {
      font-family: 'Press Start 2P', monospace;
      font-size: 9px; color: #ffcc00;
      background: rgba(0,0,0,0.5);
      border: 1px solid #ff8800;
      padding: 10px 12px;
      letter-spacing: 2px;
      word-break: break-all;
      text-shadow: 0 0 8px #ffaa00;
      margin-bottom: 8px;
    }
    .modal-hint {
      font-family: 'VT323', monospace;
      font-size: 15px; color: #ff8800;
      font-style: italic; letter-spacing: 1px;
    }

    /* ══ FLAG PANEL ══════════════════════════ */
    .cp1-flag-panel {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 92%; max-width: 520px;
      z-index: 15;
      opacity: 0; pointer-events: none;
      transition: opacity 0.3s;
    }
    .cp1-flag-panel.visible { opacity: 1; pointer-events: all; }
    .flag-panel-inner {
      background: linear-gradient(135deg, #1a0800, #0d0500);
      border: 2px solid #ff4400;
      box-shadow: 0 0 20px rgba(255,68,0,0.3);
      padding: 12px 16px;
      display: flex; flex-direction: column; gap: 8px;
    }
    .flag-panel-title {
      font-family: 'Press Start 2P', monospace;
      font-size: 9px; color: #ff8800;
      letter-spacing: 2px;
    }
    .flag-panel-sub {
      font-family: 'VT323', monospace;
      font-size: 15px; color: #cc4400; letter-spacing: 1px;
    }
    .flag-input-row { display: flex; gap: 8px; }
    .flag-input {
      flex: 1; background: #0d0500;
      border: 2px solid #ff4400; color: #ff8800;
      font-family: 'Press Start 2P', monospace; font-size: 10px;
      padding: 10px 12px; outline: none; letter-spacing: 2px;
      box-shadow: inset 0 0 10px rgba(255,60,0,0.08);
      transition: box-shadow 0.2s;
    }
    .flag-input:focus { box-shadow: 0 0 16px rgba(255,60,0,0.4), inset 0 0 10px rgba(255,60,0,0.1); }
    .flag-input.shake {
      animation: input-shake 0.4s ease-in-out;
    }
    @keyframes input-shake {
      0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 60%{transform:translateX(6px)}
    }
    .flag-submit-btn {
      font-family: 'Press Start 2P', monospace; font-size: 9px;
      color: #0d0500; background: #ff4400;
      border: none; padding: 10px 14px;
      cursor: pointer; letter-spacing: 1px;
      box-shadow: 3px 3px 0 #660000;
      transition: all 0.08s steps(1);
      white-space: nowrap;
    }
    .flag-submit-btn:hover { background: #ff8800; transform: translate(-1px,-1px); }
    .flag-submit-btn:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 #660000; }
    .flag-submit-btn:disabled { background: #2a1000; color: #4a2800; cursor: not-allowed; box-shadow: none; }
    .flag-feedback {
      font-family: 'Press Start 2P', monospace; font-size: 8px;
      min-height: 16px; letter-spacing: 1px;
    }
    .flag-feedback.success { color: #00ff88; text-shadow: 0 0 8px #00cc66; animation: blink 0.6s step-end infinite; }
    .flag-feedback.error   { color: #ff2200; text-shadow: 0 0 8px #cc0000; }
    .flag-attempts { font-family: 'VT323', monospace; font-size: 13px; color: #4a2800; letter-spacing: 1px; }

    /* ══ GATE OPEN OVERLAY ═══════════════════ */
    .gate-open-overlay {
      position: absolute; inset: 0; z-index: 60;
      background: rgba(0,0,0,0.9);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 16px;
      opacity: 0; pointer-events: none;
      transition: opacity 0.5s;
    }
    .gate-open-overlay.visible { opacity: 1; }
    .gate-open-text {
      font-family: 'Press Start 2P', monospace;
      font-size: clamp(14px,3vw,22px); color: #ffcc00;
      text-shadow: 0 0 20px #ffaa00, 0 0 40px #ff8800;
      letter-spacing: 4px;
      animation: blink 0.6s step-end infinite;
    }
    .gate-open-sub {
      font-family: 'VT323', monospace;
      font-size: 20px; color: #ff8800;
      letter-spacing: 3px;
    }
    `;
        document.head.appendChild(style);
    }

    // ── Public API ────────────────────────────
    return { load };

})();