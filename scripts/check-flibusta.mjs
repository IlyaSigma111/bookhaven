const AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  const res = await fetch('https://flibusta.club/new/', {
    headers: { 'User-Agent': AGENT },
    signal: AbortSignal.timeout(10000)
  });
  const html = await res.text();
  const pages = html.match(/page=(\d+)/g);
  const maxPage = pages ? Math.max(...pages.map(function(p) { return parseInt(p.replace('page=', '')); })) : 0;
  console.log('New books pages: ' + maxPage);
  
  const countMatch = html.match(/>\s*(\d+)\s*книг/);
  if (countMatch) console.log('Count: ' + countMatch[1]);
  
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  if (titleMatch) console.log('Title: ' + titleMatch[1]);
  
  const bookMatches = html.match(/<a[^>]*href="\/b\/(\d+)"[^>]*>/g);
  console.log('Books per page: ' + (bookMatches ? bookMatches.length : 0));
}

main().catch(function(e) { console.error(e.message); });
