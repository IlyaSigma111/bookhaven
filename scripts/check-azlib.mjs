const A = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  // Our first few Russian classic books
  const books = require('./data/books.json');
  const classics = books.filter(b => 
    b.title && /[а-я]/i.test(b.title) && 
    b.genres && b.genres.some(g => /классик/i.test(g))
  ).slice(0, 10);
  
  // Check az.lib.ru for each
  for (const b of classics) {
    // Construct potential URL: az.lib.ru/<letter>/<author>/text_XXXX.shtml
    const firstLetter = (b.author || '')[0].toLowerCase();
    const authorPart = (b.author || '').toLowerCase().split(/[\s,]+/)[0];
    const searchUrl = `https://az.lib.ru/${firstLetter}/${authorPart}/`;
    try {
      const r = await fetch(searchUrl, {
        headers: { 'User-Agent': A },
        signal: AbortSignal.timeout(8000)
      });
      if (r.ok) {
        const html = await r.text();
        const links = html.match(/href="([^"]*text_\d+[^"]*)"/g);
        console.log(b.title.slice(0, 40), '->', searchUrl, links ? links.length + ' links' : 'no links');
      } else {
        console.log(b.title.slice(0, 40), '->', searchUrl, r.status);
      }
    } catch(e) {
      console.log(b.title.slice(0, 40), '->', searchUrl, 'ERR');
    }
  }
}

main().catch(e => console.error(e.message));
