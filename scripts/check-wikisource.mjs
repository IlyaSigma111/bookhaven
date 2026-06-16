const A = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  // Wikisource has Russian classics at specific page titles
  // Let me check a few known works
  const works = [
    { author: 'Пушкин', title: 'Евгений Онегин', page: 'Евгений_Онегин' },
    { author: 'Толстой', title: 'Война и мир', page: 'Война_и_мир_(Толстой)' },
    { author: 'Достоевский', title: 'Преступление и наказание', page: 'Преступление_и_наказание' },
    { author: 'Чехов', title: 'Вишнёвый сад', page: 'Вишнёвый_сад_(Чехов)' },
    { author: 'Булгаков', title: 'Мастер и Маргарита', page: 'Мастер_и_Маргарита' },
  ];

  for (const w of works) {
    try {
      const url = 'https://ru.wikisource.org/w/index.php?title=' + encodeURIComponent(w.page) + '&action=raw';
      const r = await fetch(url, {
        headers: { 'User-Agent': A },
        signal: AbortSignal.timeout(10000)
      });
      const text = await r.text();
      const isHtml = text.includes('<!DOCTYPE') || text.includes('<html');
      console.log(w.author, '-', w.title, '=>', r.status, isHtml ? 'HTML' : 'WIKI', (text.length/1024).toFixed(1)+'KB');
      if (r.ok && !isHtml) {
        // Show first 200 chars of wikitext
        console.log('  First 200:', text.trim().slice(0, 200));
      }
    } catch(e) {
      console.log(w.author, '-', w.title, '=> ERROR:', e.message.slice(0, 60));
    }
  }
}

main().catch(e => console.error(e.message));
