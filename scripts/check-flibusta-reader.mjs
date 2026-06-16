const A = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function main() {
  // Check if reader has book text in HTML or loaded via JS
  const res = await fetch('https://flibusta.club/b/17402559/read', {
    headers: { 'User-Agent': A },
    signal: AbortSignal.timeout(10000)
  });
  const html = await res.text();
  console.log('Size:', html.length, 'bytes');
  
  // Look for div with text
  const divMatch = html.match(/<div[^>]*id="([^"]*)"[^>]*style="[^"]*display:\s*block[^"]*">([\s\S]*?)<\/div>/i);
  if (divMatch) {
    console.log('Found display:block div');
    console.log('Content preview:', divMatch[2].slice(0, 200));
  }
  
  // Check for book text indicators
  const hasBookText = html.includes('class="book-text"') || html.includes('id="book-text"') || html.includes('class="text"');
  console.log('Has book-text indicator:', hasBookText);
  
  // Look for any long text content
  const bodyText = html.replace(/<script[^>]*>[\s\S]*?<\/script>/g, '').replace(/<style[^>]*>[\s\S]*?<\/style>/g, '');
  const textContent = bodyText.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  console.log('Text content length:', textContent.length);
  
  // Check for page turning buttons
  const hasNav = html.includes('page=1') || html.includes('next') || html.includes('start=0');
  console.log('Has navigation:', hasNav);
  
  // Check for JavaScript that loads text
  const scripts = html.match(/<script[^>]*src="([^"]*)"[^>]*>/g);
  if (scripts) {
    console.log('External scripts:', scripts.length);
    scripts.slice(0, 10).forEach(function(s) { console.log('  ' + s.slice(0, 100)); });
  }
  const inlineScripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g);
  if (inlineScripts) {
    const hasFetch = inlineScripts.some(function(s) { return s.includes('fetch') || s.includes('XMLHttpRequest') || s.includes('$.ajax'); });
    console.log('Has AJAX:', hasFetch);
  }
}

main().catch(function(e) { console.error(e.message); });
