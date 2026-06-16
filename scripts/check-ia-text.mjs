const A = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  const iaId = 'withinwhirlwind0000ginz';
  
  // Try IA's various text access methods
  const tests = [
    `https://archive.org/stream/${iaId}/${iaId}_djvu.txt`,
    `https://archive.org/stream/${iaId}?ui=embed#`,
    `https://archive.org/BookReader/BookReaderJSON.php?id=${iaId}`,
    `https://archive.org/BookReader/BookReaderImages.php?zip=/${iaId}/${iaId}_jp2.zip&file=${iaId}_jp2/${iaId}_0000.jp2&id=${iaId}`,
    `https://archive.org/details/${iaId}/page/n1/mode/2up`,
    `https://ia802700.us.archive.org/0/items/${iaId}/${iaId}_djvu.txt`,
    `https://ia802700.us.archive.org/0/items/${iaId}/${iaId}.epub`,
  ];
  
  for (const url of tests) {
    try {
      const r = await fetch(url, {
        headers: { 'User-Agent': A },
        signal: AbortSignal.timeout(15000),
        redirect: 'manual'
      });
      const type = r.headers.get('content-type') || '';
      const body = await r.text();
      const isHtml = body.includes('<!DOCTYPE') || body.includes('<html');
      const loc = r.headers.get('location') || '';
      console.log(url.split('/').pop(), '=>', r.status, type.split(';')[0].slice(0,30), 
        isHtml ? 'HTML' : (body.length > 200 ? 'TEXT-OK' : 'SHORT'), 
        body.length + 'B', loc ? '->' + loc.slice(0, 60) : '');
    } catch(e) {
      console.log(url.split('/').pop(), '=> ERROR:', e.message.slice(0, 60));
    }
  }
}

main().catch(e => console.error(e.message));
