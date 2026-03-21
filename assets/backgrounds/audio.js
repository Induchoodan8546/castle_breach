/* ═══════════════════════════════════════════════
   CASTLE BREACH — audio.js
   Pure Web Audio API — zero external files
   All sounds synthesized in code
════════════════════════════════════════════════ */

const Audio = (() => {

  let ctx = null;
  let masterGain = null;
  let dungeonHumNode = null;
  let dungeonHumGain = null;
  let heartbeatInterval = null;
  let urgentInterval = null;
  let enabled = true;

  // ── Init audio context (must be after user gesture) ──
  function init() {
    if (ctx) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.7;
      masterGain.connect(ctx.destination);
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
      enabled = false;
    }
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  // ── Utility: create oscillator ─────────────
  function osc(type, freq, startTime, duration, gainVal = 0.3, dest = masterGain) {
    if (!ctx || !enabled) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, startTime);
    g.gain.setValueAtTime(gainVal, startTime);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    o.connect(g);
    g.connect(dest);
    o.start(startTime);
    o.stop(startTime + duration);
  }

  // Frequency ramp
  function oscRamp(type, freqStart, freqEnd, startTime, duration, gainVal = 0.3, dest = masterGain) {
    if (!ctx || !enabled) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freqStart, startTime);
    o.frequency.linearRampToValueAtTime(freqEnd, startTime + duration);
    g.gain.setValueAtTime(gainVal, startTime);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    o.connect(g);
    g.connect(dest);
    o.start(startTime);
    o.stop(startTime + duration);
  }

  // Noise burst (for rumbles, explosions)
  function noise(startTime, duration, gainVal = 0.2, filterFreq = 800, dest = masterGain) {
    if (!ctx || !enabled) return;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;

    const g = ctx.createGain();
    g.gain.setValueAtTime(gainVal, startTime);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    source.connect(filter);
    filter.connect(g);
    g.connect(dest);
    source.start(startTime);
    source.stop(startTime + duration);
  }

  // ═══════════════════════════════════════════
  //  START SCREEN SOUNDS
  // ═══════════════════════════════════════════

  // Typing blip — short high tick
  function typingBlip() {
    if (!ctx || !enabled) return;
    resume();
    const t = ctx.currentTime;
    osc('square', 440 + Math.random() * 120, t, 0.04, 0.15); // increased gain from 0.08 to 0.15
  }

  // Button click — low thud + confirm beep
  function buttonClick() {
    if (!ctx || !enabled) return;
    resume();
    const t = ctx.currentTime;
    // Low thud
    oscRamp('sine', 180, 60, t, 0.12, 0.4);
    // Confirm beep
    osc('square', 660, t + 0.05, 0.1, 0.15);
    osc('square', 880, t + 0.15, 0.12, 0.12);
  }

  // Registration success
  function registerSuccess() {
    if (!ctx || !enabled) return;
    resume();
    const t = ctx.currentTime;
    osc('square', 440, t, 0.1, 0.15);
    osc('square', 554, t + 0.1, 0.1, 0.15);
    osc('square', 659, t + 0.2, 0.3, 0.2);
  }

  // ═══════════════════════════════════════════
  //  AMBIENT DUNGEON HUM
  // ═══════════════════════════════════════════

  function startDungeonHum() {
    if (!ctx || !enabled || dungeonHumNode) return;
    resume();

    dungeonHumGain = ctx.createGain();
    dungeonHumGain.gain.value = 0;
    dungeonHumGain.connect(masterGain);

    // Low drone — 55Hz
    dungeonHumNode = ctx.createOscillator();
    dungeonHumNode.type = 'sine';
    dungeonHumNode.frequency.value = 55;

    // Add slight wobble via LFO
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.3;
    lfoGain.gain.value = 3;
    lfo.connect(lfoGain);
    lfoGain.connect(dungeonHumNode.frequency);
    lfo.start();

    // Second harmonic for richness
    const hum2 = ctx.createOscillator();
    hum2.type = 'triangle';
    hum2.frequency.value = 110;
    const hum2Gain = ctx.createGain();
    hum2Gain.gain.value = 0.3;
    hum2.connect(hum2Gain);
    hum2Gain.connect(dungeonHumGain);
    hum2.start();

    dungeonHumNode.connect(dungeonHumGain);
    dungeonHumNode.start();

    // Fade in
    dungeonHumGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2);
  }

  function stopDungeonHum() {
    if (!dungeonHumGain) return;
    dungeonHumGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    setTimeout(() => {
      try { dungeonHumNode.stop(); } catch(e) {}
      dungeonHumNode = null;
      dungeonHumGain = null;
    }, 2000);
  }

  // ═══════════════════════════════════════════
  //  GAMEPLAY SOUNDS
  // ═══════════════════════════════════════════

  // Object click/tap — soft wooden tap
  function objectClick() {
    if (!ctx || !enabled) return;
    resume();
    const t = ctx.currentTime;
    oscRamp('sine', 300, 120, t, 0.15, 0.25);
    noise(t, 0.08, 0.1, 400);
  }

  // Wrong answer buzzer — descending harsh tone
  function wrongAnswer() {
    if (!ctx || !enabled) return;
    resume();
    const t = ctx.currentTime;
    oscRamp('sawtooth', 320, 80, t, 0.4, 0.35);
    oscRamp('square',   160, 60, t + 0.05, 0.4, 0.2);
    noise(t, 0.15, 0.15, 300);
  }

  // Correct flag capture — 3-note victory fanfare
  function flagCaptured() {
    if (!ctx || !enabled) return;
    resume();
    const t = ctx.currentTime;
    // Three ascending notes
    osc('square', 523, t,        0.18, 0.3);  // C5
    osc('square', 659, t + 0.18, 0.18, 0.3);  // E5
    osc('square', 784, t + 0.36, 0.35, 0.35); // G5
    // Harmonics underneath
    osc('sine',   261, t,        0.18, 0.15);
    osc('sine',   329, t + 0.18, 0.18, 0.15);
    osc('sine',   392, t + 0.36, 0.35, 0.2);
  }

  // Gate creak — low grinding noise + metallic ping
  function gateCreak() {
    if (!ctx || !enabled) return;
    resume();
    const t = ctx.currentTime;
    // Creak — slow freq sweep with noise
    oscRamp('sawtooth', 80, 40, t, 1.2, 0.2);
    noise(t, 1.2, 0.25, 250);
    // Metal ping at end
    osc('sine', 1200, t + 1.0, 0.4, 0.15);
    osc('sine', 800,  t + 1.1, 0.4, 0.1);
  }

  // Dragon roar — on wrong answer in CP3
  function dragonRoar() {
    if (!ctx || !enabled) return;
    resume();
    const t = ctx.currentTime;
    // Deep growl
    oscRamp('sawtooth', 120, 60,  t,        0.6, 0.4);
    oscRamp('sawtooth', 200, 80,  t + 0.1,  0.5, 0.3);
    oscRamp('square',   60,  30,  t,        0.8, 0.25);
    noise(t, 0.8, 0.35, 600);
    // High screech
    oscRamp('sawtooth', 800, 200, t + 0.3, 0.5, 0.2);
  }

  // Dragon fire breath (thud + whoosh)
  function fireBreath() {
    if (!ctx || !enabled) return;
    resume();
    const t = ctx.currentTime;
    // Low thud
    oscRamp('sine', 160, 40, t, 0.25, 0.6);
    // Fire whoosh
    noise(t, 0.8, 0.4, 1200);
    noise(t + 0.1, 0.6, 0.2, 600);
  }

  // Dragon explosion boom — CP3 defeated
  function dragonExplosion() {
    if (!ctx || !enabled) return;
    resume();
    const t = ctx.currentTime;
    // Big low boom
    oscRamp('sine', 100, 20, t, 0.8, 0.6);
    noise(t, 1.2, 0.6, 1200);
    noise(t + 0.1, 0.8, 0.4, 400);
    // Fire crackle
    noise(t + 0.3, 1.5, 0.3, 2000);
    // Shockwave ping
    oscRamp('sine', 600, 50, t, 0.5, 0.3);
  }

  // Portal whoosh — scene transition
  function portalWhoosh() {
    if (!ctx || !enabled) return;
    resume();
    const t = ctx.currentTime;
    oscRamp('sine',     200,  800, t,        0.5, 0.25);
    oscRamp('triangle', 150,  600, t + 0.05, 0.5, 0.2);
    oscRamp('sine',     800,  200, t + 0.4,  0.5, 0.2);
    noise(t, 0.6, 0.15, 1000);
    noise(t + 0.3, 0.4, 0.1, 2000);
  }

  // ═══════════════════════════════════════════
  //  TIMER SOUNDS
  // ═══════════════════════════════════════════

  // Heartbeat — slow tick under 5 minutes
  function startHeartbeat() {
    if (!ctx || !enabled || heartbeatInterval) return;
    resume();

    function beat() {
      if (!ctx || !enabled) return;
      const t = ctx.currentTime;
      // Lub
      oscRamp('sine', 80, 40, t,        0.12, 0.35);
      noise(t, 0.1, 0.2, 200);
      // Dub
      oscRamp('sine', 70, 35, t + 0.15, 0.1,  0.3);
      noise(t + 0.15, 0.08, 0.15, 180);
    }

    beat();
    heartbeatInterval = setInterval(beat, 1400);
  }

  function stopHeartbeat() {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }

  // Urgent beeping — fast beeps under 1 minute
  function startUrgentBeep() {
    if (!ctx || !enabled || urgentInterval) return;
    resume();
    stopHeartbeat(); // Replace heartbeat

    function beep() {
      if (!ctx || !enabled) return;
      const t = ctx.currentTime;
      osc('square', 880, t,       0.08, 0.3);
      osc('square', 880, t + 0.1, 0.08, 0.25);
    }

    beep();
    urgentInterval = setInterval(beep, 500);
  }

  function stopUrgentBeep() {
    clearInterval(urgentInterval);
    urgentInterval = null;
  }

  // ═══════════════════════════════════════════
  //  ENDGAME SOUNDS
  // ═══════════════════════════════════════════

  // Game over — descending sad tune
  function gameOver() {
    if (!ctx || !enabled) return;
    resume();
    stopHeartbeat();
    stopUrgentBeep();

    const t = ctx.currentTime;
    // Descending melody
    const notes = [523, 494, 466, 440, 392, 349, 330, 294];
    notes.forEach((freq, i) => {
      osc('square', freq, t + i * 0.18, 0.22, 0.25);
      osc('sine',   freq / 2, t + i * 0.18, 0.22, 0.1);
    });
    // Final low boom
    oscRamp('sine', 150, 40, t + notes.length * 0.18, 0.8, 0.35);
    noise(t + notes.length * 0.18, 0.5, 0.2, 300);
  }

  // CP4 lock click — each challenge solved
  function lockClick() {
    if (!ctx || !enabled) return;
    resume();
    const t = ctx.currentTime;
    // Mechanical click
    noise(t, 0.06, 0.3, 1500);
    osc('sine', 800, t, 0.08, 0.2);
    osc('sine', 1200, t + 0.04, 0.1, 0.15);
    // Satisfying unlock tone
    osc('square', 440, t + 0.08, 0.12, 0.2);
    osc('square', 554, t + 0.18, 0.14, 0.2);
  }

  // Cell door creak — when all 5 CP4 challenges solved
  function cellDoorCreak() {
    if (!ctx || !enabled) return;
    resume();
    const t = ctx.currentTime;
    // Heavy door groan
    oscRamp('sawtooth', 60,  30,  t,        1.5, 0.3);
    oscRamp('sawtooth', 90,  45,  t + 0.2,  1.2, 0.2);
    noise(t, 1.5, 0.3, 300);
    noise(t + 0.5, 1.0, 0.2, 500);
    // Chain rattle
    noise(t + 0.8, 0.4, 0.25, 2000);
    noise(t + 1.0, 0.3, 0.2, 1800);
    // Door thuds open
    oscRamp('sine', 120, 30, t + 1.4, 0.4, 0.4);
    noise(t + 1.4, 0.3, 0.4, 400);
  }

  // Princess rescued — full 8-bit fanfare
  function princessRescued() {
    if (!ctx || !enabled) return;
    resume();
    stopHeartbeat();
    stopUrgentBeep();

    const t = ctx.currentTime;

    // ── Fanfare melody (Mario-esque 8-bit) ──
    const melody = [
      // freq, start offset, duration
      [523, 0.00, 0.12],  // C5
      [523, 0.14, 0.12],  // C5
      [523, 0.28, 0.12],  // C5
      [523, 0.42, 0.25],  // C5 hold
      [415, 0.44, 0.12],  // Ab4
      [523, 0.58, 0.25],  // C5
      [659, 0.85, 0.5],   // E5 hold
      // ─ second phrase ─
      [784, 1.40, 0.12],  // G5
      [659, 1.55, 0.12],  // E5
      [523, 1.70, 0.12],  // C5
      [659, 1.85, 0.12],  // E5
      [784, 2.00, 0.6],   // G5 long
      // ─ third phrase ─
      [1047,2.70, 0.12],  // C6
      [988, 2.84, 0.12],  // B5
      [932, 2.98, 0.12],  // Bb5
      [880, 3.12, 0.12],  // A5
      [932, 3.28, 0.18],  // Bb5
      [0,   3.48, 0.1],   // rest
      [622, 3.58, 0.18],  // Eb5
      [784, 3.78, 0.18],  // G5
      [831, 3.98, 0.18],  // Ab5
      [698, 4.18, 0.18],  // F5
      [784, 4.38, 0.18],  // G5
      // ─ finale ─
      [0,   4.60, 0.1],   // rest
      [523, 4.70, 0.12],  // C5
      [523, 4.84, 0.12],  // C5
      [784, 4.98, 0.5],   // G5
      [784, 5.50, 0.5],   // G5
      [740, 6.02, 0.5],   // F#5
      [698, 6.54, 0.5],   // F5
      [659, 7.06, 1.0],   // E5 — end
    ];

    melody.forEach(([freq, offset, dur]) => {
      if (freq === 0) return;
      osc('square',   freq,     t + offset, dur, 0.22);
      osc('triangle', freq / 2, t + offset, dur, 0.1);
    });

    // Bass line underneath
    const bass = [
      [130, 0.00, 0.5],
      [130, 0.50, 0.5],
      [165, 1.00, 0.5],
      [174, 1.50, 0.5],
      [196, 2.00, 1.0],
      [196, 3.00, 0.5],
      [185, 3.50, 0.5],
      [174, 4.00, 0.5],
      [165, 4.50, 0.5],
      [130, 5.00, 2.0],
    ];
    bass.forEach(([freq, offset, dur]) => {
      osc('sine', freq, t + offset, dur, 0.15);
    });

    // Sparkle high notes
    const sparkle = [261, 329, 392, 523, 659, 784, 1047];
    sparkle.forEach((freq, i) => {
      osc('sine', freq, t + 0.5 + i * 0.08, 0.3, 0.08);
    });
  }

  // ═══════════════════════════════════════════
  //  PUBLIC API
  // ═══════════════════════════════════════════

  // Central play function — call this from anywhere
  function play(soundName) {
    if (!enabled) return;
    init();
    resume();

    switch (soundName) {
      // Start screen
      case 'typingBlip':       typingBlip();       break;
      case 'buttonClick':      buttonClick();      break;
      case 'registerSuccess':  registerSuccess();  break;

      // Ambient
      case 'startDungeonHum':  startDungeonHum();  break;
      case 'stopDungeonHum':   stopDungeonHum();   break;

      // Gameplay
      case 'objectClick':      objectClick();      break;
      case 'wrongAnswer':      wrongAnswer();      break;
      case 'flagCaptured':     flagCaptured();     break;
      case 'gateCreak':        gateCreak();        break;
      case 'dragonRoar':       dragonRoar();       break;
      case 'dragonExplosion':  dragonExplosion();  break;
      case 'portalWhoosh':     portalWhoosh();     break;
      case 'fireBreath':       fireBreath();       break;

      // Timer
      case 'startHeartbeat':   startHeartbeat();   break;
      case 'stopHeartbeat':    stopHeartbeat();    break;
      case 'startUrgentBeep':  startUrgentBeep();  break;
      case 'stopUrgentBeep':   stopUrgentBeep();   break;

      // Endgame
      case 'gameOver':         gameOver();         break;
      case 'lockClick':        lockClick();        break;
      case 'cellDoorCreak':    cellDoorCreak();    break;
      case 'princessRescued':  princessRescued();  break;

      default:
        console.warn(`Audio: unknown sound "${soundName}"`);
    }
  }

  // Toggle mute
  function mute()   { if (masterGain) masterGain.gain.value = 0; enabled = false; }
  function unmute() { if (masterGain) masterGain.gain.value = 0.7; enabled = true; }
  function toggle() { enabled ? mute() : unmute(); return enabled; }

  return { play, init, mute, unmute, toggle };

})();

/* ═══════════════════════════════════════════════
   AUTO-WIRE — hooks Audio into existing game code
   without modifying any existing files
════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  // ── Init on first user interaction ──────────
  document.addEventListener('click', () => Audio.init(), { once: true });
  document.addEventListener('keydown', () => Audio.init(), { once: true });

  // ── Start screen wiring ──────────────────────
  const nameInput = document.getElementById('nameInput');
  if (nameInput) {
    nameInput.addEventListener('input', () => Audio.play('typingBlip'));
  }

  const startBtn = document.getElementById('startBtn');
  if (startBtn) {
    startBtn.addEventListener('click', () => Audio.play('buttonClick'));
  }

  // ── Mute button (auto-added to HUD) ─────────
  const hud = document.querySelector('.hud');
  if (hud) {
    const muteBtn = document.createElement('div');
    muteBtn.className = 'hud-item';
    muteBtn.innerHTML = `
      <span class="hud-label">AUDIO</span>
      <button class="hud-mute-btn" id="muteBtn" title="Toggle sound">🔊</button>
    `;
    hud.appendChild(muteBtn);

    document.getElementById('muteBtn').addEventListener('click', () => {
      const isOn = Audio.toggle();
      document.getElementById('muteBtn').textContent = isOn ? '🔊' : '🔇';
    });
  }

  // ── Timer wiring — patch updateTimerDisplay ──
  const origUpdateTimer = window.updateTimerDisplay;
  if (typeof origUpdateTimer === 'function') {
    window.updateTimerDisplay = function () {
      origUpdateTimer();
      const secs = GameState.timerSeconds;
      if (secs === 300) Audio.play('startHeartbeat');  // 5 min mark
      if (secs === 60)  Audio.play('startUrgentBeep'); // 1 min mark
    };
  }

  // ── Game over / win wiring ───────────────────
  const origGameOver = window.gameOver;
  if (typeof origGameOver === 'function') {
    window.gameOver = function () {
      Audio.play('stopHeartbeat');
      Audio.play('stopUrgentBeep');
      Audio.play('stopDungeonHum');
      Audio.play('gameOver');
      origGameOver();
    };
  }

  const origGameWin = window.gameWin;
  if (typeof origGameWin === 'function') {
    window.gameWin = function () {
      Audio.play('stopHeartbeat');
      Audio.play('stopUrgentBeep');
      Audio.play('stopDungeonHum');
      origGameWin();
    };
  }

  // ── showSuccess — register sound ───────────
  const origShowSuccess = window.showSuccess;
  if (typeof origShowSuccess === 'function') {
    window.showSuccess = function (name) {
      Audio.play('registerSuccess');
      origShowSuccess(name);
    };
  }

  // ── beginGame — start dungeon hum ───────────
  const origBeginGame = window.beginGame;
  if (typeof origBeginGame === 'function') {
    window.beginGame = function (playerName, teamId) {
      origBeginGame(playerName, teamId);
      setTimeout(() => Audio.play('startDungeonHum'), 500);
    };
  }

});

/* ═══════════════════════════════════════════════
   HOW TO CALL FROM CHECKPOINT FILES:

   CP1 — object click:      Audio.play('objectClick')
   CP1 — wrong flag:        Audio.play('wrongAnswer')
   CP1 — flag captured:     Audio.play('flagCaptured')
   CP1 — gate opens:        Audio.play('gateCreak')
   CP1/2/3 — scene change:  Audio.play('portalWhoosh')

   CP3 — wrong answer:      Audio.play('dragonRoar')
   CP3 — dragon defeated:   Audio.play('dragonExplosion')
                            Audio.play('flagCaptured')

   CP4 — lock solved:       Audio.play('lockClick')
                            Audio.play('flagCaptured')
   CP4 — cell door:         Audio.play('cellDoorCreak')
   CP4 — victory:           Audio.play('princessRescued')
════════════════════════════════════════════════ */