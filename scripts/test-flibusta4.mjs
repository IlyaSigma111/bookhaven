const AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  const res = await fetch('https://flibusta.club/b/695778/read', {
    headers: { 'User-Agent': AGENT },
    signal: AbortSignal.timeout(10000)
  });
  const html = await res.text();

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  if (bodyMatch) {
    const text = bodyMatch[1]
      .replace(/<script[^>]*>[\s\S]*?<\/script>/g, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/g, ' ')
      .replace(/&[a-z]+;[a-z]+;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    console.log('Reader text: ' + text.length + ' chars');
    console.log(text.slice(0, 500));
  }
}

main().catch(function(e) { console.error(e.message); });
