/* ═══════════════════════════════════════════════
   CASTLE BREACH — api.js
   All communication with the backend.
   Swap BASE_URL to your friend's deployed URL.
════════════════════════════════════════════════ */

const API = (() => {

  // ── Change this when friend's server is live ──
  const BASE_URL = 'http://localhost:3000';

  // POST /api/team/register  →  { teamId, token }
  async function registerTeam(teamName) {
    const res = await fetch(`${BASE_URL}/api/team/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamName }),
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  }

  // POST /api/validate-flag  →  { success, message }
  async function validateFlag(teamId, checkpoint, flag) {
    const res = await fetch(`${BASE_URL}/api/validate-flag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId, checkpoint, flag }),
    });
    if (!res.ok) throw new Error('Validation failed');
    return res.json();
  }

  // POST /api/score/update  →  { updated }
  async function updateScore(teamId, checkpoint, time) {
    const res = await fetch(`${BASE_URL}/api/score/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId, checkpoint, time }),
    });
    if (!res.ok) throw new Error('Score update failed');
    return res.json();
  }

  // GET /api/leaderboard  →  [{ team, flags, time }]
  async function getLeaderboard() {
    const res = await fetch(`${BASE_URL}/api/leaderboard`);
    if (!res.ok) throw new Error('Leaderboard fetch failed');
    return res.json();
  }

  return { registerTeam, validateFlag, updateScore, getLeaderboard };

})();