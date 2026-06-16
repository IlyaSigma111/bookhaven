const A = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  const res = await fetch('https://flibusta.club/b/17402559/read', {
    headers: { 'User-Agent': A },
    signal: AbortSignal.timeout(10000)
  });
  const html = await res.text();
  
  // Find all divs with text content
  const divRe = /<div[^>]*>([\s\S]*?)<\/div>/g;
  let m;
  const divs = [];
  while ((m = divRe.exec(html)) !== null) {
    const inner = m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (inner.length > 100) {
      divs.push(inner.slice(0, 200));
    }
  }
  console.log('Large divs:', divs.length);
  divs.forEach(function(d, i) { console.log(i + ':', d); });
  
  // Print the full HTML of the main content area
  const bodyStart = html.indexOf('<body');
  const bodyEnd = html.indexOf('</body>');
  if (bodyStart >= 0 && bodyEnd >= 0) {
    const body = html.slice(bodyStart, bodyEnd + 7);
    // Remove scripts and styles
    const clean = body.replace(/<script[^>]*>[\s\S]*?<\/script>/g, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/g, '');
    console.log('\n=== CLEAN BODY HTML ===');
    console.log(clean);
  }
}

main().catch(function(e) { console.error(e.message); });
