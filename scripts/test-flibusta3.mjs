const AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
(async () => {
  const res = await fetch('https://flibusta.club/b/695778', {
    headers: { 'User-Agent': AGENT },
    signal: AbortSignal.timeout(10000)
  });
  const html = await res.text();
  const hrefs = new Set();
  const re = /href="([^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const h = m[1];
    if (h.length < 80) hrefs.add(h);
  }
  hrefs.forEach(function(h) { console.log(h); });
})();
