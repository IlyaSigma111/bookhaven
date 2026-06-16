import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API = 'https://ru.wikisource.org/w/api.php';
const AGENT = 'BookHaven/1.0 (bot; +https://github.com/IlyaSigma111/bookhaven)';

async function apiCall(params) {
  const url = API + '?' + new URLSearchParams({ format: 'json', ...params }).toString();
  for (let retry = 0; retry < 3; retry++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': AGENT },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    } catch (e) {
      if (retry < 2) await new Promise(r => setTimeout(r, 2000));
      else throw e;
    }
  }
}

function stripHtml(html) {
  return html
    .replace(/<script[^>]*>.*?<\/script>/gs, '')
    .replace(/<style[^>]*>.*?<\/style>/gs, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function getCategoryPages(category, limit = 500) {
  const pages = [];
  let cmcontinue = null;
  while (true) {
    const params = {
      action: 'query',
      list: 'categorymembers',
      cmtitle: category,
      cmtype: 'page',
      cmlimit: Math.min(limit, 500),
    };
    if (cmcontinue) params.cmcontinue = cmcontinue;
    const data = await apiCall(params);
    if (!data.query?.categorymembers) break;
    pages.push(...data.query.categorymembers.map(p => p.title));
    if (data.continue?.cmcontinue) {
      cmcontinue = data.continue.cmcontinue;
      await new Promise(r => setTimeout(r, 500));
    } else break;
  }
  return pages;
}

async function getPageHtml(title) {
  const data = await apiCall({
    action: 'parse',
    page: title,
    prop: 'text',
    disablelimitreport: '1',
    disableeditsection: '1',
  });
  return data?.parse?.text?.['*'] || null;
}

function extractWikitextInfo(wikitext) {
  const author = (wikitext.match(/\{\{[Аа]втор\|([^}]+)\}\}/) || [])[1] || '';
  const year = (wikitext.match(/\{\{[\w]+\|.*?(?:год|year)\s*=\s*(\d{4})/i) || [])[1] || '';
  const description = (wikitext.match(/\{\{[\w]+\|.*?(?:описание|description)\s*=\s*([^|}]+)/i) || [])[1] || '';
  return { author, year, description };
}

async function main() {
  console.log('=== Fetching Russian texts from Wikisource ===\n');
  const start = Date.now();

  const categories = [
    'Категория:Проза',
    'Категория:Поэзия',
    'Категория:Драматургия',
    'Категория:Сатира и юмор',
    'Категория:Фольклор',
    'Категория:Детская литература',
    'Категория:Публицистика',
    'Категория:Критика',
    'Категория:Историческая литература',
    'Категория:Научная литература',
  ];

  const seen = new Set();
  const books = [];
  const skipPatterns = [
    /\/ДО$/, /\/ВТ$/, /\/РМ$/, /\/СО$/, /^Страница:/,
    /^\//, /\/Глава/, /\/Часть/, /^Портал:/, /^Шаблон:/,
    /^Категория:/, /^Модуль:/, /^Файл:/, /^Индекс:/,
    /^MediaWiki:/, /^Справка:/, /^Участник:/,
    /^Обсуждение/, /^Википедия:/,
  ];

  for (const cat of categories) {
    const label = cat.replace('Категория:', '');
    console.log(`\n[${label}] listing pages...`);
    const pages = await getCategoryPages(cat);
    console.log(`  ${pages.length} pages found`);

    let added = 0;
    for (const title of pages) {
      if (seen.has(title)) continue;
      if (skipPatterns.some(p => p.test(title))) continue;
      if (title.length < 3) continue;

      seen.add(title);
      console.log(`  fetching: ${title}`);
      const html = await getPageHtml(title);
      if (!html) continue;

      const text = stripHtml(html);
      if (text.length < 500) continue;

      const author = '';
      const genres = label === 'Проза' ? ['Проза'] :
        label === 'Поэзия' ? ['Поэзия'] :
        label === 'Драматургия' ? ['Драма'] :
        label === 'Сатира и юмор' ? ['Сатира'] :
        label === 'Фольклор' ? ['Фольклор'] :
        label === 'Детская литература' ? ['Детская'] :
        label === 'Публицистика' ? ['Нон-фикшн'] :
        label === 'Критика' ? ['Нон-фикшн'] :
        label === 'Историческая литература' ? ['История'] :
        label === 'Научная литература' ? ['Нон-фикшн'] : ['Проза'];

      books.push({
        id: `ws-${Buffer.from(title).toString('base64url').slice(0, 40)}`,
        title,
        author: author || 'Неизвестен',
        year: 0,
        genres,
        rating: Math.round((3.5 + Math.random() * 1.0) * 10) / 10,
        cover: 0,
        cover_url: '',
        description: text.slice(0, 500),
        pages: 0,
        ia: '',
        gutenberg: 0,
        language: 'ru',
        wikisource: title,
      });
      added++;

      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
    }
    console.log(`  +${added} new`);
  }

  console.log(`\n=== Result ===`);
  console.log(`Total unique pages: ${books.length}`);

  books.sort((a, b) => a.title.localeCompare(b.title));

  const outPath = path.join(__dirname, '..', 'data', 'books-ws.json');
  fs.writeFileSync(outPath, JSON.stringify(books, null, 2), 'utf8');
  const sizeMB = (fs.statSync(outPath).size / 1024 / 1024).toFixed(2);
  console.log(`Saved to ${outPath} (${sizeMB} MB, ${books.length} books)`);
  console.log(`Done in ${((Date.now() - start) / 1000).toFixed(0)}s`);
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
