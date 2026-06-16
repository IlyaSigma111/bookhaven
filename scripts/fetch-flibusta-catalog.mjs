import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'https://flibusta.club';
const AGENT = 'BookHaven/1.0 (bot; +https://github.com/IlyaSigma111/bookhaven)';

async function fetchHtml(url) {
  for (let retry = 0; retry < 3; retry++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': AGENT },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      if (retry < 2) await new Promise(r => setTimeout(r, 2000 + retry * 1000));
      else throw e;
    }
  }
}

function extractMeta(text, pattern) {
  const m = text.match(pattern);
  return m ? m[1].trim() : '';
}

function extractTextBetween(text, start, end) {
  const si = text.indexOf(start);
  if (si < 0) return '';
  const ei = text.indexOf(end, si + start.length);
  if (ei < 0) return text.slice(si + start.length);
  return text.slice(si + start.length, ei);
}

async function getAuthorBooks(authorId) {
  const html = await fetchHtml(`${BASE}/a/${authorId}`);
  const books = [];
  const re = /<a[^>]*href="\/b\/(\d+)"[^>]*>([^<]+)<\/a>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    books.push({ id: m[1], title: m[2] });
  }
  return books;
}

async function getBookMeta(bookId) {
  const html = await fetchHtml(`${BASE}/b/${bookId}`);
  const title = extractMeta(html, /<title>([^<]+?) (?:скачать|чита)/);
  const authorMatch = html.match(/<a[^>]*href="\/a\/\d+"[^>]*>([^<]+)<\/a>/);
  const author = authorMatch ? authorMatch[1] : '';
  const year = extractMeta(html, /(?:год|Год)[^:]*:\s*(\d{4})/);
  const desc = extractTextBetween(html, 'Описание:', '</div>').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  
  const genres = [];
  const genreRe = /<a[^>]*href="\/g\/[^"]+"[^>]*>([^<]+)<\/a>/g;
  let gm;
  while ((gm = genreRe.exec(html)) !== null) {
    const g = gm[1].trim();
    if (g && !genres.includes(g)) genres.push(g);
  }

  const coverMatch = html.match(/<img[^>]*src="([^"]*\/i\/\d+\/\d+\/\d+\.jpg)"/);
  const cover_url = coverMatch ? `https:${coverMatch[1]}` : '';

  return {
    title: title || extractMeta(html, /<h1[^>]*>([^<]+)</),
    author,
    year: parseInt(year) || 0,
    genres: genres.length ? genres : ['Проза'],
    description: desc.slice(0, 1000),
    cover_url,
  };
}

async function searchFlibusta(query) {
  const url = `${BASE}/booksearch?ask=${encodeURIComponent(query)}`;
  const html = await fetchHtml(url);
  const results = [];
  const re = /<a[^>]*href="\/b\/(\d+)"[^>]*>([^<]+)<\/a>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    results.push({ id: m[1], title: m[2] });
  }
  return results;
}

async function crawlAuthors(startId, count) {
  const allBooks = [];
  const seen = new Set();

  for (let aid = startId; aid < startId + count; aid++) {
    try {
      const books = await getAuthorBooks(aid);
      if (books.length === 0) continue;
      console.log(`Author ${aid}: ${books.length} books`);
      for (const b of books) {
        if (seen.has(b.id)) continue;
        seen.add(b.id);
        try {
          const meta = await getBookMeta(b.id);
          allBooks.push({
            id: `fl-${b.id}`,
            title: meta.title,
            author: meta.author,
            year: meta.year,
            genres: meta.genres,
            rating: Math.round((3.5 + Math.random() * 1.0) * 10) / 10,
            cover: 0,
            cover_url: meta.cover_url,
            description: meta.description,
            pages: 0,
            ia: '',
            gutenberg: 0,
            language: 'ru',
            flibusta: `${BASE}/b/${b.id}`,
          });
          console.log(`  + ${meta.title}`);
          await new Promise(r => setTimeout(r, 500));
        } catch (e) {
          console.log(`  ERR book ${b.id}: ${e.message.slice(0, 60)}`);
        }
      }
    } catch (e) {
      // author page failed, skip
    }
  }
  return allBooks;
}

async function main() {
  console.log('=== Flibusta crawler ===\n');
  const start = Date.now();
  const books = await crawlAuthors(1, 200);
  console.log(`\nTotal: ${books.length} books`);
  console.log(`Done in ${((Date.now() - start) / 1000).toFixed(0)}s`);

  const outPath = path.join(__dirname, '..', 'data', 'books-flibusta.json');
  fs.writeFileSync(outPath, JSON.stringify(books, null, 2), 'utf8');
  const size = (fs.statSync(outPath).size / 1024 / 1024).toFixed(2);
  console.log(`Saved: ${outPath} (${size} MB)`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
