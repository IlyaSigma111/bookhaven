const A = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  const res = await fetch('https://flibusta.club/b/695778/read', {
    headers: { 'User-Agent': A },
    signal: AbortSignal.timeout(10000)
  });
  const html = await res.text();
  console.log('Size:', html.length);
  
  // Remove scripts and styles
  const clean = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/g, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[^;]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  console.log('Text length:', clean.length);
  console.log('First 300:', clean.slice(0, 300));
}

main().catch(function(e) { console.error(e.message); });
