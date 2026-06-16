const AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  const res = await fetch('https://www.gutenberg.org/ebooks/search/?query=russian&submit_search=Go', {
    headers: { 'User-Agent': AGENT },
    signal: AbortSignal.timeout(10000)
  });
  const html = await res.text();
  const countMatch = html.match(/of\s+([\d,]+)/);
  console.log('Count:', countMatch ? countMatch[1] : '?');
  
  const linkRe = /ebooks\/(\d+)">([^<]+)</g;
  let m;
  const books = [];
  while ((m = linkRe.exec(html)) !== null) {
    books.push({ id: m[1], title: m[2] });
  }
  console.log('Books on page:', books.length);
  books.slice(0, 10).forEach(function(b) {
    console.log('  ' + b.id + ': ' + b.title);
  });
}

main().catch(function(e) { console.error(e.message); });
