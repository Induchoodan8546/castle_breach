/* ═══════════════════════════════════════════════
   CASTLE BREACH — checkpoints/cp3.js
   Checkpoint 3: Monster Chamber
   Puzzle: MD5 hash cracking → flag{monster_defeated}
════════════════════════════════════════════════ */

const CP3 = (() => {

    // ── Puzzle data ────────────────────────────
    const MD5_HASH = '5f4dcc3b5aa765d61d8327deb882cf99';
    const ANSWER = 'password';
    const CORRECT_FLAG = 'flag{password}';

    let flagSubmitted = false;
    let attempts = 0;
    let monsterIdle = null;

    // ── Object content ─────────────────────────
    const objectData = {
        crystal: {
            title: 'CRYSTAL BALL',
            icon: '🔮',
            text: 'A glowing crystal ball sits on a pedestal. Inside the swirling mist you see a vision — a string of strange hexadecimal characters. The crystal whispers: "What was once plain becomes a digest of 32 characters..."',
            clue: false,
        },
        bones: {
            title: 'BONES & SKULLS',
            icon: '💀',
            text: 'The remains of those who tried before you. One skull has a note wedged between its teeth. It reads: "I used the most common password in the world... and still failed. Or did I?" The note crumbles to dust.',
            clue: false,
        },
        portal: {
            title: 'MAGIC PORTAL',
            icon: '🌀',
            text: 'A swirling portal of dark energy blocks the path beyond the monster. Strange runes circle its edge. The runes read: "MD5 — Message Digest 5. 128 bits. 32 hex chars. Irreversible... unless you already know the answer."',
            clue: false,
        },
        monster: {
            title: '🐉 THE DRAGON',
            icon: '🐉',
            text: 'The dragon turns its burning eyes toward you. Around its neck hangs a cracked obsidian tablet. Carved into the tablet:',
            code: MD5_HASH,
            hint: 'This is an MD5 hash. The Romans were fond of shifting messages',
            clue: true,
        },
    };

    // ═══════════════════════════════════════════
    //  BUILD SCENE
    // ═══════════════════════════════════════════
    function buildScene() {
        const scene = document.getElementById('gameScene');
        if (!scene) return;

        scene.innerHTML = `
      <div class="cp3-scene" id="cp3Scene">

        <!-- Background layers -->
        <div class="cp3-bg"></div>
        <div class="cp3-bg-glow"></div>

        <!-- Ceiling stalactites -->
        <div class="cp3-ceiling">
          <div class="stalactite s1"></div>
          <div class="stalactite s2"></div>
          <div class="stalactite s3"></div>
          <div class="stalactite s4"></div>
          <div class="stalactite s5"></div>
        </div>

        <!-- Story banner -->
        <div class="cp3-story-banner">
          <span class="cp3-story-text">A fearsome dragon blocks your path. Defeat it to proceed.</span>
        </div>

        <!-- BONES LEFT -->
        <div class="cp3-object cp3-bones" id="obj-bones" data-obj="bones">
          <div class="bone b1"></div>
          <div class="bone b2"></div>
          <div class="skull">
            <div class="skull-eye e1"></div>
            <div class="skull-eye e2"></div>
            <div class="skull-teeth"></div>
          </div>
          <div class="bone b3"></div>
          <div class="obj-label">REMAINS</div>
        </div>

        <!-- CRYSTAL BALL RIGHT -->
        <div class="cp3-object cp3-crystal" id="obj-crystal" data-obj="crystal">
          <div class="crystal-stand"></div>
          <div class="crystal-orb">
            <div class="crystal-inner"></div>
            <div class="crystal-shine"></div>
          </div>
          <div class="obj-label">CRYSTAL</div>
        </div>

        <!-- MAGIC PORTAL -->
        <div class="cp3-object cp3-portal" id="obj-portal" data-obj="portal">
          <div class="portal-ring pr1"></div>
          <div class="portal-ring pr2"></div>
          <div class="portal-ring pr3"></div>
          <div class="portal-core"></div>
          <div class="portal-rune rune1">ᛗ</div>
          <div class="portal-rune rune2">ᛞ</div>
          <div class="portal-rune rune3">ᚠ</div>
          <div class="portal-rune rune4">ᛟ</div>
          <div class="obj-label">PORTAL</div>
        </div>

        <!-- ═══ ARCANE DRAKE — flying figure-8 path ═══ -->
        <div class="cp3-fly-anchor">
          <div class="cp3-fly-wrap" id="dragonFlyWrap">

            <!-- Pulsing arcane aura rings -->
            <div class="arcane-ring ar1"></div>
            <div class="arcane-ring ar2"></div>
            <div class="arcane-ring ar3"></div>

            <!-- Orbiting rune symbols at different speeds -->
            <div class="rorbit rorbit-1"><span>ᛗ</span></div>
            <div class="rorbit rorbit-2"><span>ᚦ</span></div>
            <div class="rorbit rorbit-3"><span>ᛞ</span></div>
            <div class="rorbit rorbit-4"><span>ᛟ</span></div>

            <!-- Magic particle trail -->
            <div id="dragonTrail" style="position:absolute;inset:0;pointer-events:none;overflow:visible;"></div>

            <!-- Clickable dragon body -->
            <div class="cp3-object cp3-dragon" id="obj-monster" data-obj="monster">
              <div class="dragon-wrap" id="dragonWrap">
                <div class="dragon-wing dw-left"></div>
                <div class="dragon-wing dw-right"></div>
                <div class="dragon-body">
                  <div class="dragon-eye de-left"></div>
                  <div class="dragon-eye de-right"></div>
                  <div class="dragon-nostril n1"></div>
                  <div class="dragon-nostril n2"></div>
                  <div class="dragon-fang f1"></div>
                  <div class="dragon-fang f2"></div>
                </div>
                <div class="dragon-neck"></div>
                <div class="dragon-torso">
                  <div class="dragon-scale sc1"></div>
                  <div class="dragon-scale sc2"></div>
                  <div class="dragon-scale sc3"></div>
                  <div class="dragon-tablet"><div class="tablet-text">MD5</div></div>
                </div>
                <div class="dragon-tail"></div>
                <div class="dragon-claw cl-left"></div>
                <div class="dragon-claw cl-right"></div>
                <div class="dragon-fire" id="dragonFire">
                  <span class="fire-particle fp1"></span>
                  <span class="fire-particle fp2"></span>
                  <span class="fire-particle fp3"></span>
                </div>
                <div class="dragon-explosion" id="dragonExplosion">
                  <span class="exp-ring er1"></span>
                  <span class="exp-ring er2"></span>
                  <span class="exp-burst"></span>
                </div>
              </div>
              <div class="obj-label dragon-label">🔥 INFERNAL DRAKE 🔥</div>
            </div>

          </div>
        </div>

        <!-- Ground / floor -->
        <div class="cp3-ground">
          <div class="floor-crack fc1"></div>
          <div class="floor-crack fc2"></div>
          <div class="floor-crack fc3"></div>
          <div class="lava-pool lp1"></div>
          <div class="lava-pool lp2"></div>
        </div>

        <!-- OBJECT POPUP MODAL (fixed, centered) -->
        <div class="cp3-modal" id="cp3Modal">
          <div class="cp3-modal-box">
            <div class="cp3-modal-header">
              <span class="cp3-modal-icon" id="cp3ModalIcon"></span>
              <span class="cp3-modal-title" id="cp3ModalTitle"></span>
              <button class="cp3-modal-close" id="cp3ModalClose">✕</button>
            </div>
            <div class="cp3-modal-body">
              <p class="cp3-modal-text" id="cp3ModalText"></p>
              <div class="cp3-code-wrap" id="cp3CodeWrap">
                <div class="cp3-hash-label">MD5 HASH (select &amp; copy):</div>
                <div class="cp3-code" id="cp3Code"></div>
                <div class="cp3-hint" id="cp3Hint"></div>
                <!-- Flag input — only visible for clue objects -->
                <div class="cp3-flag-row" id="cp3FlagRow">
                  <input
                    class="cp3-flag-input"
                    id="cp3FlagInput"
                    type="text"
                    placeholder="flag{...}"
                    autocomplete="off"
                    spellcheck="false"
                  />
                  <button class="cp3-flag-btn" id="cp3FlagBtn">CAST SPELL</button>
                </div>
                <div class="cp3-flag-feedback" id="cp3Feedback"></div>
                <div class="cp3-attempts" id="cp3Attempts">ATTEMPTS: 0</div>
              </div>
            </div>
          </div>
        </div>

        <!-- VICTORY OVERLAY -->
        <div class="cp3-victory" id="cp3Victory">
          <div class="cp3-victory-text">🔥 DRAGON DEFEATED! 🔥</div>
          <div class="cp3-victory-sub">FLAG CAPTURED — PROCEEDING TO FINAL TOWER</div>
        </div>

      </div>
    `;

        buildSkyParticles();
        startDragonIdle();
        wireEvents();
    }

    // ── Floating ember particles ───────────────
    function buildSkyParticles() {
        const scene = document.getElementById('cp3Scene');
        if (!scene) return;
        for (let i = 0; i < 18; i++) {
            const p = document.createElement('div');
            p.className = 'cp3-ember';
            p.style.cssText = `
        left:${Math.random() * 100}%;
        bottom:${10 + Math.random() * 30}%;
        animation-delay:${-Math.random() * 4}s;
        animation-duration:${2 + Math.random() * 3}s;
        width:${Math.random() < 0.4 ? 3 : 2}px;
        height:${Math.random() < 0.4 ? 3 : 2}px;
      `;
            scene.appendChild(p);
        }
    }

    // ── Dragon idle: fire breath + particle trail ──────────
    function startDragonIdle() {
        const fire = document.getElementById('dragonFire');

        // Fire breath every 3s
        monsterIdle = setInterval(() => {
            if (flagSubmitted) return;
            if (fire) { fire.classList.add('active'); setTimeout(() => fire.classList.remove('active'), 900); }
        }, 3000);

        // Magic particle trail every 400ms
        setInterval(() => {
            if (flagSubmitted) return;
            spawnTrailParticle();
        }, 400);
    }

    function spawnTrailParticle() {
        const trail = document.getElementById('dragonTrail');
        if (!trail) return;
        const p = document.createElement('div');
        const isPurple = Math.random() > 0.4;
        const size = 2 + Math.floor(Math.random() * 4);
        const ox = (Math.random() - 0.5) * 60;
        const oy = (Math.random() - 0.5) * 60;
        p.style.cssText = `
      position:absolute;
      left:calc(50% + ${ox}px); top:calc(50% + ${oy}px);
      width:${size}px; height:${size}px;
      border-radius:50%;
      background:${isPurple ? '#bb44ff' : '#ffaa00'};
      box-shadow:0 0 6px ${isPurple ? '#cc66ff' : '#ffcc44'},0 0 12px ${isPurple ? '#9900ff' : '#ff8800'};
      animation:trail-fade 1.4s ease-out forwards;
      pointer-events:none;
    `;
        trail.appendChild(p);
        setTimeout(() => p.remove(), 1400);
    }
    // ── Wire events ────────────────────────────
    function wireEvents() {
        document.querySelectorAll('.cp3-object').forEach(el => {
            el.addEventListener('click', () => {
                const key = el.dataset.obj;
                if (key) openModal(key);
            });
        });

        document.getElementById('cp3ModalClose').addEventListener('click', closeModal);
        document.getElementById('cp3Modal').addEventListener('click', e => {
            if (e.target.id === 'cp3Modal') closeModal();
        });

        document.getElementById('cp3FlagBtn').addEventListener('click', submitFlag);
        document.getElementById('cp3FlagInput').addEventListener('keydown', e => {
            if (e.key === 'Enter') submitFlag();
        });
    }

    // ── Open modal ─────────────────────────────
    function openModal(key) {
        const data = objectData[key];
        if (!data) return;
        if (typeof Audio !== 'undefined') Audio.play('objectClick');

        document.getElementById('cp3ModalIcon').textContent = data.icon || '👁';
        document.getElementById('cp3ModalTitle').textContent = data.title;
        document.getElementById('cp3ModalText').textContent = data.text;

        const codeWrap = document.getElementById('cp3CodeWrap');
        const flagRow = document.getElementById('cp3FlagRow');
        if (data.clue && data.code) {
            codeWrap.style.display = 'block';
            flagRow.style.display = 'flex';
            document.getElementById('cp3Code').textContent = data.code;
            document.getElementById('cp3Hint').textContent = data.hint || '';
        } else {
            codeWrap.style.display = 'none';
        }

        document.getElementById('cp3Modal').classList.add('open');
        if (data.clue) setTimeout(() => document.getElementById('cp3FlagInput').focus(), 100);
    }

    function closeModal() {
        document.getElementById('cp3Modal').classList.remove('open');
    }

    // ── Submit flag ────────────────────────────
    function submitFlag() {
        if (flagSubmitted) return;

        const input = document.getElementById('cp3FlagInput');
        const feedback = document.getElementById('cp3Feedback');
        const attemptsEl = document.getElementById('cp3Attempts');

        const answer = input.value.trim().toLowerCase();
        attempts++;
        attemptsEl.textContent = `ATTEMPTS: ${attempts}`;

        if (answer === CORRECT_FLAG) {
            flagSubmitted = true;
            clearInterval(monsterIdle);

            if (typeof Audio !== 'undefined') Audio.play('flagCaptured');
            feedback.textContent = '✅ SPELL CAST! DRAGON DEFEATED!';
            feedback.className = 'cp3-flag-feedback success';
            input.disabled = true;
            document.getElementById('cp3FlagBtn').disabled = true;

            if (typeof captureFlag === 'function') captureFlag(3);


            setTimeout(() => {
                closeModal();
                explodeDragon();
            }, 1000);

        } else {
            if (typeof Audio !== 'undefined') Audio.play('dragonRoar');
            feedback.textContent = '❌ THE DRAGON LAUGHS AT YOU. TRY AGAIN.';
            feedback.className = 'cp3-flag-feedback error';
            input.value = '';
            input.classList.add('cp3-shake');
            setTimeout(() => input.classList.remove('cp3-shake'), 500);

            // Dragon reacts — fire breath on wrong answer
            const fire = document.getElementById('dragonFire');
            if (fire) {
                fire.classList.add('active');
                setTimeout(() => fire.classList.remove('active'), 1000);
            }
        }
    }

    // ── Dragon explosion animation ─────────────
    function explodeDragon() {
        if (typeof Audio !== 'undefined') Audio.play('dragonExplosion');
        
        const dragon = document.getElementById('dragonWrap');
        const explosion = document.getElementById('dragonExplosion');
        const fire = document.getElementById('dragonFire');
        const victory = document.getElementById('cp3Victory');

        if (fire) fire.classList.add('active');
        if (explosion) explosion.classList.add('active');

        setTimeout(() => {
            if (dragon) dragon.classList.add('exploding');
        }, 300);

        setTimeout(() => {
            if (victory) victory.classList.add('visible');
            if (typeof Audio !== 'undefined') setTimeout(() => Audio.play('portalWhoosh'), 1800);
        }, 1000);

        setTimeout(() => {
            victory.classList.remove('visible');
            // Transition to CP4
            if (typeof CP4 !== 'undefined' && typeof CP4.load === 'function') {
                CP4.load();
            } else {
                const scene = document.getElementById('gameScene');
                if (scene) {
                    scene.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;gap:14px;position:relative;z-index:10;">
              <div style="font-family:'Press Start 2P',monospace;font-size:18px;color:#ff4400;text-shadow:0 0 14px #cc2200;">CHECKPOINT 4</div>
              <div style="font-family:'VT323',monospace;font-size:22px;color:#ff8800;letter-spacing:3px;animation:blink 1s step-end infinite;">THE FINAL TOWER — COMING NEXT</div>
            </div>`;
                }
                if (typeof GameState !== 'undefined') {
                    GameState.currentCP = 4;
                    const cpEl = document.getElementById('hudCheckpoint');
                    if (cpEl) cpEl.textContent = '4/4';
                }
            }
        }, 3800);
    }

    // ── Public load ────────────────────────────
    function load() {
        flagSubmitted = false;
        attempts = 0;
        clearInterval(monsterIdle);
        buildScene();
        injectStyles();
    }

    // ═══════════════════════════════════════════
    //  STYLES
    // ═══════════════════════════════════════════
    function injectStyles() {
        if (document.getElementById('cp3-styles')) return;
        const style = document.createElement('style');
        style.id = 'cp3-styles';
        style.textContent = `

    .cp3-scene {
      position:relative; width:100%; height:100%;
      overflow:hidden; display:flex;
      align-items:flex-end; justify-content:center;
    }

    /* Background */
    .cp3-bg {
      position:absolute; inset:0; z-index:0;
      background:linear-gradient(180deg,#050000 0%,#1a0000 30%,#2a0800 60%,#1a0500 100%);
    }
    .cp3-bg-glow {
      position:absolute; inset:0; z-index:1;
      background:
        radial-gradient(ellipse 60% 30% at 50% 90%, rgba(255,60,0,0.18) 0%, transparent 70%),
        radial-gradient(ellipse 40% 20% at 30% 60%, rgba(180,0,0,0.12) 0%, transparent 60%),
        radial-gradient(ellipse 40% 20% at 70% 60%, rgba(180,0,0,0.12) 0%, transparent 60%);
    }

    /* Ceiling */
    .cp3-ceiling {
      position:absolute; top:0; left:0; right:0; height:60px;
      z-index:3; display:flex; justify-content:space-around; align-items:flex-start;
      background:linear-gradient(180deg,#0d0000,transparent);
    }
    .stalactite {
      background:linear-gradient(180deg,#2e0800,#1a0400);
      border-left:1px solid #4e1000; border-right:1px solid #4e1000;
      clip-path:polygon(20% 0%,80% 0%,50% 100%);
    }
    .s1{width:30px;height:55px} .s2{width:20px;height:40px} .s3{width:36px;height:65px}
    .s4{width:22px;height:45px} .s5{width:28px;height:50px}

    /* Story banner */
    .cp3-story-banner {
      position:absolute; top:4px; left:0; right:0;
      z-index:20; text-align:center; padding:6px 20px;
    }
    .cp3-story-text {
      font-family:'VT323',monospace; font-size:18px;
      color:#ff6600; text-shadow:0 0 8px #ff2200; letter-spacing:2px;
    }

    /* Ground */
    .cp3-ground {
      position:absolute; bottom:0; left:0; right:0; height:55px;
      z-index:5; background:linear-gradient(180deg,#1a0500,#0d0200);
      border-top:2px solid #3d1000;
    }
    .floor-crack {
      position:absolute; bottom:10px; height:2px;
      background:rgba(255,40,0,0.3);
    }
    .fc1{width:80px;left:10%;transform:rotate(-5deg)}
    .fc2{width:60px;left:45%;transform:rotate(3deg)}
    .fc3{width:90px;right:8%;transform:rotate(-2deg)}
    .lava-pool {
      position:absolute; bottom:0; height:8px; border-radius:50%;
      background:radial-gradient(ellipse,#ff4400,#880000);
      animation:lava-pulse 1.5s ease-in-out infinite alternate;
    }
    .lp1{width:60px;left:15%} .lp2{width:40px;right:20%;animation-delay:.5s}
    @keyframes lava-pulse{0%{opacity:0.6;transform:scaleX(1)}100%{opacity:1;transform:scaleX(1.05)}}

    /* Embers */
    .cp3-ember {
      position:absolute; border-radius:50%;
      background:#ff6600; z-index:4;
      animation:ember-rise 3s ease-in infinite;
    }
    @keyframes ember-rise {
      0%  {opacity:0;transform:translateY(0) scale(1)}
      30% {opacity:1}
      100%{opacity:0;transform:translateY(-120px) scale(0.3)}
    }

    /* ══ OBJECTS ══ */
    .cp3-object {
      position:absolute; cursor:pointer; z-index:10;
      transition:transform 0.15s steps(2);
    }
    .cp3-object:hover{transform:scale(1.08)}
    .cp3-object::after {
      content:''; position:absolute; inset:-6px; border-radius:4px;
      animation:cp3-obj-pulse 2s ease-in-out infinite; pointer-events:none;
    }
    @keyframes cp3-obj-pulse{
      0%,100%{box-shadow:0 0 0px rgba(255,80,0,0)}
      50%{box-shadow:0 0 16px rgba(255,80,0,0.5)}
    }
    .obj-label {
      font-family:'Press Start 2P',monospace; font-size:5px;
      color:#ff8800; text-align:center; margin-top:4px;
      letter-spacing:1px; text-shadow:0 0 4px #ff4400;
      animation:blink 1.5s step-end infinite;
    }

    /* Bones */
    .cp3-bones{left:3%;bottom:14%;display:flex;flex-direction:column;align-items:center;gap:2px}
    .bone{background:#3d2800;border:1px solid #6a4400;border-radius:4px}
    .b1{width:40px;height:8px;transform:rotate(-15deg)}
    .b2{width:32px;height:8px;transform:rotate(20deg)}
    .b3{width:36px;height:8px;transform:rotate(-8deg)}
    .skull{
      width:28px;height:24px;background:#3d2800;
      border:1px solid #6a4400;border-radius:50% 50% 40% 40%;
      position:relative;display:flex;align-items:center;justify-content:center;gap:4px;
    }
    .skull-eye{width:6px;height:6px;background:#0d0500;border-radius:50%;margin-top:-4px}
    .skull-teeth{
      position:absolute;bottom:0;left:4px;right:4px;height:6px;
      background:repeating-linear-gradient(90deg,#3d2800 0px,#3d2800 4px,#0d0500 4px,#0d0500 6px);
    }

    /* Crystal */
    .cp3-crystal{right:4%;bottom:14%;display:flex;flex-direction:column;align-items:center}
    .crystal-stand{
      width:24px;height:18px;
      background:linear-gradient(180deg,#4e2800,#2e1500);
      border:1px solid #6a3800;
      clip-path:polygon(20% 0%,80% 0%,100% 100%,0% 100%);
    }
    .crystal-orb{
      width:42px;height:42px;border-radius:50%;
      background:radial-gradient(circle at 35% 30%,#cc44ff,#440088);
      border:2px solid #8800cc;
      box-shadow:0 0 20px rgba(180,0,255,0.5),inset 0 0 12px rgba(255,255,255,0.1);
      position:relative;animation:orb-pulse 2s ease-in-out infinite alternate;
    }
    @keyframes orb-pulse{0%{box-shadow:0 0 15px rgba(180,0,255,0.4)}100%{box-shadow:0 0 35px rgba(180,0,255,0.8)}}
    .crystal-inner{
      position:absolute;top:25%;left:25%;width:50%;height:50%;
      border-radius:50%;background:rgba(255,200,255,0.15);
      animation:orb-swirl 3s linear infinite;
    }
    @keyframes orb-swirl{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
    .crystal-shine{
      position:absolute;top:15%;left:20%;width:10px;height:6px;
      background:rgba(255,255,255,0.4);border-radius:50%;transform:rotate(-30deg);
    }

    /* Portal */
    .cp3-portal{
      right:16%;bottom:16%;
      width:70px;height:80px;
      display:flex;align-items:center;justify-content:center;
    }
    .portal-ring{
      position:absolute;border-radius:50%;border-style:solid;
      animation:portal-spin 4s linear infinite;
    }
    .pr1{width:64px;height:64px;border-width:3px;border-color:#ff4400 transparent #ff4400 transparent;animation-duration:2s}
    .pr2{width:52px;height:52px;border-width:2px;border-color:transparent #ff8800 transparent #ff8800;animation-duration:3s;animation-direction:reverse}
    .pr3{width:40px;height:40px;border-width:2px;border-color:#ffcc00 transparent transparent transparent;animation-duration:4s}
    @keyframes portal-spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
    .portal-core{
      position:absolute;width:28px;height:28px;border-radius:50%;
      background:radial-gradient(circle,#ff2200,#660000);
      box-shadow:0 0 20px rgba(255,40,0,0.8);
      animation:portal-pulse 1s ease-in-out infinite alternate;
    }
    @keyframes portal-pulse{0%{transform:scale(0.9)}100%{transform:scale(1.1)}}
    .portal-rune{
      position:absolute;font-size:10px;color:#ff8800;
      text-shadow:0 0 6px #ff4400;animation:portal-spin 6s linear infinite;
    }
    .rune1{top:-4px;left:50%;transform:translateX(-50%)}
    .rune2{bottom:-4px;left:50%;transform:translateX(-50%)}
    .rune3{left:-4px;top:50%;transform:translateY(-50%)}
    .rune4{right:-4px;top:50%;transform:translateY(-50%)}

    /* ══ FLYING ARCANE DRAGON ══ */

    /* Anchor: stays at scene center, no transform animation */
    .cp3-fly-anchor {
      position:absolute;
      left:50%; top:42%;
      transform:translate(-50%,-50%);
      z-index:10;
      pointer-events:none;
    }

    /* Wrapper: does the figure-8 flight */
    .cp3-fly-wrap {
      position:relative;
      width:0; height:0;
      animation:dragon-fly 14s ease-in-out infinite;
    }
    @keyframes dragon-fly {
      0%   { transform:translateX(0px)   translateY(0px);   }
      12%  { transform:translateX(100px)  translateY(-55px); }
      25%  { transform:translateX(140px)  translateY(0px);   }
      37%  { transform:translateX(100px)  translateY(55px);  }
      50%  { transform:translateX(0px)   translateY(0px);   }
      62%  { transform:translateX(-100px) translateY(-55px); }
      75%  { transform:translateX(-140px) translateY(0px);   }
      87%  { transform:translateX(-100px) translateY(55px);  }
      100% { transform:translateX(0px)   translateY(0px);   }
    }

    /* Arcane aura rings that expand outward */
    .arcane-ring {
      position:absolute;
      left:50%; top:50%;
      transform:translate(-50%,-50%);
      border-radius:50%;
      border-style:solid;
      pointer-events:none;
      animation:arcane-expand 2.4s ease-out infinite;
    }
    .ar1 { width:60px;  height:60px;  border-width:3px; border-color:rgba(220,0,0,0.9);   animation-delay:0s;   }
    .ar2 { width:60px;  height:60px;  border-width:2px; border-color:rgba(255,60,0,0.6);  animation-delay:0.7s; }
    .ar3 { width:60px;  height:60px;  border-width:1px; border-color:rgba(255,120,0,0.3); animation-delay:1.4s; }
    @keyframes arcane-expand {
      0%   { transform:translate(-50%,-50%) scale(0.4); opacity:1;   }
      100% { transform:translate(-50%,-50%) scale(4.5); opacity:0;   }
    }

    /* Orbiting rune symbols */
    .rorbit {
      position:absolute;
      left:50%; top:50%;
      width:0; height:0;
      pointer-events:none;
    }
    .rorbit span {
      position:absolute;
      font-size:16px;
      color:#ff3300;
      text-shadow:0 0 8px #ff6600, 0 0 20px #cc2200, 0 0 30px #880000;
      animation:rune-bob 1.6s ease-in-out infinite alternate;
    }
    /* Each rune orbits at a different radius and speed */
    .rorbit-1 { animation:orbit-cw 4s linear infinite; }
    .rorbit-1 span { top:-60px; left:-8px; }
    .rorbit-2 { animation:orbit-ccw 5.5s linear infinite; animation-delay:-1.5s; }
    .rorbit-2 span { top:-48px; left:-8px; }
    .rorbit-3 { animation:orbit-cw 7s linear infinite; animation-delay:-3s; }
    .rorbit-3 span { top:-70px; left:-8px; }
    .rorbit-4 { animation:orbit-ccw 3.5s linear infinite; animation-delay:-0.8s; }
    .rorbit-4 span { top:-52px; left:-8px; }

    @keyframes orbit-cw  { 0%{transform:rotate(0deg)}   100%{transform:rotate(360deg)}  }
    @keyframes orbit-ccw { 0%{transform:rotate(0deg)}   100%{transform:rotate(-360deg)} }
    @keyframes rune-bob  { 0%{transform:scale(0.8) translateY(0)} 100%{transform:scale(1.2) translateY(-4px)} }

    /* Magic particle trail fade */
    @keyframes trail-fade {
      0%   { opacity:1; transform:scale(1)   translateY(0);    }
      100% { opacity:0; transform:scale(0.2) translateY(-28px); }
    }

    /* Dragon object — no longer absolutely positioned by itself */
    .cp3-dragon {
      position:absolute;
      left:50%; top:50%;
      transform:translate(-50%,-50%);
      display:flex; flex-direction:column; align-items:center;
      pointer-events:all;
      cursor:pointer;
    }
    .dragon-label {
      font-family:'Press Start 2P',monospace;
      font-size:5px!important; color:#ff2200!important;
      text-shadow:0 0 10px #ff4400, 0 0 20px #cc0000, 0 0 30px #880000!important;
      letter-spacing:1px; margin-top:6px;
      animation:blink 0.8s step-end infinite;
    }

    /* Hover — body bobs up and rotates slightly */
    .dragon-wrap {
      position:relative; display:flex; flex-direction:column; align-items:center;
      animation:dragon-hover 1.8s ease-in-out infinite alternate;
    }
    @keyframes dragon-hover {
      0%   { transform:translateY(0)    rotate(-4deg); }
      50%  { transform:translateY(-12px) rotate(0deg);  }
      100% { transform:translateY(-4px)  rotate(4deg);  }
    }
    .dragon-wrap.exploding {
      animation:dragon-explode 0.8s ease-out forwards;
    }
    @keyframes dragon-explode {
      0%   { transform:scale(1);   opacity:1; }
      50%  { transform:scale(1.6); opacity:0.8; }
      100% { transform:scale(0);   opacity:0; }
    }

    /* Wings — dark leathery */
    .dragon-wing {
      position:absolute; top:20px;
      width:62px; height:55px;
      background:linear-gradient(135deg,#1a0000,#0a0000);
      border:1px solid #880000;
      box-shadow:0 0 12px rgba(200,0,0,0.5), inset 0 0 8px rgba(0,0,0,0.9);
    }
    .dw-left  { left:-64px;  clip-path:polygon(100% 0%,100% 80%,0% 100%,5% 35%); transform-origin:right center;
                animation:wing-beat-l 0.45s ease-in-out infinite alternate; }
    .dw-right { right:-64px; clip-path:polygon(0% 0%,0% 80%,100% 100%,95% 35%);  transform-origin:left center;
                animation:wing-beat-r 0.45s ease-in-out infinite alternate; }
    @keyframes wing-beat-l {
      0%   { transform:rotateZ(0deg)   scaleY(1);    }
      30%  { transform:rotateZ(-28deg) scaleY(0.45); }
      75%  { transform:rotateZ(10deg)  scaleY(1.25); }
      100% { transform:rotateZ(0deg)   scaleY(1);    }
    }
    @keyframes wing-beat-r {
      0%   { transform:rotateZ(0deg)  scaleY(1);    }
      30%  { transform:rotateZ(28deg) scaleY(0.45); }
      75%  { transform:rotateZ(-10deg) scaleY(1.25); }
      100% { transform:rotateZ(0deg)  scaleY(1);    }
    }

    .dragon-body {
      width:66px; height:48px;
      background:linear-gradient(135deg,#1a0000,#0d0000);
      border:2px solid #cc0000; border-radius:40% 40% 30% 30%;
      position:relative; display:flex; align-items:center; justify-content:center; gap:10px;
      box-shadow:0 0 28px rgba(255,0,0,0.8), 0 0 50px rgba(180,0,0,0.4), inset 0 0 12px rgba(0,0,0,0.9);
    }
    .dragon-eye {
      width:11px; height:11px; border-radius:50%;
      background:radial-gradient(circle,#ffffff 20%,#ffcc00 50%,#ff4400 80%,#cc0000);
      box-shadow:0 0 10px #ff6600, 0 0 20px #ff2200, 0 0 35px #ff0000;
      animation:eye-glow 0.7s ease-in-out infinite alternate;
    }
    @keyframes eye-glow { 0%{box-shadow:0 0 8px #ff6600,0 0 16px #ff2200} 100%{box-shadow:0 0 20px #ffcc00,0 0 35px #ff4400,0 0 50px #ff0000} }
    .dragon-nostril { position:absolute; bottom:6px; width:5px; height:4px; background:#050000; border-radius:50%; box-shadow:0 0 4px #ff2200; }
    .n1{left:18px} .n2{right:18px}
    .dragon-fang { position:absolute; bottom:-12px; width:7px; height:14px; background:linear-gradient(180deg,#cccccc,#aaaaaa); clip-path:polygon(25% 0%,75% 0%,50% 100%); filter:drop-shadow(0 2px 4px rgba(255,0,0,0.5)); }
    .f1{left:14px} .f2{right:14px}

    .dragon-neck {
      width:26px; height:20px;
      background:linear-gradient(180deg,#1a0000,#0d0000);
      border-left:1px solid #880000; border-right:1px solid #880000;
    }
    .dragon-torso {
      width:75px; height:60px;
      background:linear-gradient(135deg,#1a0000,#0d0000);
      border:2px solid #aa0000; border-radius:30%;
      position:relative; display:flex; align-items:center; justify-content:center;
      box-shadow:0 0 20px rgba(200,0,0,0.6), inset 0 0 15px rgba(0,0,0,0.9);
    }
    .dragon-scale { position:absolute; width:16px; height:11px; background:linear-gradient(135deg,#2a0000,#150000); border:1px solid #660000; border-radius:50% 50% 0 0; box-shadow:0 0 4px rgba(200,0,0,0.3); }
    .sc1{top:6px;left:8px} .sc2{top:6px;right:8px} .sc3{top:20px;left:50%;transform:translateX(-50%)}
    .dragon-tablet { position:absolute; bottom:-8px; width:46px; height:24px; background:linear-gradient(135deg,#0d0000,#050000); border:1px solid #cc0000; display:flex; align-items:center; justify-content:center; box-shadow:0 0 12px rgba(255,0,0,0.6); }
    .tablet-text { font-family:'Press Start 2P',monospace; font-size:7px; color:#ff3300; text-shadow:0 0 8px #ff0000, 0 0 16px #880000; letter-spacing:1px; }

    .dragon-tail { width:55px; height:18px; background:linear-gradient(90deg,#1a0000,#0a0000); border:1px solid #660000; border-radius:0 50% 50% 0; align-self:flex-end; margin-right:-22px; box-shadow:0 0 8px rgba(180,0,0,0.4); }
    .dragon-claw { position:absolute; bottom:-16px; width:22px; height:18px; background:linear-gradient(180deg,#1a0000,#0a0000); border:1px solid #770000; box-shadow:0 0 6px rgba(200,0,0,0.5); }
    .cl-left{left:6px;clip-path:polygon(0% 0%,100% 0%,80% 100%,50% 80%,20% 100%)}
    .cl-right{right:6px;clip-path:polygon(0% 0%,100% 0%,80% 100%,50% 80%,20% 100%)}

    /* Fire breath */
    .dragon-fire { position:absolute; top:10px; left:-70px; width:70px; height:24px; display:none; }
    .dragon-fire.active { display:flex; align-items:center; }
    .fire-particle { position:absolute; border-radius:50%; animation:fire-shoot 0.5s ease-out infinite; }
    .fp1{width:22px;height:18px;background:rgba(255,50,0,0.95);left:0;animation-delay:0s;box-shadow:0 0 10px #ff4400}
    .fp2{width:18px;height:14px;background:rgba(255,140,0,0.95);left:18px;animation-delay:.08s;box-shadow:0 0 8px #ff8800}
    .fp3{width:12px;height:10px;background:rgba(255,220,0,0.9);left:32px;animation-delay:.16s;box-shadow:0 0 6px #ffcc00}
    @keyframes fire-shoot{0%{transform:scaleX(0.7) scaleY(1.2)}50%{transform:scaleX(1.3) scaleY(0.8)}100%{transform:scaleX(0.7) scaleY(1.2)}}

    /* Explosion */
    .dragon-explosion{position:absolute;top:-20px;left:-30px;display:none;}
    .dragon-explosion.active{display:block;}
    .exp-ring{position:absolute;border-radius:50%;border:3px solid #bb44ff;animation:exp-expand 0.8s ease-out forwards;}
    .er1{width:40px;height:40px;top:0;left:0;animation-delay:0s}
    .er2{width:70px;height:70px;top:-15px;left:-15px;animation-delay:0.1s;border-color:#dd88ff}
    @keyframes exp-expand{0%{transform:scale(0);opacity:1}100%{transform:scale(2.5);opacity:0}}
    .exp-burst{position:absolute;width:50px;height:50px;top:-5px;left:-5px;border-radius:50%;background:radial-gradient(circle,#ffffff,#cc44ff,transparent);animation:burst 0.6s ease-out forwards;}
    @keyframes burst{0%{transform:scale(0);opacity:1}100%{transform:scale(3);opacity:0}}

    /* ══ MODAL ══ */
    .cp3-modal{
      position:fixed;inset:0;z-index:9999;
      background:rgba(0,0,0,0.88);
      display:flex;align-items:center;justify-content:center;
      opacity:0;pointer-events:none;transition:opacity 0.2s;
    }
    .cp3-modal.open{opacity:1;pointer-events:all;}
    .cp3-modal-box{
      width:92%;max-width:500px;
      background:linear-gradient(135deg,#1a0000,#0d0000);
      border:2px solid #ff4400;
      box-shadow:0 0 40px rgba(255,68,0,0.5);
    }
    .cp3-modal-header{
      display:flex;align-items:center;gap:10px;padding:12px 16px;
      border-bottom:1px solid rgba(255,68,0,0.3);background:rgba(255,68,0,0.08);
    }
    .cp3-modal-icon{font-size:20px}
    .cp3-modal-title{
      font-family:'Press Start 2P',monospace;font-size:10px;
      color:#ff8800;text-shadow:0 0 8px #ff4400;flex:1;letter-spacing:1px;
    }
    .cp3-modal-close{
      background:none;border:1px solid #ff4400;color:#ff4400;
      font-size:12px;width:24px;height:24px;cursor:pointer;padding:0;
      font-family:monospace;transition:all 0.1s;
    }
    .cp3-modal-close:hover{background:#ff4400;color:#0d0500;}
    .cp3-modal-body{padding:16px;}
    .cp3-modal-text{
      font-family:'VT323',monospace;font-size:18px;
      color:#ffcc88;line-height:1.5;letter-spacing:1px;margin-bottom:12px;
    }
    .cp3-code-wrap{display:none;}
    .cp3-hash-label{
      font-family:'Press Start 2P',monospace;font-size:7px;
      color:#ff4400;letter-spacing:2px;margin-bottom:6px;
    }
    .cp3-code{
      font-family:'Press Start 2P',monospace;font-size:8px;
      color:#ffcc00;background:rgba(0,0,0,0.5);
      border:1px solid #ff8800;padding:10px 12px;
      letter-spacing:2px;word-break:break-all;
      text-shadow:0 0 8px #ffaa00;margin-bottom:8px;
    }
    .cp3-hint{
      font-family:'VT323',monospace;font-size:15px;
      color:#ff8800;font-style:italic;letter-spacing:1px;
    }

    /* hash selectable */
    .cp3-code{user-select:text;-webkit-user-select:text;cursor:text;}

    /* ══ FLAG ROW (inside modal) ══ */
    .cp3-flag-row{display:none;gap:8px;margin-top:12px;}
    .cp3-flag-input{
      flex:1;background:#0d0000;border:2px solid #ff4400;
      color:#ff8800;font-family:'Press Start 2P',monospace;font-size:9px;
      padding:10px 12px;outline:none;letter-spacing:1px;
      box-shadow:inset 0 0 10px rgba(255,60,0,0.08);transition:box-shadow 0.2s;
    }
    .cp3-flag-input:focus{box-shadow:0 0 16px rgba(255,60,0,0.4),inset 0 0 10px rgba(255,60,0,0.1);}
    .cp3-flag-input.cp3-shake{animation:cp3-shake 0.4s ease-in-out;}
    @keyframes cp3-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}60%{transform:translateX(6px)}}
    .cp3-flag-btn{
      font-family:'Press Start 2P',monospace;font-size:8px;
      color:#0d0500;background:#ff4400;border:none;
      padding:10px 14px;cursor:pointer;letter-spacing:1px;
      box-shadow:3px 3px 0 #660000;white-space:nowrap;
    }
    .cp3-flag-btn:hover{background:#ff8800;}
    .cp3-flag-btn:disabled{background:#2a1000;color:#4a2800;cursor:not-allowed;box-shadow:none;}
    .cp3-flag-feedback{
      font-family:'Press Start 2P',monospace;font-size:7px;
      min-height:16px;letter-spacing:1px;margin-top:6px;
    }
    .cp3-flag-feedback.success{color:#00ff88;animation:blink 0.6s step-end infinite;}
    .cp3-flag-feedback.error{color:#ff2200;}
    .cp3-attempts{font-family:'VT323',monospace;font-size:13px;color:#4a2800;letter-spacing:1px;margin-top:4px;}

    /* ══ VICTORY ══ */
    .cp3-victory{
      position:absolute;inset:0;z-index:60;
      background:rgba(0,0,0,0.92);
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;gap:16px;
      opacity:0;pointer-events:none;transition:opacity 0.5s;
    }
    .cp3-victory.visible{opacity:1;}
    .cp3-victory-text{
      font-family:'Press Start 2P',monospace;
      font-size:clamp(13px,3vw,20px);color:#ffcc00;
      text-shadow:0 0 20px #ffaa00,0 0 40px #ff8800;
      letter-spacing:4px;animation:blink 0.6s step-end infinite;
    }
    .cp3-victory-sub{
      font-family:'VT323',monospace;font-size:20px;
      color:#ff8800;letter-spacing:3px;
    }
    `;
        document.head.appendChild(style);
    }

    return { load };

})();