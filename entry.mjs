const repository = document.querySelector('main').dataset.repository, status = document.querySelector('#status');
const button = document.querySelector('#open'), retry = document.querySelector('#retry');
async function connect() {
  retry.hidden = true; button.hidden = true; status.textContent = '正在查找你的 Pi…';
  const stamp = Date.now(); let connection;
  for (const endpoint of [`https://api.github.com/repos/${repository}/contents/connection.json?ref=connection&t=${stamp}`, `https://raw.githubusercontent.com/${repository}/connection/connection.json?t=${stamp}`]) {
    try { const r = await fetch(endpoint, { cache: 'no-store', headers: { Accept: 'application/vnd.github.raw+json' }, signal: AbortSignal.timeout(8000), credentials: 'omit' }); if (!r.ok) throw new Error(); connection = await r.json(); break; } catch {}
  }
  try {
    const url = new URL(connection?.url);
    if (url.protocol !== 'https:' || url.username || url.password || url.hash || url.search || url.pathname !== '/' || !(/^[a-z0-9-]+\.trycloudflare\.com$/.test(url.hostname) || url.hostname === 'app.formulation.com')) throw new Error();
    button.href = url.origin + '/login'; button.hidden = false; status.textContent = '入口已就绪，即将进入安全登录页。';
    if (!new URLSearchParams(location.search).has('stay')) location.replace(button.href);
  } catch { status.textContent = '暂时无法取得连接地址，请稍后重试。'; retry.hidden = false; }
}
retry.onclick = connect; connect();
