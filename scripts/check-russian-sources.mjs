const A = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  // Test various Russian book sources for text accessibility
  const tests = [
    // lib.ru - classic Russian library
    { name: 'lib.ru Tolstoy', url: 'http://lib.ru/LITRA/TOLSTOJ/woina.txt' },
    { name: 'lib.ru Dostoevsky', url: 'http://lib.ru/LITRA/DOSTOEWSKIJ/prestuplenie.txt' },
    // az.lib.ru - Russian writers
    { name: 'az.lib.ru Pushkin', url: 'http://az.lib.ru/p/pushkin_a_s/text_0100.shtml' },
    // ilibrary.ru
    { name: 'ilibrary.ru', url: 'http://ilibrary.ru/text/5/p.1/index.html' },
  ];

  for (const t of tests) {
    try {
      const r = await fetch(t.url, {
        headers: { 'User-Agent': A },
        signal: AbortSignal.timeout(10000)
      });
      const text = await r.text();
      const isHtml = text.includes('<!DOCTYPE') || text.includes('<html');
      const cleanLen = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length;
      console.log(t.name, '=>', r.status, isHtml ? 'HTML' : 'TEXT', cleanLen + ' chars');
    } catch(e) {
      console.log(t.name, '=> ERROR:', e.message.slice(0, 60));
    }
  }
}

main().catch(e => console.error(e.message));
