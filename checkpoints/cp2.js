/* ═══════════════════════════════════════════════
   CASTLE BREACH — checkpoints/cp2.js
   Checkpoint 2: Hall of Paths
   Puzzle: Caesar Cipher (Shift -3) — find the correct hall
════════════════════════════════════════════════ */

const CP2 = (() => {

    const HALLS = {
        A: { label: 'PATH A', cipher: 'WKH OLJKW OHDGV WR IDLOXUH', decoded: 'THE LIGHT LEADS TO FAILURE', correct: false },
        B: { label: 'PATH B', cipher: 'WKH PLGGOH LV QRW DOZDBV VDIH', decoded: 'THE MIDDLE IS NOT ALWAYS SAFE', correct: false },
        C: { label: 'PATH C', cipher: 'WKH GDUNQHVV KLGHV WKH WUXH SDWK', decoded: 'THE DARKNESS HIDES THE TRUE PATH', correct: true },
    };

    let locked = false;
    let activeChoice = null;

    // ─────────────────────────────────────────
    // LOAD
    // ─────────────────────────────────────────
    function load() {
        locked = false;
        activeChoice = null;

        GameState.currentCP = 2;
        document.getElementById('hudCheckpoint').textContent = '2/4';

        buildScene();
        ensureModal();
    }

    // ─────────────────────────────────────────
    // BUILD SCENE
    // ─────────────────────────────────────────
    function buildScene() {
        const scene = document.getElementById('gameScene');
        scene.innerHTML = `
      <div id="cp2SceneRoot" style="
        position:relative; width:100%; height:100%;
        background:radial-gradient(circle at center,#1a0800 0%,#0d0500 60%,#000 100%);
        display:flex; flex-direction:column;
        align-items:center; justify-content:center;
        overflow:hidden; gap:20px;
      ">

        <!-- CRT scanlines -->
        <div style="position:absolute;inset:0;pointer-events:none;z-index:50;
          background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.15) 2px,rgba(0,0,0,0.15) 4px);">
        </div>

        <!-- particles layer -->
        <div id="particles" style="position:absolute;inset:0;pointer-events:none;z-index:40;"></div>

        <!-- Torches -->
        <div style="position:absolute;left:24px;top:45%;width:18px;height:55px;background:#4e2800;z-index:5;">
          <div style="position:absolute;top:-16px;left:0;width:18px;height:18px;border-radius:50%;background:radial-gradient(circle,#ffcc00,#ff4400);animation:cp2-flicker 0.25s infinite alternate;"></div>
        </div>
        <div style="position:absolute;right:24px;top:45%;width:18px;height:55px;background:#4e2800;z-index:5;">
          <div style="position:absolute;top:-16px;left:0;width:18px;height:18px;border-radius:50%;background:radial-gradient(circle,#ffcc00,#ff4400);animation:cp2-flicker 0.25s infinite alternate;"></div>
        </div>

        <!-- Title -->
        <div style="font-family:'Press Start 2P',monospace;font-size:18px;color:#ff4400;
          text-shadow:0 0 12px #cc2200;letter-spacing:3px;text-align:center;z-index:10;
          animation:flicker 3s infinite;">HALL OF PATHS</div>

        <!-- Subtitle -->
        <div style="font-family:'VT323',monospace;font-size:20px;color:#ff8800;
          letter-spacing:3px;text-align:center;z-index:10;margin-top:-10px;">
          ⚔ CHOOSE THE RIGHT PATH ⚔
        </div>

        <!-- HALLS ROW — simple flex, no absolute, no 3D -->
        <div style="display:flex;gap:30px;z-index:10;align-items:stretch;">

          <!-- HALL A -->
          <div id="hallA" onclick="CP2._open('A')" style="
            width:150px; min-height:220px;
            background:linear-gradient(180deg,#0a0200,#1a0800);
            border:2px solid #ff4400;
            box-shadow:0 0 18px rgba(255,68,0,0.4),inset 0 0 30px rgba(0,0,0,0.8);
            cursor:pointer;
            display:flex;flex-direction:column;
            align-items:center;justify-content:space-between;
            padding:14px 8px;
            transition:box-shadow 0.2s,transform 0.1s;
            position:relative;
          "
          onmouseover="this.style.boxShadow='0 0 35px rgba(255,100,0,0.7),inset 0 0 30px rgba(0,0,0,0.8)';this.style.transform='scale(1.05)';"
          onmouseout="this.style.boxShadow='0 0 18px rgba(255,68,0,0.4),inset 0 0 30px rgba(0,0,0,0.8)';this.style.transform='scale(1)';">
            <!-- Depth tunnel illusion -->
            <div style="position:absolute;inset:15px 20px;background:radial-gradient(ellipse at center,#050100,transparent);pointer-events:none;"></div>
            <div style="font-family:'Press Start 2P',monospace;font-size:7px;color:#ffcc00;
              text-shadow:0 0 6px #ffaa00;letter-spacing:1px;text-align:center;
              word-break:break-all;user-select:text;cursor:text;z-index:2;
              onclick='event.stopPropagation()'">
              ${HALLS.A.cipher}
            </div>
            <div style="font-family:'Press Start 2P',monospace;font-size:7px;color:#ff8800;
              letter-spacing:2px;text-align:center;z-index:2;">PATH A</div>
            <div style="font-family:'Press Start 2P',monospace;font-size:8px;
              color:#0d0500;background:#ff4400;
              border:none;padding:9px 14px;letter-spacing:2px;
              box-shadow:3px 3px 0 #660000;
              white-space:nowrap;z-index:2;
              animation:btn-pulse 2s ease-in-out infinite;">► ENTER</div>
          </div>

          <!-- HALL B -->
          <div id="hallB" onclick="CP2._open('B')" style="
            width:150px; min-height:220px;
            background:linear-gradient(180deg,#0a0200,#1a0800);
            border:2px solid #ff4400;
            box-shadow:0 0 18px rgba(255,68,0,0.4),inset 0 0 30px rgba(0,0,0,0.8);
            cursor:pointer;
            display:flex;flex-direction:column;
            align-items:center;justify-content:space-between;
            padding:14px 8px;
            transition:box-shadow 0.2s,transform 0.1s;
            position:relative;
          "
          onmouseover="this.style.boxShadow='0 0 35px rgba(255,100,0,0.7),inset 0 0 30px rgba(0,0,0,0.8)';this.style.transform='scale(1.05)';"
          onmouseout="this.style.boxShadow='0 0 18px rgba(255,68,0,0.4),inset 0 0 30px rgba(0,0,0,0.8)';this.style.transform='scale(1)';">
            <div style="position:absolute;inset:15px 20px;background:radial-gradient(ellipse at center,#050100,transparent);pointer-events:none;"></div>
            <div style="font-family:'Press Start 2P',monospace;font-size:7px;color:#ffcc00;
              text-shadow:0 0 6px #ffaa00;letter-spacing:1px;text-align:center;
              word-break:break-all;user-select:text;cursor:text;z-index:2;">
              ${HALLS.B.cipher}
            </div>
            <div style="font-family:'Press Start 2P',monospace;font-size:7px;color:#ff8800;
              letter-spacing:2px;text-align:center;z-index:2;">PATH B</div>
            <div style="font-family:'Press Start 2P',monospace;font-size:8px;
              color:#0d0500;background:#ff4400;
              border:none;padding:9px 14px;letter-spacing:2px;
              box-shadow:3px 3px 0 #660000;
              white-space:nowrap;z-index:2;
              animation:btn-pulse 2s ease-in-out infinite;">► ENTER</div>
          </div>

          <!-- HALL C -->
          <div id="hallC" onclick="CP2._open('C')" style="
            width:150px; min-height:220px;
            background:linear-gradient(180deg,#010000,#0d0300);
            border:2px solid #ff4400;
            box-shadow:0 0 18px rgba(255,68,0,0.4),inset 0 0 30px rgba(0,0,0,0.9);
            cursor:pointer;
            display:flex;flex-direction:column;
            align-items:center;justify-content:space-between;
            padding:14px 8px;
            transition:box-shadow 0.2s,transform 0.1s;
            position:relative;
          "
          onmouseover="this.style.boxShadow='0 0 35px rgba(255,100,0,0.7),inset 0 0 30px rgba(0,0,0,0.9)';this.style.transform='scale(1.05)';"
          onmouseout="this.style.boxShadow='0 0 18px rgba(255,68,0,0.4),inset 0 0 30px rgba(0,0,0,0.9)';this.style.transform='scale(1)';">
            <div style="position:absolute;inset:15px 20px;background:radial-gradient(ellipse at center,#000,transparent);pointer-events:none;"></div>
            <div style="font-family:'Press Start 2P',monospace;font-size:7px;color:#ffcc00;
              text-shadow:0 0 6px #ffaa00;letter-spacing:1px;text-align:center;
              word-break:break-all;user-select:text;cursor:text;z-index:2;">
              ${HALLS.C.cipher}
            </div>
            <div style="font-family:'Press Start 2P',monospace;font-size:7px;color:#ff8800;
              letter-spacing:2px;text-align:center;z-index:2;">PATH C</div>
            <div style="font-family:'Press Start 2P',monospace;font-size:8px;
              color:#0d0500;background:#ff4400;
              border:none;padding:9px 14px;letter-spacing:2px;
              box-shadow:3px 3px 0 #660000;
              white-space:nowrap;z-index:2;
              animation:btn-pulse 2s ease-in-out infinite;">► ENTER</div>
          </div>

        </div>

        <!-- red flash overlay -->
        <div id="cp2RedFlash" style="
          position:absolute;inset:0;z-index:35;
          background:radial-gradient(circle,rgba(255,0,0,0.7),rgba(180,0,0,0.3));
          opacity:0;pointer-events:none;transition:opacity 0.1s;
        "></div>

        <!-- success transition overlay -->
        <div id="cp2Transition" style="
          position:absolute;inset:0;z-index:60;
          background:rgba(0,0,0,0.95);
          display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;
          opacity:0;pointer-events:none;transition:opacity 0.8s;
        ">
          <div style="font-family:'Press Start 2P',monospace;font-size:20px;color:#ffcc00;
            text-shadow:0 0 20px #ffaa00;letter-spacing:4px;
            animation:blink 0.6s step-end infinite;">⚔ PATH UNLOCKED ⚔</div>
          <div style="font-family:'VT323',monospace;font-size:22px;color:#ff8800;letter-spacing:3px;">
            PROCEEDING TO CHECKPOINT 3...
          </div>
        </div>

      </div>
    `;
    }

    // ─────────────────────────────────────────
    // MODAL — always appended to document.body
    // ─────────────────────────────────────────
    function ensureModal() {
        const old = document.getElementById('_cp2Modal');
        if (old) old.remove();

        document.body.insertAdjacentHTML('beforeend', `
      <div id="_cp2Modal" style="
        display:none;position:fixed;inset:0;z-index:99999;
        background:rgba(0,0,0,0.9);
        align-items:center;justify-content:center;
      ">
        <div style="
          width:92%;max-width:520px;
          background:linear-gradient(135deg,#1a0800,#0d0500);
          border:2px solid #ff4400;
          box-shadow:0 0 50px rgba(255,68,0,0.6);
          font-family:'Press Start 2P',monospace;
        ">
          <!-- header -->
          <div style="display:flex;align-items:center;padding:14px 16px;
            border-bottom:1px solid rgba(255,68,0,0.3);background:rgba(255,68,0,0.08);">
            <span id="_cp2ModalTitle" style="flex:1;font-size:11px;color:#ff8800;
              text-shadow:0 0 8px #ff4400;letter-spacing:2px;">🚪 PATH A</span>
            <span onclick="CP2._close()" style="font-size:16px;color:#ff4400;cursor:pointer;padding:4px 8px;
              border:1px solid #ff4400;">✕</span>
          </div>
          <!-- body -->
          <div style="padding:18px;display:flex;flex-direction:column;gap:12px;">
            <div style="font-family:'VT323',monospace;font-size:16px;color:#cc4400;letter-spacing:1px;">
              CIPHER TEXT (select &amp; copy):
            </div>
            <div id="_cp2CipherText" style="
              font-size:8px;color:#ffcc00;
              background:rgba(0,0,0,0.6);
              border:1px solid #ff8800;
              padding:12px;letter-spacing:2px;
              word-break:break-all;text-align:center;
              text-shadow:0 0 8px #ffaa00;
              user-select:text;-webkit-user-select:text;cursor:text;
            "></div>
            <div style="font-family:'VT323',monospace;font-size:17px;color:#cc4400;text-align:center;letter-spacing:1px;">
              Decode using Caesar Cipher (Shift -3) and enter below
            </div>
            <div style="display:flex;gap:8px;">
              <input id="_cp2Input" type="text"
                placeholder="DECODED TEXT..."
                autocomplete="off" spellcheck="false"
                style="flex:1;background:#0d0500;border:2px solid #ff4400;color:#ff8800;
                  font-family:'Press Start 2P',monospace;font-size:8px;
                  padding:10px 12px;outline:none;letter-spacing:1px;text-transform:uppercase;"
                onkeydown="if(event.key==='Enter')CP2._submit();"
              />
              <span onclick="CP2._submit()" style="
                font-size:9px;color:#0d0500;background:#ff4400;
                padding:10px 16px;letter-spacing:1px;
                box-shadow:3px 3px 0 #660000;cursor:pointer;
                white-space:nowrap;display:flex;align-items:center;
              ">SUBMIT</span>
            </div>
            <div id="_cp2Feedback" style="
              font-size:7px;min-height:16px;letter-spacing:1px;text-align:center;color:#ff2200;
            "></div>
          </div>
        </div>
      </div>
    `);

        // Click outside to close
        document.getElementById('_cp2Modal').addEventListener('click', function (e) {
            if (e.target === this) CP2._close();
        });
    }

    // ─────────────────────────────────────────
    // PUBLIC API (exposed on CP2 object)
    // ─────────────────────────────────────────
    function _open(choice) {
        if (locked) return;
        activeChoice = choice;
        const hall = HALLS[choice];
        document.getElementById('_cp2ModalTitle').textContent = '🚪 ' + hall.label;
        document.getElementById('_cp2CipherText').textContent = hall.cipher;
        document.getElementById('_cp2Input').value = '';
        document.getElementById('_cp2Feedback').textContent = '';
        document.getElementById('_cp2Feedback').style.color = '#ff2200';
        document.getElementById('_cp2Modal').style.display = 'flex';
        setTimeout(() => { const el = document.getElementById('_cp2Input'); if (el) el.focus(); }, 80);
    }

    function _close() {
        const m = document.getElementById('_cp2Modal');
        if (m) m.style.display = 'none';
        activeChoice = null;
    }

    function _submit() {
        if (!activeChoice || locked) return;
        const input = document.getElementById('_cp2Input');
        const feedback = document.getElementById('_cp2Feedback');
        const answer = input.value.trim().toUpperCase();
        const hall = HALLS[activeChoice];

        if (!answer) {
            feedback.textContent = 'ENTER THE DECODED TEXT!';
            feedback.style.color = '#ff2200';
            return;
        }

        if (answer === hall.decoded) {
            if (hall.correct) {
                locked = true;
                feedback.textContent = '✅ CORRECT! PATH UNLOCKED!';
                feedback.style.color = '#00ff88';
                setTimeout(() => { _close(); successAnim(); }, 900);
            } else {
                locked = true;
                feedback.textContent = '💀 THIS PATH IS A TRAP!';
                feedback.style.color = '#ff2200';
                setTimeout(() => { _close(); failAnim(); }, 1000);
            }
        } else {
            feedback.textContent = '❌ WRONG DECODE. TRY AGAIN.';
            feedback.style.color = '#ff2200';
            input.value = '';
        }
    }

    // ─────────────────────────────────────────
    // PARTICLES
    // ─────────────────────────────────────────
    function spawnParticles(type, count) {
        const c = document.getElementById('particles');
        if (!c) return;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.style.cssText = `position:absolute;
        left:${Math.random() * 100}%;top:${Math.random() * 100}%;
        width:${type === 'fire' ? 3 : 4}px;height:${type === 'fire' ? 6 : 4}px;
        background:${type === 'fire' ? 'orange' : '#aa5500'};
        animation:${type === 'fire' ? 'fireMove' : 'dustMove'} ${type === 'fire' ? 1 : 2}s linear forwards;`;
            c.appendChild(p);
            setTimeout(() => p.remove(), 2100);
        }
    }

    // ─────────────────────────────────────────
    // FAIL ANIMATION
    // ─────────────────────────────────────────
    function failAnim() {
        const scene = document.getElementById('cp2SceneRoot');
        const flash = document.getElementById('cp2RedFlash');
        if (!scene || !flash) return;

        flash.style.opacity = '1';
        scene.style.animation = 'collapse 0.15s ease-in-out 6';
        spawnParticles('dust', 40);

        setTimeout(() => { flash.style.opacity = '0'; }, 200);
        setTimeout(() => { flash.style.opacity = '1'; }, 400);
        setTimeout(() => { flash.style.opacity = '0'; }, 600);
        setTimeout(() => { flash.style.opacity = '1'; }, 800);

        setTimeout(() => {
            scene.style.background = 'black';
            flash.style.opacity = '0';
        }, 1300);

        setTimeout(() => { load(); }, 2200);
    }

    // ─────────────────────────────────────────
    // SUCCESS ANIMATION
    // ─────────────────────────────────────────
    function successAnim() {
        if (typeof captureFlag === 'function') captureFlag(2);
        if (typeof API !== 'undefined') {
            API.validateFlag(GameState.teamId, 2, 'flag{correct_path}').catch(() => { });
        }

        spawnParticles('fire', 50);

        const hallC = document.getElementById('hallC');
        const transition = document.getElementById('cp2Transition');

        if (hallC) {
            hallC.style.boxShadow = '0 0 60px #ffcc00, 0 0 120px rgba(255,180,0,0.5)';
            hallC.style.borderColor = '#ffcc00';
            setTimeout(() => { hallC.style.transform = 'scale(8)'; hallC.style.opacity = '0'; hallC.style.transition = 'all 1.2s ease-in'; }, 400);
        }

        setTimeout(() => { if (transition) transition.style.opacity = '1'; }, 1200);

        setTimeout(() => {
            if (typeof loadCheckpoint === 'function') {
                loadCheckpoint(3);
            } else if (typeof CP3 !== 'undefined' && CP3.load) {
                CP3.load();
            } else {
                document.getElementById('gameScene').innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;gap:14px;">
            <div style="font-family:'Press Start 2P',monospace;font-size:18px;color:#ff4400;text-shadow:0 0 14px #cc2200;">CHECKPOINT 3</div>
            <div style="font-family:'VT323',monospace;font-size:22px;color:#ff8800;letter-spacing:3px;">DUNGEON DEPTHS — COMING NEXT</div>
          </div>`;
                if (GameState) { GameState.currentCP = 3; const el = document.getElementById('hudCheckpoint'); if (el) el.textContent = '3/4'; }
            }
        }, 3500);
    }

    return { load, _open, _close, _submit };

})();