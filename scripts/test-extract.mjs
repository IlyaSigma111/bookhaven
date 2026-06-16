import http from 'http';

const html = `<ol><h5><a href=/a/254115>Convict 12627</a></h5>1 <a href='/b/654815'>Detective Fiction Weekly. Vol. 118, No. 2, March 19, 1938</a><br/>
<h5><a href=/a/272880>A..torCh</a></h5>2 <a href='/b/819428'>Упаковка</a><br/>
<h5><a href=/a/80561>Avery Aames</a></h5>3 <a href='/b/243105'>The Long Quiche Goodbye</a><br/>
4 <a href='/b/303862'>Clobbered by Camembert</a><br/>`;

let currentAuthor = '';
const lines = html.split('\n');
for (const line of lines) {
  const authorMatch = line.match(/<h5><a href=\/a\/\d+>([^<]+)<\/a><\/h5>/);
  if (authorMatch) {
    currentAuthor = authorMatch[1].trim();
    continue;
  }
  const bookMatch = line.match(/\d+\s*<a href='\/b\/(\d+)'>([^<]+)<\/a>/);
  if (bookMatch) {
    console.log('Book:', bookMatch[2].trim(), '| Author:', currentAuthor, '| ID:', bookMatch[1]);
  }
}

// Test actual HTTP fetch
console.log('\n--- Testing real HTTP ---');
http.get('http://flibusta.info/g/detective', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Content length:', data.length);
    const books = data.match(/<a href='\/b\/(\d+)'>/g);
    console.log('Book link count:', books ? books.length : 0);
    if (books) console.log('First:', books[0], 'Last:', books[books.length-1]);
  });
}).on('error', e => console.error('Error:', e.message));
