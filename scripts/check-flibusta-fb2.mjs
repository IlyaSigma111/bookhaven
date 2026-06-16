const A = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  // Check if Flibusta FB2 actually contains the text (even though wrapped)
  const res = await fetch('https://flibusta.club/b/695778/fb2', {
    headers: { 'User-Agent': A },
    signal: AbortSignal.timeout(10000)
  });
  const html = await res.text();
  console.log('Size:', html.length, 'bytes');
  console.log('Type:', res.headers.get('content-type'));
  
  // Check if it contains FB2 XML
  const hasFictionBook = html.includes('FictionBook') || html.includes('<title-info>');
  console.log('Has FB2:', hasFictionBook);
  
  // Check first 300 chars
  console.log('First 300:', html.slice(0, 300));
  
  // Check if it has actual text content from the book
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log('Clean text length:', text.length);
  console.log('Has book text:', text.includes('Загадочная'));
  
  // Also check download.php or similar
  const res2 = await fetch('https://flibusta.club/b/695778/download', {
    headers: { 'User-Agent': A },
    signal: AbortSignal.timeout(10000)
  });
  console.log('\n/download:', res2.status, (await res2.text()).slice(0, 200));
}

main().catch(e => console.error(e.message));
