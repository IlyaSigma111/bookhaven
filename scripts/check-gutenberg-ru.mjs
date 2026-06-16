const AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  const res = await fetch('https://www.gutenberg.org/ebooks/languages/ru', {
    headers: { 'User-Agent': AGENT },
    signal: AbortSignal.timeout(10000)
  });
  const html = await res.text();
  console.log('Lang RU page length: ' + html.length + 'B');

  const countMatch = html.match(/about\s+([\d,]+)\s+eBooks/i);
  if (countMatch) console.log('Russian language books: ' + countMatch[1]);

  const bookMatches = html.match(/ebooks\/(\d+)\">/g);
  if (bookMatches) console.log('Books on this page: ' + bookMatches.length);

  const nextMatch = html.match(/href="[^"]*page=(\d+)[^"]*"[^>]*>next/i);
  console.log('Has next page: ' + !!nextMatch);

  // Extract a few book links
  const linkRe = /<a[^>]*href="\/ebooks\/(\d+)"[^>]*>([^<]+)<\/a>/g;
  let m;
  const books = [];
  while ((m = linkRe.exec(html)) !== null) {
    books.push({ id: m[1], title: m[2] });
  }
  console.log('Named book links: ' + books.length);
  books.slice(0, 10).forEach(function(b) { console.log('  ' + b.id + ': ' + b.title); });
}

main().catch(function(e) { console.error(e.message); });
