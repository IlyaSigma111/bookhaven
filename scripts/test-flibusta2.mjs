const AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  const res = await fetch('https://flibusta.club/b/695778', {
    headers: { 'User-Agent': AGENT },
    signal: AbortSignal.timeout(10000)
  });
  const html = await res.text();
  console.log('Book page: ' + html.length + 'B');
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  console.log('Title: ' + (titleMatch ? titleMatch[1] : 'N/A'));

  const linkRegex = /href="([^"]+)"/g;
  let m;
  const downloadLinks = [];
  while ((m = linkRegex.exec(html)) !== null) {
    const href = m[1];
    if (/download|txt|fb2|epub|mobi|pdf/i.test(href)) {
      downloadLinks.push(href);
    }
  }
  console.log('Download-related links:');
  downloadLinks.forEach(function(l) { console.log('  ' + l); });

  const authorMatch = html.match(/<a[^>]*href="\/a\/\d+"[^>]*>([^<]+)<\/a>/);
  console.log('Author: ' + (authorMatch ? authorMatch[1] : 'N/A'));
}

main().catch(function(e) { console.error('ERROR: ' + e.message); });
