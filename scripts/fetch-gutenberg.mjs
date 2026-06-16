import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GENRE_MAP = {
  'Science fiction': ['Научная фантастика', 'Фантастика'],
  'Fantasy': ['Фэнтези', 'Фантастика'],
  'Horror': ['Ужасы', 'Мистика'],
  'Gothic': ['Готика', 'Ужасы'],
  'Detective and mystery': ['Детектив', 'Мистика'],
  'Mystery': ['Детектив', 'Мистика'],
  'Detective': ['Детектив', 'Мистика'],
  'Adventure': ['Приключения', 'Классика'],
  'Psychological': ['Психология', 'Реализм'],
  'Historical': ['История', 'Классика'],
  'Love stories': ['Романтика', 'Реализм'],
  'Romance': ['Романтика', 'Реализм'],
  'Humorous': ['Сатира', 'Комедия'],
  'Poetry': ['Поэзия', 'Классика'],
  'Domestic': ['Реализм', 'Драма'],
  'Political': ['Политика', 'Антиутопия'],
  'Dystopia': ['Антиутопия', 'Научная фантастика'],
  'Philosophy': ['Философия', 'Нон-фикшн'],
  'Children': ['Детская', 'Классика'],
  'Fairy tales': ['Фольклор', 'Детская'],
  'Folklore': ['Фольклор', 'Классика'],
  'Epic': ['Эпос', 'Классика'],
  'War': ['История', 'Реализм'],
  'Sea stories': ['Приключения', 'Реализм'],
  'Western': ['Приключения'],
  'Christmas': ['Рождественская', 'Классика'],
  'Ghost': ['Мистика', 'Ужасы'],
  'Short stories': ['Рассказы', 'Классика'],
  'Drama': ['Драма', 'Классика'],
  'Comedy': ['Комедия', 'Классика'],
  'Biography': ['Нон-фикшн', 'История'],
  'History': ['История', 'Нон-фикшн'],
  'Religion': ['Духовное', 'Нон-фикшн'],
  'Psychology': ['Психология', 'Нон-фикшн'],
  'Science': ['Нон-фикшн'],
  'Ancient': ['Античность', 'История'],
  'Stoics': ['Стоицизм', 'Философия'],
  'Russian': ['Русская классика', 'Классика'],
  'Novels': ['Роман', 'Классика'],
  'Thriller': ['Детектив', 'Ужасы'],
  'Satire': ['Сатира', 'Классика'],
  'Fables': ['Фольклор', 'Детская'],
  'Mythology': ['Фольклор', 'Античность'],
  'Essays': ['Нон-фикшн', 'Философия'],
  'Travel': ['Приключения', 'Нон-фикшн'],
  'Music': ['Нон-фикшн'],
  'Art': ['Нон-фикшн'],
  'Bildungsromans': ['Реализм', 'Роман'],
  'Occult': ['Мистика'],
  'Supernatural': ['Мистика', 'Ужасы'],
  'Comic': ['Сатира', 'Комедия'],
  'Tragedy': ['Драма', 'Классика'],
  'Naturalism': ['Реализм', 'Классика'],
  'Realism': ['Реализм', 'Классика'],
  'Philosophy and ethics': ['Философия', 'Стоицизм'],
  'Romanticism': ['Романтика', 'Реализм'],
  'Love': ['Романтика', 'Реализм'],
  'Fiction': ['Классика'],
};

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const to = setTimeout(() => { req.destroy(); reject(new Error('timeout')); }, 30000);
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/xml,text/html' }, timeout: 25000 }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { clearTimeout(to); resolve(data); });
    });
    req.on('error', e => { clearTimeout(to); reject(e); });
  });
}

function extractBookIds(xml) {
  const ids = [];
  const idRegex = /<id>https:\/\/www\.gutenberg\.org\/ebooks\/(\d+)\.opds<\/id>/g;
  let m;
  while ((m = idRegex.exec(xml)) !== null) {
    ids.push(parseInt(m[1]));
  }
  return [...new Set(ids)];
}

function parseBookPage(xml, id) {
  let title = xml.match(/<title>([^<]+)<\/title>/)?.[1] || '';
  title = title.replace(/\s+by\s+[^<]+$/i, '').trim();
  const authorRaw = xml.match(/Author:\s*([^<]+?)\s*</)?.[1]?.trim() || '';
  const authorParts = authorRaw.split(',').map(s => s.trim()).filter(s => !/^\d/.test(s));
  const contentAuthor = authorParts.length >= 2 ? `${authorParts[1]} ${authorParts[0]}` : authorParts[0] || '';
  const feedAuthor = xml.match(/<author>\s*<name>([^<]+)<\/name>/)?.[1] || '';
  const author = contentAuthor || feedAuthor;
  const summary = xml.match(/Summary:\s*([^<]+)/)?.[1]?.trim() || '';
  const downloads = parseInt(xml.match(/Downloads:\s*(\d+)/)?.[1] || '0');
  const language = xml.match(/Language:\s*(\w+)/)?.[1] || 'en';
  const year = parseInt(xml.match(/Published:\s*\w+\s+\d+,\s+(\d{4})/)?.[1] || '0');

  const subjects = [];
  const subjRegex = /<category scheme="http:\/\/purl\.org\/dc\/terms\/LCSH" term="([^"]+)"/g;
  let m;
  while ((m = subjRegex.exec(xml)) !== null) {
    subjects.push(m[1]);
  }

  const hasEpub = xml.includes('.epub.noimages') || xml.includes('.epub.images');
  const hasTxt = xml.includes('.txt.utf-8') || xml.includes('.txt)');

  if (!title || !author) return null;

  const genres = classifyBook(subjects);
  const top = topGenres(genres);
  if (top.length === 0) return null;

  const rating = Math.min(5, Math.max(1, 1 + (downloads / 50000) * 4));
  const ratingRounded = Math.round(rating * 10) / 10;

  const coverMatch = xml.match(/<link type="image\/jpeg" rel="http:\/\/opds-spec\.org\/image" href="([^"]+)"/);
  const coverUrl = coverMatch?.[1] || '';

  return {
    id: `gut-${id}`,
    title,
    author,
    year,
    genres: top,
    rating: ratingRounded,
    description: summary.substring(0, 500),
    gutenberg: id,
    language,
    pages: 0,
    downloads,
    cover_url: coverUrl,
  };
}

function classifyBook(subjects) {
  const genres = new Set();
  const lowerSubjects = subjects.map(s => s.toLowerCase());
  for (const [keyword, mappedGenres] of Object.entries(GENRE_MAP)) {
    const kw = keyword.toLowerCase();
    if (lowerSubjects.some(s => s.includes(kw))) {
      mappedGenres.forEach(g => genres.add(g));
    }
  }
  if (genres.size === 0) {
    const isFiction = lowerSubjects.some(s =>
      s.includes('fiction') || s.includes('story') || s.includes('novel') || s.includes('drama') || s.includes('poem')
    );
    if (isFiction) genres.add('Классика');
    else if (lowerSubjects.some(s => s.includes('history') || s.includes('biography') || s.includes('science') || s.includes('philosophy'))) {
      genres.add('Нон-фикшн');
    }
  }
  return [...genres];
}

function topGenres(genres, max = 3) {
  const priority = ['Научная фантастика', 'Фэнтези', 'Ужасы', 'Детектив', 'Приключения',
    'Фантастика', 'Мистика', 'Готика', 'Антиутопия', 'Романтика',
    'Классика', 'История', 'Философия', 'Поэзия', 'Драма', 'Комедия',
    'Сатира', 'Реализм', 'Психология', 'Политика', 'Нон-фикшн',
    'Русская классика', 'Детская', 'Фольклор', 'Эпос', 'Античность',
    'Стоицизм', 'Экзистенциализм', 'Духовное', 'Рождественская', 'Рассказы', 'Роман'];
  const sorted = [...genres].sort((a, b) => {
    const ai = priority.indexOf(a);
    const bi = priority.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
  return sorted.slice(0, max);
}

async function fetchCatalogPages(totalPages) {
  console.log(`Fetching ${totalPages} catalog pages...`);
  const allIds = new Set();

  for (let page = 0; page < totalPages; page++) {
    const startIndex = page * 25 + 1;
    try {
      const xml = await fetchText(`https://www.gutenberg.org/ebooks/search.opds/?start_index=${startIndex}`);
      const ids = extractBookIds(xml);
      ids.forEach(id => allIds.add(id));
      if ((page + 1) % 20 === 0) {
        console.log(`  Page ${page + 1}/${totalPages}: ${allIds.size} unique IDs found`);
      }
    } catch (err) {
      console.error(`  Page ${page + 1} error: ${err.message}`);
    }
  }

  console.log(`Found ${allIds.size} unique book IDs`);
  return [...allIds];
}

async function fetchBookDetails(ids, concurrency = 15) {
  console.log(`Fetching details for ${ids.length} books (concurrency: ${concurrency})...`);
  const books = [];
  let done = 0;

  for (let i = 0; i < ids.length; i += concurrency) {
    const batch = ids.slice(i, i + concurrency);
    const results = await Promise.allSettled(
      batch.map(id =>
        fetchText(`https://www.gutenberg.org/ebooks/${id}.opds`)
          .then(xml => parseBookPage(xml, id))
          .catch(() => null)
      )
    );

    for (const r of results) {
      if (r.status === 'fulfilled' && r.value) {
        books.push(r.value);
      }
    }

    done += batch.length;
    if (done % 100 === 0 || done === ids.length) {
      console.log(`  Processed ${done}/${ids.length}: ${books.length} valid books`);
    }
  }

  return books;
}

async function main() {
  const start = Date.now();
  const MAX_PAGES = 80; // 80 * 25 = 2000 books

  console.log('=== Fetching Gutenberg catalog via OPDS ===');
  const ids = await fetchCatalogPages(MAX_PAGES);

  console.log('\n=== Fetching book details ===');
  const books = await fetchBookDetails(ids);

  console.log(`\n=== Fetched ${books.length} books in ${((Date.now() - start) / 1000 / 60).toFixed(1)} min ===`);

  const genreCounts = {};
  books.forEach(b => {
    b.genres.forEach(g => {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
  });

  console.log('\n=== Genre distribution ===');
  Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([g, c]) => console.log(`  ${g}: ${c}`));

  const outPath = path.join(__dirname, '..', 'data', 'books.json');
  fs.writeFileSync(outPath, JSON.stringify(books, null, 2), 'utf8');
  const sizeMB = (fs.statSync(outPath).size / 1024 / 1024).toFixed(1);
  console.log(`\nSaved to ${outPath} (${sizeMB} MB)`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
