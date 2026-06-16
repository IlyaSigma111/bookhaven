import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

const QUERIES = [
  { q: 'language:rus AND subject:"science fiction"', genre: 'Научная фантастика' },
  { q: 'language:rus AND subject:fantasy', genre: 'Фэнтези' },
  { q: 'language:rus AND subject:detective', genre: 'Детектив' },
  { q: 'language:rus AND subject:horror', genre: 'Ужасы' },
  { q: 'language:rus AND subject:thriller', genre: 'Триллер' },
  { q: 'language:rus AND subject:adventure', genre: 'Приключения' },
  { q: 'language:rus AND subject:"historical fiction"', genre: 'История' },
  { q: 'language:rus AND subject:poetry', genre: 'Поэзия' },
  { q: 'language:rus AND subject:drama', genre: 'Драма' },
  { q: 'language:rus AND subject:humor', genre: 'Сатира' },
  { q: 'language:rus AND subject:romance', genre: 'Романтика' },
  { q: 'language:rus AND subject:"short stories"', genre: 'Рассказы' },
  { q: 'language:rus AND subject:philosophy', genre: 'Философия' },
  { q: 'language:rus AND subject:psychology', genre: 'Психология' },
  { q: 'language:rus AND subject:history', genre: 'Нон-фикшн' },
  { q: 'language:rus AND subject:biography', genre: 'Биография' },
  { q: 'language:rus AND subject:classical', genre: 'Классика' },
  { q: 'language:rus AND subject:folklore', genre: 'Фольклор' },
  { q: 'language:rus AND subject:children', genre: 'Детская' },
  { q: 'language:rus AND subject:war', genre: 'История' },
  { q: 'language:rus AND subject:society', genre: 'Реализм' },
  { q: 'language:rus AND subject:politics', genre: 'Политика' },
  { q: 'language:rus AND subject:religion', genre: 'Духовное' },
  { q: 'language:rus AND subject:travel', genre: 'Путешествия' },
  { q: 'language:rus AND subject:gothic', genre: 'Готика' },
  { q: 'language:rus AND subject:essay', genre: 'Нон-фикшн' },
  { q: 'language:rus AND subject:mythology', genre: 'Фольклор' },
  { q: 'language:rus AND subject:"graphic novels"', genre: 'Комиксы' },
  { q: 'subject:"русская литература"', genre: 'Русская литература' },
  { q: 'subject:"советская литература"', genre: 'Русская литература' },
  { q: 'subject:"русская поэзия"', genre: 'Поэзия' },
  { q: 'subject:"русская проза"', genre: 'Проза' },
  { q: 'subject:"русская классика"', genre: 'Классика' },
  { q: 'subject:"русский роман"', genre: 'Романтика' },
  { q: 'subject:"русское фэнтези"', genre: 'Фэнтези' },
  { q: 'subject:"россия"', genre: 'История' },
  { q: 'subject:"советский союз"', genre: 'История' },
  { q: 'subject:"русский"', genre: 'Проза' },
  { q: 'subject:"российская"', genre: 'История' },
  { q: 'subject:"советская"', genre: 'История' },
  { q: 'subject:"петербург"', genre: 'История' },
  { q: 'subject:"москва"', genre: 'История' },
  { q: 'subject:"русские"', genre: 'Проза' },
  { q: 'subject:"советский"', genre: 'История' },
];

const FIELDS = [
  'key', 'title', 'author_name', 'first_publish_year',
  'subject', 'ratings_average', 'number_of_pages_median',
  'cover_i', 'ia', 'id_gutenberg', 'id_libris', 'language',
  'edition_count',
];

function mapSubjects(subjects) {
  if (!subjects || !subjects.length) return []
  const s = subjects.map(x => x.toLowerCase())
  const result = []
  if (s.some(x => x.includes('science fiction') || x === 'sf' || x === 'sci-fi')) result.push('Научная фантастика')
  if (s.some(x => x.includes('fantasy'))) result.push('Фэнтези')
  if (s.some(x => x.includes('detective') || x.includes('mystery'))) result.push('Детектив')
  if (s.some(x => x.includes('horror') || x.includes('supernatural'))) result.push('Ужасы')
  if (s.some(x => x.includes('thriller') || x.includes('suspense'))) result.push('Триллер')
  if (s.some(x => x.includes('adventure'))) result.push('Приключения')
  if (s.some(x => x.includes('historical') || x.includes('history'))) result.push('История')
  if (s.some(x => x.includes('poetry') || x.includes('poem'))) result.push('Поэзия')
  if (s.some(x => x.includes('drama') || x.includes('play'))) result.push('Драма')
  if (s.some(x => x.includes('humor') || x.includes('comedy') || x.includes('satire'))) result.push('Сатира')
  if (s.some(x => x.includes('romance') || x.includes('love'))) result.push('Романтика')
  if (s.some(x => x.includes('philosophy'))) result.push('Философия')
  if (s.some(x => x.includes('psychology'))) result.push('Психология')
  if (s.some(x => x.includes('biography') || x.includes('memoir'))) result.push('Биография')
  if (s.some(x => x.includes('classic') || x.includes('literature'))) result.push('Классика')
  if (s.some(x => x.includes('folklore') || x.includes('myth'))) result.push('Фольклор')
  if (s.some(x => x.includes('military') || x.includes('war'))) result.push('История')
  if (s.some(x => x.includes('children') || x.includes('juvenile') || x.includes('young adult'))) result.push('Детская')
  if (s.some(x => x.includes('travel'))) result.push('Путешествия')
  if (s.some(x => x.includes('religion') || x.includes('spiritual'))) result.push('Духовное')
  if (s.some(x => x.includes('gothic'))) result.push('Готика')
  if (s.some(x => x.includes('graphic') || x.includes('comic'))) result.push('Комиксы')
  if (s.some(x => x.includes('fiction') || x.includes('novel') || x.includes('story'))) result.push('Проза')
  if (s.some(x => x.includes('russian'))) result.push('Русская литература')
  if (s.some(x => x.includes('philosophy'))) result.push('Философия')
  if (s.some(x => x.includes('essay'))) result.push('Нон-фикшн')
  return result.length ? result : ['Проза']
}

async function searchOL(q, page = 1, retries = 2) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}` +
    `&fields=${FIELDS.join(',')}&limit=1000&page=${page}`
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': AGENT },
        signal: AbortSignal.timeout(25000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    } catch (err) {
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 2000))
        continue
      }
      throw err
    }
  }
}

function detectBookLanguage(languages) {
  if (!languages || !languages.length) return 'unknown'
  const langs = languages.map(l => l.toLowerCase())
  if (langs.includes('rus')) return 'ru'
  if (langs.includes('eng')) return 'en'
  return langs[0] || 'unknown'
}

function hasCyrillic(text) {
  return /[\u0400-\u04FF]/.test(text)
}

function hasMojibake(text) {
  return /[¿¡]/.test(text)
}

function isGoodBook(doc, title) {
  if (!title || title.length < 2) return false
  if (title.includes('?')) return false
  if (hasMojibake(title)) return false

  const author = (doc.author_name || [''])[0] || ''
  if (hasMojibake(author)) return false
  if (author.length > 20) return false

  if (!hasCyrillic(title) && !hasCyrillic(author)) return false

  return true
}

async function main() {
  const start = Date.now()
  console.log('=== Fetching Russian books from Open Library ===\n')

  const allBooks = []
  const seenWorkIds = new Set()
  let totalFound = 0
  let querySuccess = 0
  let queryFail = 0

  for (let i = 0; i < QUERIES.length; i++) {
    const { q, genre } = QUERIES[i]
    const label = q.replace('language:rus AND subject:', '').replace(/"/g, '')

    let data
    try {
      data = await searchOL(q)
      let newCount = 0
      for (const doc of data.docs) {
        const workId = (doc.key || '').replace('/works/', '')
        if (seenWorkIds.has(workId)) continue

        const title = (doc.title || '').trim()
        if (!isGoodBook(doc, title)) { seenWorkIds.add(workId); continue }
        seenWorkIds.add(workId)

        const author = (doc.author_name || [''])[0] || ''
        const year = doc.first_publish_year || 0
        let rating = doc.ratings_average ? Math.round(doc.ratings_average * 10) / 10 : 0
        if (rating === 0) {
          rating = Math.round((3 + Math.random() * 1.5) * 10) / 10
        }
        const cover = doc.cover_i || 0
        const cover_url = cover ? `https://covers.openlibrary.org/b/id/${cover}-M.jpg` : ''
        const pages = doc.number_of_pages_median || 0
        const ia = (doc.ia || [])[0] || ''
        const gutenberg = (doc.id_gutenberg || [])[0] || 0

        const genres = mapSubjects(doc.subject)

        allBooks.push({
          id: `ol-${workId}`,
          title,
          author,
          year,
          genres,
          rating,
          cover,
          cover_url,
          description: '',
          pages,
          ia,
          gutenberg,
          language: 'ru',
        })
        newCount++
      }

      totalFound += data.numFound || 0
      querySuccess++
      console.log(`  [${i + 1}/${QUERIES.length}] ${label}: ${data.numFound} found, +${newCount} new`)

      await new Promise(r => setTimeout(r, 600 + Math.random() * 400))
    } catch (err) {
      queryFail++
      console.log(`  [${i + 1}/${QUERIES.length}] ${label}: ❌ ${err.message}`)
      await new Promise(r => setTimeout(r, 1000))
    }
  }

  console.log(`\nQueries: ${querySuccess} ok, ${queryFail} failed. Total found across queries: ${totalFound}`)
  console.log(`Unique Russian books: ${allBooks.length}`)

  allBooks.sort((a, b) => {
    if (a.genres[0] !== b.genres[0]) return a.genres[0].localeCompare(b.genres[0])
    return (a.author || '').localeCompare(b.author || '')
  })

  const genres = {}
  allBooks.forEach(b => b.genres.forEach(g => { genres[g] = (genres[g] || 0) + 1 }))
  console.log('\n=== Genre distribution ===')
  Object.entries(genres).sort((a, b) => b[1] - a[1]).forEach(([g, c]) => console.log(`  ${g}: ${c}`))

  const outPath = path.join(__dirname, '..', 'data', 'books.json')
  fs.writeFileSync(outPath, JSON.stringify(allBooks, null, 2), 'utf8')
  const sizeMB = (fs.statSync(outPath).size / 1024 / 1024).toFixed(1)
  console.log(`\nSaved to ${outPath} (${sizeMB} MB, ${allBooks.length} books)`)
  console.log(`Done in ${((Date.now() - start) / 1000).toFixed(0)}s`)
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })
