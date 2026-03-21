/* ═══════════════════════════════════════════════
   LEADERBOARD — script.js
   Connection handling & UI updates
   Now loads configuration EXCLUSIVELY from .env
   ════════════════════════════════════════════════ */

const Leaderboard = (() => {

  const tableBody = document.getElementById('leaderboard-body');
  const wsStatus = document.getElementById('ws-status');
  const teamCount = document.getElementById('team-count');

  let ws = null;
  let reconnectInterval = 3000;
  let config = {}; // No hardcoded defaults

  async function loadConfig() {
    try {
      const res = await fetch('../.env');
      if (!res.ok) throw new Error('Could not load .env');
      
      const text = await res.text();
      text.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#')).forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) config[key.trim()] = value.trim().replace(/^['"]|['"]$/g, '');
      });
    } catch (e) {
      console.error('Critical Error: .env configuration missing or unreachable.', e);
    }
  }

  async function init() {
    await loadConfig();
    fetchLeaderboard();
    connectWS();
  }

  async function fetchLeaderboard() {
    try {
      if (!config.API_BASE_URL) throw new Error('API_BASE_URL not found');
      const response = await fetch(`${config.API_BASE_URL}/leaderboard`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      updateUI(data);
    } catch (err) {
      console.error('API Error:', err);
    }
  }

  function connectWS() {
    if (!config.WS_BASE_URL) {
      console.error('WS_BASE_URL not found');
      return;
    }
    ws = new WebSocket(`${config.WS_BASE_URL}/ws/leaderboard`);

    ws.onopen = () => {
      console.log('WS Connected');
      wsStatus.textContent = 'ONLINE';
      wsStatus.classList.remove('offline');
      wsStatus.classList.add('online');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        updateUI(data);
      } catch (err) {
        console.error('WS Data Error:', err);
      }
    };

    ws.onclose = () => {
      console.log('WS Disconnected. Retrying...');
      wsStatus.textContent = 'OFFLINE';
      wsStatus.classList.remove('online');
      wsStatus.classList.add('offline');
      setTimeout(connectWS, reconnectInterval);
    };

    ws.onerror = (err) => {
      console.error('WS Error:', err);
      ws.close();
    };
  }

  function updateUI(entries) {
    const maxFlags = 4;
    
    if (!entries || entries.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center">NO TEAMS REGISTERED</td></tr>';
      teamCount.textContent = '00';
      return;
    }

    teamCount.textContent = entries.length.toString().padStart(2, '0');

    const sorted = [...entries].sort((a, b) => {
      if (b.flags_captured !== a.flags_captured) return b.flags_captured - a.flags_captured;
      return a.total_time_seconds - b.total_time_seconds;
    });

    tableBody.innerHTML = sorted.map((entry, index) => `
      <tr>
        <td class="rank">#${(index + 1).toString().padStart(2, '0')}</td>
        <td class="name">${escapeHTML(entry.team_name)}</td>
        <td class="flags">${entry.flags_captured} / ${maxFlags}</td>
        <td class="time">${formatTime(entry.total_time_seconds)}</td>
      </tr>
    `).join('');
  }

  function formatTime(seconds) {
    if (!seconds) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  return { init };

})();

document.addEventListener('DOMContentLoaded', Leaderboard.init);
