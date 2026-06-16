const AGENT = 'BookHaven/1.0';

// Wikisource → clean text
export function stripWikitext(wiki) {
  // Remove comments
  let t = wiki.replace(/<!--[\s\S]*?-->/g, '');
  // Remove templates {{...}}
  t = t.replace(/\{\{[^}]*\}\}/g, '');
  // Remove nested templates
  let prev;
  do {
    prev = t;
    t = t.replace(/\{\{[^{}]*\}\}/g, '');
  } while (t !== prev);
  // Remove <ref> tags
  t = t.replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '');
  t = t.replace(/<ref[^>]*\/>/g, '');
  // Remove HTML tags
  t = t.replace(/<[^>]+>/g, '');
  // Remove wiki markup
  t = t.replace(/'{2,5}/g, '');  // bold/italic
  t = t.replace(/\[\[([^\]|]*\|)?([^\]|]*)\]\]/g, '$2');  // wikilinks
  t = t.replace(/\[https?:\/\/[^\s\]]+\s([^\]]*)\]/g, '$1');  // external links
  t = t.replace(/={2,6}\s*([^=]+)\s*={2,6}/g, '');  // headings
  t = t.replace(/----+/g, '');  // horizontal rules
  t = t.replace(/^\s*[\*#:;]\s*/gm, '');  // list markers
  t = t.replace(/^[\s:]+/gm, '');  // indentation
  t = t.replace(/&mdash;/g, '—');
  t = t.replace(/&nbsp;/g, ' ');
  t = t.replace(/&lt;/g, '<');
  t = t.replace(/&gt;/g, '>');
  t = t.replace(/&amp;/g, '&');
  t = t.replace(/__[A-Z]+__/g, '');  // __NOTOC__ etc
  // Remove empty lines
  t = t.replace(/\n{3,}/g, '\n\n');
  t = t.trim();
  return t;
}

// Get text from Wikisource for a given page title
export async function fetchWikisourceText(pageTitle) {
  const url = `https://ru.wikisource.org/w/index.php?title=${encodeURIComponent(pageTitle)}&action=raw`;
  const res = await fetch(url, {
    headers: { 'User-Agent': AGENT },
    signal: AbortSignal.timeout(10000)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const wikitext = await res.text();
  if (wikitext.includes('<!DOCTYPE') || wikitext.includes('<html')) {
    throw new Error('Got HTML instead of wikitext');
  }
  // Follow redirect
  if (wikitext.startsWith('#REDIRECT')) {
    const target = wikitext.match(/\[\[([^\]]+)\]\]/);
    if (target) return fetchWikisourceText(target[1]);
  }
  return stripWikitext(wikitext);
}

// Search Wikisource for a book
export async function searchWikisource(query) {
  const url = `https://ru.wikisource.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=10&format=json`;
  const res = await fetch(url, {
    headers: { 'User-Agent': AGENT },
    signal: AbortSignal.timeout(10000)
  });
  const data = await res.json();
  return (data.query?.search || []).map(function(s) {
    return { title: s.title, pageid: s.pageid };
  });
}
