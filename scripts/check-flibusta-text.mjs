const A = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  // Try various URL patterns for raw text
  const urls = [
    'https://flibusta.club/b/695778/read?page=1',
    'https://flibusta.club/b/695778/read?start=0',
    'https://flibusta.club/b/695778/read?format=txt',
    'https://flibusta.club/b/695778/txt',
    'https://flibusta.club/b/695778/read/1',
    'https://flibusta.club/b/695778/read?text=1',
  ];
  
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': A },
        signal: AbortSignal.timeout(10000)
      });
      const type = res.headers.get('content-type') || '';
      const text = (await res.text()).slice(0, 200);
      console.log(url.replace('https://flibusta.club', ''), '=>', type.slice(0, 40), text.length + 'B', text.slice(0, 80));
    } catch(e) {
      console.log(url.replace('https://flibusta.club', ''), '=> ERROR:', e.message.slice(0, 60));
    }
  }
}

main().catch(function(e) { console.error(e.message); });
