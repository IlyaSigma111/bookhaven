const https = require('https');
const fs = require('fs');
const path = require('path');

const GENRE_MAP = {
  'Science fiction': ['Научная фантастика', 'Фантастика'],
  'Fantasy fiction': ['Фэнтези', 'Фантастика'],
  'Fantasy': ['Фэнтези', 'Фантастика'],
  'Horror tales': ['Ужасы', 'Мистика'],
  'Horror': ['Ужасы', 'Мистика'],
  'Gothic fiction': ['Готика', 'Ужасы'],
  'Gothic': ['Готика', 'Ужасы'],
  'Detective and mystery stories': ['Детектив', 'Мистика'],
  'Mystery': ['Детектив', 'Мистика'],
  'Detective': ['Детектив', 'Мистика'],
  'Adventure stories': ['Приключения', 'Классика'],
  'Adventure': ['Приключения', 'Классика'],
  'Psychological fiction': ['Психология', 'Реализм'],
  'Psychological': ['Психология', 'Реализм'],
  'Historical fiction': ['История', 'Классика'],
  'Historical': ['История', 'Классика'],
  'Love stories': ['Романтика', 'Реализм'],
  'Romance': ['Романтика', 'Реализм'],
  'Humorous stories': ['Сатира', 'Комедия'],
  'Humorous': ['Сатира', 'Комедия'],
  'Humor': ['Сатира', 'Комедия'],
  'Poetry': ['Поэзия', 'Классика'],
  'Domestic fiction': ['Реализм', 'Драма'],
  'Didactic fiction': ['Классика', 'Философия'],
  'Political fiction': ['Политика', 'Антиутопия'],
  'Dystopias': ['Антиутопия', 'Научная фантастика'],
  'Dystopia': ['Антиутопия', 'Научная фантастика'],
  'Philosophy': ['Философия', 'Нон-фикшн'],
  'Classic': ['Классика'],
  'Classics': ['Классика'],
  "Children's stories": ['Детская', 'Классика'],
  'Children': ['Детская'],
  'Fairy tales': ['Фольклор', 'Детская'],
  'Folklore': ['Фольклор', 'Классика'],
  'Epic poetry': ['Эпос', 'Поэзия'],
  'Epic': ['Эпос', 'Классика'],
  'War stories': ['История', 'Реализм'],
  'Sea stories': ['Приключения', 'Реализм'],
  'Western stories': ['Приключения'],
  'Christmas stories': ['Рождественская', 'Классика'],
  'Ghost stories': ['Мистика', 'Ужасы'],
  'Short stories': ['Рассказы', 'Классика'],
  'English drama': ['Драма', 'Классика'],
  'Tragedies': ['Драма', 'Классика'],
  'Comedies': ['Комедия', 'Классика'],
  'Comedy': ['Комедия', 'Классика'],
  'Drama': ['Драма', 'Классика'],
  'Biography': ['Нон-фикшн', 'История'],
  'Biography & Autobiography': ['Нон-фикшн', 'История'],
  'History': ['История', 'Нон-фикшн'],
  'Religion': ['Духовное', 'Нон-фикшн'],
  'Philosophy and ethics': ['Философия', 'Стоицизм'],
  'Psychology': ['Психология', 'Нон-фикшн'],
  'Political science': ['Политика', 'Нон-фикшн'],
  'Political': ['Политика', 'Нон-фикшн'],
  'Science': ['Нон-фикшн'],
  'Ancient': ['Античность', 'История'],
  'Philosophy, Ancient': ['Античность', 'Философия'],
  'Stoics': ['Стоицизм', 'Философия'],
  'Epic literature': ['Эпос', 'Классика'],
  'Realism': ['Реализм', 'Классика'],
  'Russian literature': ['Русская классика', 'Классика'],
  'Russian fiction': ['Русская классика', 'Реализм'],
  'Bildungsromans': ['Реализм', 'Роман'],
  'Novels': ['Роман', 'Классика'],
  'Gothic': ['Готика', 'Ужасы'],
  'Supernatural': ['Мистика', 'Ужасы'],
  'Occult': ['Мистика'],
  'Thrillers': ['Детектив', 'Ужасы'],
  'Suspense': ['Детектив'],
  'Existentialism': ['Экзистенциализм', 'Философия'],
  'Satire': ['Сатира', 'Классика'],
  'Fables': ['Фольклор', 'Детская'],
  'Legends': ['Фольклор', 'Эпос'],
  'Mythology': ['Фольклор', 'Античность'],
  'Essays': ['Нон-фикшн', 'Философия'],
  'Travel': ['Приключения', 'Нон-фикшн'],
  'Literary Criticism': ['Нон-фикшн'],
  'Music': ['Нон-фикшн'],
  'Art': ['Нон-фикшн'],
  'Autobiographical fiction': ['Реализм', 'Классика'],
  'Comic': ['Сатира', 'Комедия'],
  'Parody': ['Сатира', 'Комедия'],
  'Surrealism': ['Фантастика', 'Мистика'],
  'Magical realism': ['Фэнтези', 'Реализм'],
  'Science fiction, English': ['Научная фантастика'],
  'Fantasy literature, English': ['Фэнтези'],
  'Adventure and adventurers': ['Приключения'],
  'Romanticism': ['Романтика', 'Реализм'],
  'Naturalism': ['Реализм', 'Классика'],
  'Tragedy': ['Драма', 'Классика'],
};

const GENRE_KEYS = Object.keys(GENRE_MAP);

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function fetchJSON(url, retries = 1) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'Accept': 'application/json' }, timeout: 120000 }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Parse error: ${e.message} for URL ${url}`));
        }
      });
    });
    req.on('error', e => {
      if (retries > 0) {
        setTimeout(() => fetchJSON(url, retries - 1).then(resolve).catch(reject), 5000);
      } else {
        reject(e);
      }
    });
    req.on('timeout', () => {
      req.destroy();
      if (retries > 0) {
        setTimeout(() => fetchJSON(url, retries - 1).then(resolve).catch(reject), 5000);
      } else {
        reject(new Error('timeout'));
      }
    });
  });
}

function classifyBook(subjects) {
  const genres = new Set();
  const lowerSubjects = subjects.map(s => s.toLowerCase());
  for (const [subject, mappedGenres] of Object.entries(GENRE_MAP)) {
    const subjLower = subject.toLowerCase();
    if (lowerSubjects.some(s => s.includes(subjLower))) {
      mappedGenres.forEach(g => genres.add(g));
    }
  }
  if (genres.size === 0) {
    const fiction = lowerSubjects.some(s => s.includes('fiction') || s.includes('story') || s.includes('novel'));
    if (fiction) genres.add('Классика');
    else genres.add('Нон-фикшн');
  }
  return [...genres];
}

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim().substring(0, 60);
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

async function fetchAllBooks() {
  const allBooks = [];
  const seenIds = new Set();

  const TOPICS = [
    'science+fiction', 'fantasy', 'horror', 'mystery', 'adventure',
    'romance', 'poetry', 'children', 'humor', 'drama', 'gothic',
    'short+stories', 'history', 'philosophy', 'folklore',
    'christmas', 'western', 'war', 'sea', 'ghost+stories',
    'thriller', 'suspense', 'comedy', 'tragedy', 'detective',
    'fairy+tales', 'ancient', 'epic', 'russian',
    'psychological', 'dystopia', 'political',
    'supernatural', 'occult', 'satire', 'essays',
    'travel', 'music', 'art', 'biography', 'religion',
    'science', 'bildungsroman', 'domestic+fiction',
    'historical+fiction', 'love+stories', 'adventure+stories',
    'humorous+stories', 'war+stories', 'western+stories',
    'christmas+stories', 'ghost+stories', 'short+stories',
    'children+stories', 'fairy+tales', 'legends', 'mythology',
  ];

  const PAGES_PER_TOPIC = 3;
  const CONCURRENCY = 4;

  for (let ti = 0; ti < TOPICS.length; ti++) {
    const topic = TOPICS[ti];
    console.log(`\n=== Topic ${ti + 1}/${TOPICS.length}: ${topic} ===`);

    for (let startPage = 1; startPage <= PAGES_PER_TOPIC; startPage += CONCURRENCY) {
      const batch = [];
      for (let p = startPage; p < startPage + CONCURRENCY && p <= PAGES_PER_TOPIC; p++) {
        const url = `https://gutendex.com/books?topic=${topic}&languages=en&page=${p}`;
        batch.push(fetchJSON(url, 2).catch(err => {
          console.error(`  Failed page ${p}: ${err.message}`);
          return null;
        }));
      }

      const results = await Promise.all(batch);
      for (const r of results) {
        if (!r || !r.results) continue;
        for (const book of r.results) {
          if (seenIds.has(book.id)) continue;
          seenIds.add(book.id);

          const genres = classifyBook(book.subjects || []);
          const top = topGenres(genres);

          const authorName = book.authors && book.authors.length > 0
            ? book.authors[0].name
            : 'Unknown';

          const description = book.summaries && book.summaries.length > 0
            ? book.summaries[0].substring(0, 500)
            : '';

          const downloadCount = book.download_count || 0;
          const rating = Math.min(5, Math.max(1, 1 + (downloadCount / 50000) * 4));

          const formats = book.formats || {};
          const hasTxt = !!formats['text/plain; charset=utf-8'] || !!formats['text/plain; charset=us-ascii'];

          if (!hasTxt || top.length === 0) continue;

          const txtUrl = formats['text/plain; charset=utf-8'] || formats['text/plain; charset=us-ascii'] || '';

          allBooks.push({
            id: `gut-${book.id}`,
            title: book.title || 'Untitled',
            author: authorName,
            year: book.authors && book.authors[0] && book.authors[0].birth_year ? book.authors[0].birth_year : 0,
            genres: top,
            rating: Math.round(rating * 10) / 10,
            description: description,
            gutenberg: book.id,
            language: book.languages && book.languages.length > 0 ? book.languages[0] : 'en',
            pages: 0,
            downloads: downloadCount,
            txt_url: txtUrl,
            cover_url: formats['image/jpeg'] || '',
          });
        }
      }
      console.log(`  Pages ${startPage}-${Math.min(startPage + CONCURRENCY - 1, PAGES_PER_TOPIC)}: ${allBooks.length} books so far`);
    }
  }

  return allBooks;
}

async function main() {
  console.log('Starting to fetch real books from Gutendex API...');
  const start = Date.now();

  const books = await fetchAllBooks();

  console.log(`\n=== Fetched ${books.length} unique books in ${((Date.now() - start) / 1000 / 60).toFixed(1)} min ===`);

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
  fs.writeFileSync(outPath, JSON.stringify(books, null, 4), 'utf8');
  console.log(`\nSaved to ${outPath} (${(fs.statSync(outPath).size / 1024 / 1024).toFixed(1)} MB)`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
