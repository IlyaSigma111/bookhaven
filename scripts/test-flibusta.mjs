const AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  const res = await fetch('https://flibusta.club/a/100', {
    headers: { 'User-Agent': AGENT },
    signal: AbortSignal.timeout(10000)
  });
  const html = await res.text();
  console.log('Tolstoy page: ' + html.length + 'B');

  const bookRegex = /<a[^>]*href="\/b\/(\d+)"[^>]*>([^<]+)<\/a>/g;
  let m;
  const books = [];
  while ((m = bookRegex.exec(html)) !== null) {
    books.push({ id: m[1], title: m[2] });
  }
  console.log('Found ' + books.length + ' book links');
  books.slice(0, 15).forEach(b => console.log('  /b/' + b.id + ' -> ' + b.title));

  const dlRegex = /href="[^"]*(?:download|txt|fb2|epub)[^"]*"/gi;
  const dlinks = html.match(dlRegex) || [];
  console.log('Download links found: ' + dlinks.length);
  dlinks.slice(0, 5).forEach(l => console.log('  ' + l));
}

main().catch(e => console.error('ERROR: ' + e.message));
