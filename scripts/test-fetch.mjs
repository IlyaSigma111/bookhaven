const AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const url = 'https://openlibrary.org/search.json?q=language:rus%20AND%20subject:detective&fields=key,title,author_name,first_publish_year,subject,ratings_average,cover_i,ia,language&limit=3';

async function test() {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': AGENT },
      signal: AbortSignal.timeout(15000),
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Found:', data.numFound, 'Docs:', data.docs.length);
    if (data.docs.length > 0) {
      console.log('First:', data.docs[0].title, 'by', data.docs[0].author_name?.[0]);
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

test();
