const A = 'Mozilla/5.0';

async function main() {
  const url = 'https://flibusta.club/b/695778/fb2';
  const r = await fetch(url, {
    headers: { 'User-Agent': A, 'Accept': 'application/xml,text/xml,text/plain,*/*' },
    signal: AbortSignal.timeout(15000)
  });
  const body = await r.text();
  console.log('Status:', r.status, 'Type:', r.headers.get('content-type'));
  const hasBookTitle = body.includes('Загадочная') || body.includes('<FictionBook');
  const isPage = body.includes('<html');
  console.log('Has content:', hasBookTitle, 'Is page:', isPage, 'Size:', body.length);

  // Look for any data/download URLs
  const urlPattern = /https?:\/\/[^\s"']+\.(?:txt|fb2|epub|mobi)[^\s"']*/g;
  const urlsInPage = body.match(urlPattern);
  if (urlsInPage) console.log('Found URLs:', urlsInPage.slice(0, 5));

  const downloadPattern = /href="([^"]*(?:download|get|file)[^"]*)"/g;
  let m;
  while ((m = downloadPattern.exec(body)) !== null) {
    console.log('Download link:', m[1]);
  }
}

main().catch(function(e) { console.error(e.message); });
