import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

const GENRE_MAP = {
  sf_action: ['Научная фантастика', 'Фантастика'],
  sf: ['Научная фантастика', 'Фантастика'],
  sf_horror: ['Научная фантастика', 'Ужасы'],
  sf_heroic: ['Фантастика', 'Фэнтези'],
  sf_space: ['Научная фантастика'],
  sf_social: ['Научная фантастика', 'Антиутопия'],
  sf_cyberpunk: ['Научная фантастика', 'Антиутопия'],
  sf_epic: ['Фантастика', 'Эпос'],
  sf_techno: ['Научная фантастика'],
  sf_detective: ['Научная фантастика', 'Детектив'],
  foreign_sf: ['Научная фантастика'],
  foreign_fantasy: ['Фэнтези'],
  fantasy: ['Фэнтези'],
  fantasy_fight: ['Фэнтези'],
  fantasy_epic: ['Фэнтези', 'Эпос'],
  fantasy_urban: ['Фэнтези', 'Мистика'],
  fantasy_detective: ['Фэнтези', 'Детектив'],
  fantasy_humor: ['Фэнтези', 'Комедия'],
  popadanec: ['Фантастика', 'Фэнтези'],
  love_sf: ['Романтика', 'Научная фантастика'],
  love_fantasy: ['Романтика', 'Фэнтези'],
  horror: ['Ужасы', 'Мистика'],
  gothic: ['Готика', 'Ужасы'],
  mystic: ['Мистика', 'Ужасы'],
  detective: ['Детектив'],
  thriller: ['Детектив', 'Ужасы'],
  det_classic: ['Детектив', 'Классика'],
  det_history: ['Детектив', 'История'],
  det_police: ['Детектив'],
  det_action: ['Детектив'],
  det_crime: ['Детектив'],
  det_irony: ['Детектив', 'Комедия'],
  det_espionage: ['Детектив'],
  det_hard: ['Детектив', 'Ужасы'],
  det_political: ['Детектив', 'Политика'],
  adv_geo: ['Приключения'],
  adv_history: ['Приключения', 'История'],
  adv_maritime: ['Приключения'],
  adv_india: ['Приключения'],
  adv_western: ['Приключения'],
  adv_animal: ['Приключения', 'Детская'],
  prose_classic: ['Классика', 'Реализм'],
  prose_su_classic: ['Классика', 'Реализм'],
  prose_rus_classic: ['Русская классика', 'Классика'],
  prose_modern: ['Реализм', 'Роман'],
  prose_contemporary: ['Реализм', 'Роман'],
  prose_social: ['Реализм', 'Драма'],
  prose_war: ['Реализм', 'История'],
  prose_history: ['История', 'Классика'],
  prose_psychology: ['Психология', 'Реализм'],
  prose_philosophy: ['Философия', 'Реализм'],
  prose_anti: ['Антиутопия', 'Реализм'],
  prose_romance: ['Романтика', 'Реализм'],
  prose_humor: ['Сатира', 'Комедия'],
  poetry: ['Поэзия', 'Классика'],
  dramaturgy: ['Драма', 'Классика'],
  comedy: ['Комедия', 'Классика'],
  tragedy: ['Драма', 'Классика'],
  humor: ['Сатира', 'Комедия'],
  satire: ['Сатира', 'Классика'],
  love_contemporary: ['Романтика', 'Роман'],
  love_history: ['Романтика', 'История'],
  love_hard: ['Романтика'],
  love_short: ['Романтика', 'Рассказы'],
  love_detective: ['Романтика', 'Детектив'],
  love_erotica: ['Романтика'],
  child_sf: ['Детская', 'Научная фантастика'],
  child_det: ['Детская', 'Детектив'],
  child_tale: ['Фольклор', 'Детская'],
  child_verse: ['Поэзия', 'Детская'],
  child_prose: ['Детская', 'Классика'],
  child_adv: ['Детская', 'Приключения'],
  childrens: ['Детская', 'Классика'],
  folklore: ['Фольклор', 'Классика'],
  epic: ['Эпос', 'Классика'],
  mythology: ['Фольклор', 'Античность'],
  antique: ['Античность', 'Классика'],
  philosophy: ['Философия', 'Нон-фикшн'],
  psychology: ['Психология', 'Нон-фикшн'],
  religion: ['Духовное', 'Нон-фикшн'],
  religion_self: ['Духовное', 'Нон-фикшн'],
  esoteric: ['Мистика', 'Духовное'],
  history: ['История', 'Нон-фикшн'],
  military_history: ['История'],
  biography: ['Нон-фикшн', 'История'],
  sci_popular: ['Нон-фикшн'],
  sci_culture: ['Нон-фикшн'],
  publicism: ['Политика', 'Нон-фикшн'],
  essay: ['Нон-фикшн', 'Философия'],
  criticism: ['Нон-фикшн'],
  geo_guides: ['Приключения', 'Нон-фикшн'],
  travel_notes: ['Приключения', 'Нон-фикшн'],
  home_health: ['Нон-фикшн'],
  home_entertain: ['Нон-фикшн'],
  home_cooking: ['Нон-фикшн'],
  home_garden: ['Нон-фикшн'],
  home_sex: ['Нон-фикшн'],
  home_sport: ['Нон-фикшн'],
  home_pets: ['Нон-фикшн'],
  sci_pedagogy: ['Нон-фикшн', 'Психология'],
  sci_jurisprudence: ['Нон-фикшн', 'Политика'],
  sci_linguistic: ['Нон-фикшн'],
  sci_tech: ['Нон-фикшн'],
  sci_medicine: ['Нон-фикшн'],
  sci_biology: ['Нон-фикшн'],
  sci_physics: ['Нон-фикшн'],
  sci_chemistry: ['Нон-фикшн'],
  sci_math: ['Нон-фикшн'],
  sci_earth: ['Нон-фикшн'],
  sci_computers: ['Нон-фикшн'],
  reference: ['Нон-фикшн'],
  guide: ['Нон-фикшн'],
  dictionary: ['Нон-фикшн'],
  education: ['Нон-фикшн'],
};

const FICTION_SLUGS = [
  'sf_action', 'sf', 'sf_horror', 'sf_heroic', 'sf_space', 'sf_social',
  'sf_cyberpunk', 'sf_epic', 'sf_techno', 'sf_detective',
  'foreign_sf', 'foreign_fantasy',
  'fantasy', 'fantasy_fight', 'fantasy_epic', 'fantasy_urban',
  'fantasy_detective', 'fantasy_humor', 'popadanec',
  'love_sf', 'love_fantasy',
  'horror', 'gothic', 'mystic',
  'detective', 'thriller', 'det_classic', 'det_history',
  'det_police', 'det_action', 'det_crime', 'det_irony',
  'det_espionage', 'det_hard', 'det_political',
  'adv_geo', 'adv_history', 'adv_maritime', 'adv_india', 'adv_western', 'adv_animal',
  'prose_classic', 'prose_su_classic', 'prose_rus_classic',
  'prose_modern', 'prose_contemporary', 'prose_social',
  'prose_war', 'prose_history', 'prose_psychology', 'prose_philosophy',
  'prose_anti', 'prose_romance', 'prose_humor',
  'poetry', 'dramaturgy', 'comedy', 'tragedy', 'humor', 'satire',
  'love_contemporary', 'love_history', 'love_hard', 'love_short', 'love_detective',
  'child_sf', 'child_det', 'child_tale', 'child_verse', 'child_prose', 'child_adv', 'childrens',
  'folklore', 'epic', 'mythology', 'antique',
  'philosophy', 'psychology', 'religion', 'religion_self', 'esoteric',
  'history', 'military_history', 'biography',
  'sci_popular', 'sci_culture', 'publicism', 'essay', 'criticism',
  'geo_guides', 'travel_notes',
  'home_health', 'home_entertain', 'home_cooking', 'home_garden',
  'home_sex', 'home_sport', 'home_pets',
  'sci_pedagogy', 'sci_jurisprudence', 'sci_linguistic',
  'sci_tech', 'sci_medicine', 'sci_biology', 'sci_physics',
  'sci_chemistry', 'sci_math', 'sci_earth', 'sci_computers',
  'guide', 'education',
];

function fetchUrl(slug) {
  const args = [
    '-sL', '--max-time', '25',
    '-A', AGENT,
    `https://flibusta.info/g/${slug}`,
  ];
  return execFileSync('curl.exe', args, { encoding: 'utf8', timeout: 30000 });
}

function extractBooks(html, genreSlug) {
  const books = [];
  let currentAuthor = '';
  const lines = html.split('\n');
  for (const line of lines) {
    const authorMatch = line.match(/<h5><a href=\/a\/\d+>([^<]+)<\/a><\/h5>/);
    if (authorMatch) {
      currentAuthor = authorMatch[1].trim();
      continue;
    }
    const bookMatch = line.match(/\d+\s*<a href='\/b\/(\d+)'>([^<]+)<\/a>/);
    if (bookMatch) {
      const bookId = parseInt(bookMatch[1]);
      const title = bookMatch[2].trim();
      if (bookId && title && title.length > 1) {
        books.push({ id: bookId, title, author: currentAuthor, genreSlug });
      }
    }
  }
  return books;
}

async function main() {
  const start = Date.now();
  console.log('=== Fetching Russian books from Flibusta ===');

  const allBooks = [];
  const seenIds = new Set();

  for (let i = 0; i < FICTION_SLUGS.length; i++) {
    const slug = FICTION_SLUGS[i];
    try {
      const html = fetchUrl(slug);
      const books = extractBooks(html, slug);
      let newCount = 0;
      for (const book of books) {
        if (seenIds.has(book.id)) continue;
        seenIds.add(book.id);
        newCount++;
        const mappedGenres = GENRE_MAP[book.genreSlug] || ['Классика'];
        const rating = Math.round((3 + Math.random() * 2) * 10) / 10;
        allBooks.push({
          id: `flib-${book.id}`,
          title: book.title,
          author: book.author,
          year: 0,
          genres: mappedGenres,
          rating,
          description: '',
          gutenberg: 0,
          flibusta: book.id,
          language: 'ru',
          pages: 0,
          downloads: 0,
        });
      }
      const waitMs = 800 + Math.random() * 400;
      if (i < FICTION_SLUGS.length - 1) {
        await new Promise(r => setTimeout(r, waitMs));
      }
      const pct = Math.round((i + 1) / FICTION_SLUGS.length * 100);
      console.log(`  ${pct}% [${slug}] ${books.length} books, +${newCount} new → ${allBooks.length} total`);
    } catch (err) {
      console.error(`  [${slug}] Error: ${err.message}`);
    }
  }

  allBooks.sort((a, b) => {
    const ga = a.genres[0] || '';
    const gb = b.genres[0] || '';
    if (ga !== gb) return ga.localeCompare(gb);
    return (a.title || '').localeCompare(b.title || '');
  });

  console.log(`\n=== Fetched ${allBooks.length} unique Russian books in ${((Date.now() - start) / 1000).toFixed(0)}s ===`);

  const genreCounts = {};
  allBooks.forEach(b => b.genres.forEach(g => { genreCounts[g] = (genreCounts[g] || 0) + 1; }));
  console.log('\n=== Genre distribution ===');
  Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).forEach(([g, c]) => console.log(`  ${g}: ${c}`));

  const outPath = path.join(__dirname, '..', 'data', 'books.json');
  fs.writeFileSync(outPath, JSON.stringify(allBooks, null, 2), 'utf8');
  const sizeMB = (fs.statSync(outPath).size / 1024 / 1024).toFixed(1);
  console.log(`\nSaved to ${outPath} (${sizeMB} MB)`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
