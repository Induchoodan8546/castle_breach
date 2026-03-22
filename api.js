/* ═══════════════════════════════════════════════
   CASTLE BREACH — api.js
   All communication with the backend.
   Now loads EXCLUSIVELY from .env at runtime.
════════════════════════════════════════════════ */

const API = (() => {

  let config = {}; // No hardcoded defaults

  const loadConfig = async () => {
    try {
      const res = await fetch('.env');
      if (!res.ok) throw new Error('Could not load .env');
      
      const text = await res.text();
      text.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#')).forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) config[key.trim()] = value.trim().replace(/^['"]|['"]$/g, '');
      });
      window.CONFIG = config;
    } catch (e) {
      console.error('Critical Error: .env configuration missing or unreachable.', e);
    }
  };

  const configPromise = loadConfig();

  async function getBaseUrl() {
    await configPromise;
    if (!config.API_BASE_URL) throw new Error('API_BASE_URL not found in .env');
    return config.API_BASE_URL;
  }

  async function registerTeam(teamName) {
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: teamName }),
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  }

  async function SubmitScore(checkpoint, time) {
    const baseUrl = await getBaseUrl();
    const token = localStorage.getItem("Token");

    const res = await fetch(`${baseUrl}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: token,
        time_taken: time,
        flag: checkpoint
      }),
    });

    if (!res.ok) throw new Error('Score update failed');
    return res.json();
  }

  return { registerTeam, SubmitScore, configPromise };

})();