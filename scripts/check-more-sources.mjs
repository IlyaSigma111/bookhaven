const A = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  const tests = [
    // Russian online libraries
    { name: 'readli.net', url: 'https://readli.net/vojna-i-mir/' },
    { name: 'loveread.me', url: 'https://loveread.me/read_book.php?id=15&p=1' },
    { name: 'maxima-library', url: 'https://maxima-library.org/knigi/knigi-online/b/452683?format=read' },
    { name: 'royallib.com', url: 'https://royallib.com/book/tolstoy_lev/voina_i_mir.html' },
    // Wikisource
    { name: 'wikisource raw', url: 'https://ru.wikisource.org/w/index.php?title=%D0%92%D0%BE%D0%B9%D0%BD%D0%B0_%D0%B8_%D0%BC%D0%B8%D1%80&action=raw' },
  ];

  for (const t of tests) {
    try {
      const r = await fetch(t.url, {
        headers: { 'User-Agent': A },
        signal: AbortSignal.timeout(10000),
        redirect: 'manual'
      });
      const text = await r.text();
      const isHtml = text.includes('<!DOCTYPE') || text.includes('<html');
      const cleanLen = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length;
      console.log(t.name, '=>', r.status, isHtml ? 'HTML' : 'TEXT', 
        (text.length/1024).toFixed(0)+'KB', cleanLen > 1000 ? 'has content' : 'short');
    } catch(e) {
      console.log(t.name, '=> ERROR:', e.message.slice(0, 60));
    }
  }
}

main().catch(e => console.error(e.message));
