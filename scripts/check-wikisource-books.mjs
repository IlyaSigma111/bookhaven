const AGENT = 'BookHaven/1.0';

async function searchWikisource(query) {
  const url = `https://ru.wikisource.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=5&format=json`;
  const res = await fetch(url, {
    headers: { 'User-Agent': AGENT },
    signal: AbortSignal.timeout(10000)
  });
  const data = await res.json();
  return data.query?.search || [];
}

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function main() {
  const books = JSON.parse(require('fs').readFileSync('data/books.json', 'utf8'));
  
  // Check first 20 books for Wikisource matches
  for (let i = 0; i < Math.min(20, books.length); i++) {
    const b = books[i];
    const queries = [
      b.title,
      (b.author || '').split(/[\s,]+/).slice(0,2).join(' ') + ' ' + b.title,
    ];
    let found = false;
    for (const q of queries) {
      if (!q || q.length < 3) continue;
      const results = await searchWikisource(q);
      if (results.length > 0) {
        const top = results[0];
        // Check if it matches by title similarity
        const sim = titleSimilarity(b.title, top.title);
        if (sim > 0.3) {
          console.log('OK:', b.title.slice(0, 40), '->', top.title, '(' + top.pageid + ')', 'sim:', sim.toFixed(2));
          found = true;
          break;
        } else {
          console.log('LOW:', b.title.slice(0, 40), '->', top.title, '(' + top.pageid + ')', 'sim:', sim.toFixed(2));
        }
      }
    }
    if (!found) {
      console.log('NOT:', b.title.slice(0, 40));
    }
  }
}

function titleSimilarity(a, b) {
  const as = a.toLowerCase().replace(/[^а-яё\s]/g, '').trim();
  const bs = b.toLowerCase().replace(/[^а-яё\s]/g, '').trim();
  if (!as || !bs) return 0;
  const aWords = as.split(/\s+/).filter(Boolean);
  const bWords = bs.split(/\s+/).filter(Boolean);
  let common = 0;
  for (const w of aWords) {
    if (w.length < 3) continue;
    if (bWords.includes(w)) common++;
  }
  return common / Math.min(aWords.length, bWords.length);
}

main().catch(e => console.error(e));
