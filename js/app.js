const state = {
  books: [],
  filtered: [],
  activeGenres: new Set(),
  activeLanguages: new Set(),
  selectedFormat: 'txt',
  searchTerm: '',
  loading: true,
  page: 1,
  perPage: 60
}

const COVER_COLORS = {
  'Научная фантастика': { from: '#0c4a6e', to: '#0891b2' },
  'Фэнтези': { from: '#4c1d95', to: '#7c3aed' },
  'Ужасы': { from: '#450a0a', to: '#dc2626' },
  'Классика': { from: '#78350f', to: '#d97706' },
  'Детектив': { from: '#1e3a5f', to: '#475569' },
  'Приключения': { from: '#14532d', to: '#22c55e' },
  'Философия': { from: '#312e81', to: '#818cf8' },
  'Романтика': { from: '#831843', to: '#f43f5e' },
  'Поэзия': { from: '#9f1239', to: '#fb7185' },
  'Русская классика': { from: '#1e1b4b', to: '#6366f1' },
  'Детская': { from: '#164e63', to: '#22d3ee' },
  'Сатира': { from: '#7c2d12', to: '#f97316' },
  'История': { from: '#292524', to: '#a8a29e' },
  'Нон-фикшн': { from: '#1c1917', to: '#78716c' },
  'Мистика': { from: '#3b0764', to: '#c026d3' },
  'Реализм': { from: '#1e293b', to: '#94a3b8' },
  'Драма': { from: '#271e1e', to: '#991b1b' },
  'Готика': { from: '#18181b', to: '#52525b' },
  'Духовное': { from: '#0f172a', to: '#64748b' },
  'Экзистенциализм': { from: '#171717', to: '#525252' },
  'Антиутопия': { from: '#0a0a0a', to: '#3f3f46' },
  'Стоицизм': { from: '#1e1b4b', to: '#6366f1' },
  'Античность': { from: '#2c1810', to: '#b45309' },
  'Эпос': { from: '#1a1a2e', to: '#7e22ce' },
  'Психология': { from: '#1e1b4b', to: '#8b5cf6' },
  'Политика': { from: '#1c1917', to: '#57534e' },
  'Фольклор': { from: '#1c1917', to: '#ca8a04' },
  'Фантастика': { from: '#0c4a6e', to: '#06b6d4' },
  'Рассказы': { from: '#2d1b0e', to: '#d97706' },
  'Комедия': { from: '#422006', to: '#eab308' },
  'Рождественская': { from: '#422006', to: '#dc2626' },
  'Роман': { from: '#2d1b2b', to: '#9d174d' },
  'Реализм': { from: '#1e293b', to: '#94a3b8' },
}
const DEFAULT_COLOR = { from: '#7c2d12', to: '#f97316' }

const FORMAT_ICONS = { fb2: 'fa-file-lines', epub: 'fa-book', mobi: 'fa-kindle', pdf: 'fa-file-pdf', txt: 'fa-file-lines' }

function getGenres(book) {
  const g = book.genres
  if (Array.isArray(g)) return g
  if (typeof g === 'string') return [g]
  return []
}
function getCoverColor(genres) {
  const gs = Array.isArray(genres) ? genres : (typeof genres === 'string' ? [genres] : [])
  for (const g of gs) {
    if (COVER_COLORS[g]) return COVER_COLORS[g]
  }
  return DEFAULT_COLOR
}

function getFormatUrl(book, format) {
  const gid = book.gutenberg
  if (gid && gid > 0) {
    switch (format) {
      case 'txt': return `https://www.gutenberg.org/cache/epub/${gid}/pg${gid}.txt`
      case 'epub': return `https://www.gutenberg.org/ebooks/${gid}.epub.noimages`
      case 'mobi': return `https://www.gutenberg.org/ebooks/${gid}.kindle.noimages`
    }
  }
  const iid = book.ia
  if (iid && iid.length > 0) {
    switch (format) {
      case 'txt': return `https://archive.org/download/${iid}/${iid}_djvu.txt`
      case 'epub': return `https://archive.org/download/${iid}/${iid}.epub`
      case 'mobi': return `https://archive.org/download/${iid}/${iid}.mobi`
    }
  }
  return null
}

function $(sel, ctx) { return (ctx || document).querySelectorAll(sel) }
function $1(sel, ctx) { return (ctx || document).querySelector(sel) }

document.addEventListener('DOMContentLoaded', () => {
  initCursorGlow()
  loadBooks()
  initSearch()
  initScrollEffects()
  initReset()
  initScrollTop()
  initFormatToggle()
  initArchiveBtn()
  initReader()
  initDetail()
})

function initCursorGlow() {
  const glow = $1('.cursor-glow')
  if (!glow) return
  let raf = null
  document.addEventListener('mousemove', e => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      glow.style.left = e.clientX + 'px'
      glow.style.top = e.clientY + 'px'
      raf = null
    })
  })
}

async function loadBooks() {
  showLoading(true)
  try {
    const res = await fetch('data/books.json?_=' + Date.now())
    if (!res.ok) throw new Error('HTTP ' + res.status)
    state.books = await res.json()
    if (!Array.isArray(state.books) || !state.books.length) throw new Error('Empty')
    state.books.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    showLoading(false)
    applyFilters()
    renderGenrePills()
    renderLangPills()
    updateBookCount()
  } catch (err) {
    console.error(err)
    showLoading(false)
    const l = $1('#loadingState')
    if (l) {
      l.querySelector('.loader-book').innerHTML = '<i class="fas fa-exclamation-triangle" style="color:#ef4444"></i>'
      l.querySelector('p').textContent = 'Не удалось загрузить библиотеку. Попробуйте обновить страницу.'
    }
  }
}

function showLoading(v) {
  state.loading = v
  const el = $1('#loadingState')
  if (el) el.classList.toggle('active', v)
}

function renderGenrePills() {
  const allGenres = new Set()
  state.books.forEach(b => getGenres(b).forEach(g => allGenres.add(g)))
  const counts = {}
  state.books.forEach(b => getGenres(b).forEach(g => { counts[g] = (counts[g] || 0) + 1 }))
  const sorted = [...allGenres].sort((a, b) => (counts[b] || 0) - (counts[a] || 0))
  const container = $1('#genrePills')
  if (!container) return
  container.innerHTML = ''
  sorted.forEach(genre => {
    const btn = document.createElement('button')
    btn.className = 'genre-pill' + (state.activeGenres.has(genre) ? ' active' : '')
    btn.dataset.genre = genre
    btn.innerHTML = `${genre} <span class="pill-count">${counts[genre] || 0}</span>`
    btn.addEventListener('click', () => toggleGenre(genre))
    container.appendChild(btn)
  })
}

function renderLangPills() {
  const allLangs = new Set()
  state.books.forEach(b => { if (b.language) allLangs.add(b.language) })
  const labels = { ru: 'Русский', en: 'English', de: 'Deutsch', fr: 'Français', es: 'Español' }
  const counts = {}
  state.books.forEach(b => { if (b.language) counts[b.language] = (counts[b.language] || 0) + 1 })
  const sorted = [...allLangs].sort()
  const container = $1('#langPills')
  if (!container) return
  if (sorted.length <= 1) { container.parentElement.style.display = 'none'; return }
  container.parentElement.style.display = ''
  container.innerHTML = ''
  sorted.forEach(lang => {
    const btn = document.createElement('button')
    btn.className = 'lang-pill' + (state.activeLanguages.has(lang) ? ' active' : '')
    btn.dataset.lang = lang
    const label = labels[lang] || lang.toUpperCase()
    btn.innerHTML = `${label} <span class="pill-count">${counts[lang] || 0}</span>`
    btn.addEventListener('click', () => toggleLang(lang))
    container.appendChild(btn)
  })
}

function toggleLang(lang) {
  if (state.activeLanguages.has(lang)) {
    state.activeLanguages.delete(lang)
  } else {
    state.activeLanguages.add(lang)
  }
  applyFilters()
  document.querySelectorAll('.lang-pill').forEach(el => {
    el.classList.toggle('active', state.activeLanguages.has(el.dataset.lang))
  })
}

function toggleGenre(genre) {
  if (state.activeGenres.has(genre)) {
    state.activeGenres.delete(genre)
  } else {
    state.activeGenres.add(genre)
  }
  applyFilters()
  document.querySelectorAll('.genre-pill').forEach(el => {
    el.classList.toggle('active', state.activeGenres.has(el.dataset.genre))
  })
  updateArchiveBtn()
}

function applyFilters() {
  let filtered = [...state.books]
  const search = state.searchTerm.toLowerCase().trim()
  if (search) {
    filtered = filtered.filter(b =>
      (b.title || '').toLowerCase().includes(search) ||
      (b.author || '').toLowerCase().includes(search) ||
      (b.description || '').toLowerCase().includes(search)
    )
  }
  if (state.activeGenres.size > 0) {
    filtered = filtered.filter(b =>
      getGenres(b).some(g => state.activeGenres.has(g))
    )
  }
  if (state.activeLanguages.size > 0) {
    filtered = filtered.filter(b => state.activeLanguages.has(b.language))
  }
  state.filtered = filtered
  state.page = 1
  renderBooks(filtered)
  renderPagination(filtered)
  updateResults(filtered.length)
}

function renderBooks(books) {
  const grid = $1('#booksGrid')
  if (!grid) return
  grid.innerHTML = ''
  const empty = $1('#emptyState')
  if (!books.length) {
    if (empty) empty.classList.add('active')
    return
  }
  if (empty) empty.classList.remove('active')
  const start = (state.page - 1) * state.perPage
  const page = books.slice(start, start + state.perPage)
  page.forEach(b => { grid.appendChild(createBookCard(b)) })
  requestAnimationFrame(() => {
    grid.querySelectorAll('.book-card').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 25)
    })
  })
}

function createBookCard(book) {
  const { from, to } = getCoverColor(book.genres)
  const genres = getGenres(book).slice(0, 3)
  const formats = ['txt', 'epub', 'mobi']
  const hasGut = book.gutenberg > 0
  const hasIa = book.ia && book.ia.length > 0
  const canRead = hasGut || hasIa
  const pageUrl = hasGut ? `https://www.gutenberg.org/ebooks/${book.gutenberg}` : (hasIa ? `https://archive.org/details/${book.ia}` : null)

  const formatHTML = formats.map(f => {
    const url = getFormatUrl(book, f)
    const icon = FORMAT_ICONS[f] || 'fa-file'
    if (!url) return `<span class="format-badge ${f} coming"><i class="fas ${icon}"></i> ${f.toUpperCase()}</span>`
    return `<a class="format-badge ${f}" href="${url}" target="_blank" rel="noopener" title="Скачать ${f.toUpperCase()}"><i class="fas ${icon}"></i> ${f.toUpperCase()}</a>`
  }).join('')

  const stars = renderStars(book.rating)
  const genresHTML = genres.map(g => `<span class="book-tag">${escape(g)}</span>`).join('')
  const rating = book.rating ?? 0
  const coverStyle = book.cover_url
    ? `background-image:url('${book.cover_url}');background-size:cover;background-position:center`
    : `background:linear-gradient(135deg,${from},${to})`

  const card = document.createElement('div')
  card.className = 'book-card'
  card.dataset.bookId = book.id
  card.innerHTML = `
    <div class="book-card-cover">
      <div class="cover-bg" style="${coverStyle}"></div>
      <div class="cover-pattern"></div>
      ${book.cover_url ? '' : '<div class="cover-icon"><i class="fas fa-book-open"></i></div>'}
    </div>
    <div class="book-card-body">
      <div class="book-card-category">${genresHTML}</div>
      <h3 class="book-card-title">${escape(book.title)}</h3>
      <p class="book-card-author">${escape(book.author)}</p>
      <p class="book-card-year">${book.year > 0 ? book.year : ''}</p>
      <p class="book-card-desc">${escape((book.description || '').substring(0, 200))}</p>
      <div class="book-card-rating">
        <div class="rating-stars">${stars}</div>
        <span class="rating-number">${rating.toFixed(1)}</span>
      </div>
      <div class="book-card-formats">
        ${canRead ? `<button class="format-badge read-btn"><i class="fas fa-book-open-reader"></i> Читать</button>` : ''}
        ${formatHTML}
        ${pageUrl ? `<a class="format-badge" href="${pageUrl}" target="_blank" rel="noopener" title="Подробнее"><i class="fas fa-external-link-alt"></i></a>` : ''}
      </div>
    </div>
  `
  card.querySelector('.read-btn')?.addEventListener('click', (e) => { e.stopPropagation(); openReader(book) })
  card.addEventListener('click', (e) => {
    if (e.target.closest('button, a, .format-badge')) return
    openDetail(book)
  })
  return card
}

function renderStars(r) {
  const rating = r ?? 0
  const f = Math.floor(rating)
  const h = rating - f >= 0.5 ? 1 : 0
  const e = Math.max(0, 5 - f - h)
  return '★'.repeat(f) + (h ? '★' : '') + '☆'.repeat(e)
}

function escape(t) {
  if (typeof t !== 'string') return t || ''
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

function renderPagination(books) {
  const container = $1('#pagination')
  if (!container) return
  const total = Math.ceil(books.length / state.perPage)
  if (total <= 1) { container.classList.remove('active'); return }
  container.classList.add('active')
  container.innerHTML = ''
  const prev = document.createElement('button')
  prev.className = 'page-btn' + (state.page <= 1 ? ' disabled' : '')
  prev.innerHTML = '<i class="fas fa-chevron-left"></i>'
  prev.addEventListener('click', () => goPage(state.page - 1))
  container.appendChild(prev)
  const maxVisible = 5
  let start = Math.max(1, state.page - Math.floor(maxVisible / 2))
  let end = Math.min(total, start + maxVisible - 1)
  if (end - start < maxVisible - 1) { start = Math.max(1, end - maxVisible + 1) }
  if (start > 1) {
    const first = document.createElement('button')
    first.className = 'page-btn'
    first.textContent = '1'
    first.addEventListener('click', () => goPage(1))
    container.appendChild(first)
    if (start > 2) {
      const dots = document.createElement('span')
      dots.className = 'page-dots'
      dots.textContent = '...'
      container.appendChild(dots)
    }
  }
  for (let i = start; i <= end; i++) {
    const btn = document.createElement('button')
    btn.className = 'page-btn' + (i === state.page ? ' active' : '')
    btn.textContent = i
    btn.addEventListener('click', () => goPage(i))
    container.appendChild(btn)
  }
  if (end < total) {
    if (end < total - 1) {
      const dots = document.createElement('span')
      dots.className = 'page-dots'
      dots.textContent = '...'
      container.appendChild(dots)
    }
    const last = document.createElement('button')
    last.className = 'page-btn'
    last.textContent = total
    last.addEventListener('click', () => goPage(total))
    container.appendChild(last)
  }
  const next = document.createElement('button')
  next.className = 'page-btn' + (state.page >= total ? ' disabled' : '')
  next.innerHTML = '<i class="fas fa-chevron-right"></i>'
  next.addEventListener('click', () => goPage(state.page + 1))
  container.appendChild(next)
}

function goPage(n) {
  const total = Math.ceil(state.filtered.length / state.perPage)
  if (n < 1 || n > total) return
  state.page = n
  renderBooks(state.filtered)
  renderPagination(state.filtered)
  const grid = $1('#booksGrid')
  if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function updateResults(count) {
  const el = $1('#resultsCount strong')
  if (el) el.textContent = count
}

function updateBookCount() {
  const el = $1('#bookCount')
  if (el) el.textContent = state.books.length
}

function updateArchiveBtn() {
  const btn = $1('#downloadGenreBtn')
  if (!btn) return
  const active = [...state.activeGenres]
  if (active.length >= 1) {
    btn.disabled = false
    const genre = active[0]
    const count = state.books.filter(b => getGenres(b).includes(genre)).length
    btn.innerHTML = `<i class="fas fa-download"></i> Скачать жанр <span class="btn-badge">${count} ZIP</span>`
  } else {
    btn.disabled = true
    btn.innerHTML = `<i class="fas fa-download"></i> Скачать жанр <span class="btn-badge">ZIP</span>`
  }
}

function initSearch() {
  const input = $1('#searchInput')
  const clearBtn = $1('#searchClear')
  const hints = $1('#searchHints')
  if (!input) return
  let timer = null
  input.addEventListener('input', () => {
    const val = input.value.trim()
    clearBtn.classList.toggle('visible', val.length > 0)
    clearTimeout(timer)
    timer = setTimeout(() => {
      state.searchTerm = val
      applyFilters()
      if (val.length >= 2) {
        showHints(val)
      } else {
        hints.classList.remove('active')
        hints.innerHTML = ''
      }
    }, 250)
  })
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') { input.blur(); hints.classList.remove('active'); hints.innerHTML = '' }
    if (e.key === 'Enter') { hints.classList.remove('active'); hints.innerHTML = ''; input.blur() }
  })
  clearBtn.addEventListener('click', () => {
    input.value = ''
    clearBtn.classList.remove('visible')
    state.searchTerm = ''
    applyFilters()
    hints.classList.remove('active')
    hints.innerHTML = ''
    input.focus()
  })
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrapper')) {
      hints.classList.remove('active')
    }
  })
}

function showHints(q) {
  const ql = q.toLowerCase()
  const results = state.books.filter(b =>
    (b.title || '').toLowerCase().includes(ql) || (b.author || '').toLowerCase().includes(ql)
  ).slice(0, 6)
  const hints = $1('#searchHints')
  hints.innerHTML = ''
  if (!results.length) { hints.classList.remove('active'); return }
  results.forEach(b => {
    const item = document.createElement('div')
    item.className = 'search-hint-item'
    item.innerHTML = `<i class="fas fa-book hint-icon"></i><div><div class="hint-title">${highlight(b.title, ql)}</div><div class="hint-author">${highlight(b.author, ql)}</div></div>`
    item.addEventListener('click', () => {
      $1('#searchInput').value = b.title
      state.searchTerm = b.title
      hints.classList.remove('active')
      hints.innerHTML = ''
      applyFilters()
      const el = document.querySelector(`[data-book-id="${b.id}"]`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
    hints.appendChild(item)
  })
  hints.classList.add('active')
}

function highlight(text, q) {
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(re, '<strong style="color:var(--gold-light)">$1</strong>')
}

function initScrollEffects() {
  let last = 0
  const nav = $1('.navbar')
  window.addEventListener('scroll', () => {
    const c = window.scrollY
    if (c > 150) {
      nav.classList.toggle('hidden', c > last)
    } else {
      nav.classList.remove('hidden')
    }
    last = c
  })
}

function initReset() {
  const handlers = [() => {
    state.activeGenres.clear()
    state.activeLanguages.clear()
    state.searchTerm = ''
    const inp = $1('#searchInput')
    if (inp) { inp.value = ''; $1('#searchClear').classList.remove('visible') }
    const h = $1('#searchHints')
    if (h) { h.classList.remove('active'); h.innerHTML = '' }
    document.querySelectorAll('.genre-pill').forEach(el => el.classList.remove('active'))
    document.querySelectorAll('.lang-pill').forEach(el => el.classList.remove('active'))
    applyFilters()
    updateArchiveBtn()
    $1('.controls-section').scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }]
  const r = $1('#resetFilters')
  if (r) r.addEventListener('click', handlers[0])
  const e = $1('#emptyReset')
  if (e) e.addEventListener('click', handlers[0])
}

function initScrollTop() {
  const el = $1('#scrollTop')
  if (el) el.addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) })
}

function initFormatToggle() {
  document.querySelectorAll('.format-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      state.selectedFormat = btn.dataset.format
      updateArchiveBtn()
    })
  })
}

function initArchiveBtn() {
  const btn = $1('#downloadGenreBtn')
  if (!btn) return
  btn.addEventListener('click', async () => {
    if (btn.disabled) return
    const active = [...state.activeGenres]
    const genre = active.length > 0 ? active[0] : null
    let books = genre
      ? state.books.filter(b => getGenres(b).includes(genre))
      : state.filtered
    if (!books.length) { toast('Нет книг', 'error'); return }
    const orig = btn.innerHTML
    btn.disabled = true
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Подготовка...'
    try {
      if (typeof JSZip === 'undefined') throw new Error('No JSZip')
      const zip = new JSZip()
      let added = 0
      for (const book of books.slice(0, 80)) {
        const url = getFormatUrl(book, state.selectedFormat)
        if (!url) continue
        try {
          const ctrl = new AbortController()
          const to = setTimeout(() => ctrl.abort(), 4000)
          const res = await fetch(url, { signal: ctrl.signal })
          clearTimeout(to)
          if (res.ok) {
            const blob = await res.blob()
            if (blob.size <= 2097152) {
              const name = book.title.replace(/[^\w\sа-яА-ЯёЁ]/g,'').substring(0,50).trim() || 'book'
              zip.file(name + '.' + state.selectedFormat, blob)
              added++
            }
          }
        } catch (_) {}
      }
      if (added === 0) {
        toast('Не удалось загрузить файлы. Попробуйте другой формат.', 'error')
        btn.disabled = false
        btn.innerHTML = orig
        return
      }
      const content = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(content)
      link.download = `books-${genre || 'all'}-${state.selectedFormat}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(link.href), 60000)
      toast(`Архив готов: ${added} книг`, 'success')
    } catch (err) {
      toast('Ошибка при создании архива', 'error')
    }
    btn.disabled = false
    btn.innerHTML = orig
  })
}

let readerBookId = null
let curReaderBook = null

function initReader() {
  const closeBtn = $1('#readerClose')
  const overlay = $1('#readerOverlay')
  const dlBtn = $1('#readerDownload')
  if (closeBtn) closeBtn.addEventListener('click', closeReader)
  if (overlay) overlay.addEventListener('click', closeReader)
  if (dlBtn) dlBtn.addEventListener('click', () => {
    if (curReaderBook) tryDownloadBook(curReaderBook)
  })
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeReader()
  })
}

function openReader(book) {
  const modal = $1('#readerModal')
  const title = $1('#readerTitle')
  const author = $1('#readerAuthor')
  const inner = $1('#readerBodyInner')
  const status = $1('#readerStatus')
  if (!modal || !inner) return

  curReaderBook = book
  readerBookId = book.gutenberg || book.ia || book.id || null
  title.textContent = book.title || ''
  author.textContent = book.author || ''
  inner.innerHTML = `
    <div class="reader-loading">
      <div class="loader"><div class="loader-book"><i class="fas fa-book"></i></div></div>
      <p>Загружаем текст...</p>
    </div>
  `
  status.textContent = ''
  modal.classList.add('active')
  document.body.style.overflow = 'hidden'

  const hasGut = book.gutenberg > 0
  const hasIa = book.ia && book.ia.length > 0

  if (hasGut) {
    fetchGutenbergText(book.gutenberg, inner, status)
  } else if (hasIa) {
    fetchIaText(book.ia, inner, status, book)
  } else {
    showReaderFallback(inner, book)
  }
}

function closeReader() {
  const modal = $1('#readerModal')
  if (modal) modal.classList.remove('active')
  document.body.style.overflow = ''
  readerBookId = null
  curReaderBook = null
}

function showReaderFallback(inner, book) {
  const pageUrl = book.gutenberg > 0
    ? `https://www.gutenberg.org/ebooks/${book.gutenberg}`
    : (book.ia ? `https://archive.org/details/${book.ia}` : null)
  inner.innerHTML = `
    <div class="reader-loading" style="gap:20px">
      <div style="font-size:2.5rem;opacity:0.3"><i class="fas fa-book-open"></i></div>
      <p style="text-indent:0;font-family:var(--font-sans);color:rgba(255,255,255,0.4)">
        Текст недоступен для онлайн-чтения
      </p>
      ${pageUrl ? `<a class="btn" href="${pageUrl}" target="_blank" rel="noopener" style="border-color:rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);padding:10px 24px">
        <i class="fas fa-external-link-alt"></i> Открыть в источнике
      </a>` : ''}
    </div>
  `
}

function tryDownloadBook(book) {
  const url = getFormatUrl(book, 'txt') || getFormatUrl(book, 'epub') || getFormatUrl(book, 'mobi')
  if (url) {
    const a = document.createElement('a')
    a.href = url
    a.target = '_blank'
    a.rel = 'noopener'
    a.click()
  } else {
    const pageUrl = book.gutenberg > 0
      ? `https://www.gutenberg.org/ebooks/${book.gutenberg}`
      : (book.ia ? `https://archive.org/details/${book.ia}` : null)
    if (pageUrl) {
      window.open(pageUrl, '_blank')
    }
  }
}

/* Detail Modal */
const reviews = {}

function initDetail() {
  const overlay = $1('#detailOverlay')
  const close = $1('#detailClose')
  if (overlay) overlay.addEventListener('click', closeDetail)
  if (close) close.addEventListener('click', closeDetail)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDetail()
  })
}

function openDetail(book) {
  const modal = $1('#detailModal')
  const inner = $1('#detailInner')
  if (!modal || !inner) return

  const { from, to } = getCoverColor(book.genres)
  const genres = getGenres(book)
  const hasGut = book.gutenberg > 0
  const hasIa = book.ia && book.ia.length > 0
  const canRead = hasGut || hasIa
  const stars = renderStars(book.rating)
  const rating = book.rating ?? 0
  const coverStyle = book.cover_url
    ? `background-image:url('${book.cover_url}');background-size:cover;background-position:center`
    : `background:linear-gradient(135deg,${from},${to})`
  const pageUrl = hasGut
    ? `https://www.gutenberg.org/ebooks/${book.gutenberg}`
    : (hasIa ? `https://archive.org/details/${book.ia}` : null)

  const formatLinks = ['txt', 'epub', 'mobi'].map(f => {
    const url = getFormatUrl(book, f)
    const icon = FORMAT_ICONS[f] || 'fa-file'
    if (!url) return ''
    return `<a class="format-badge ${f}" href="${url}" target="_blank" rel="noopener" title="Скачать ${f.toUpperCase()}"><i class="fas ${icon}"></i> ${f.toUpperCase()}</a>`
  }).join('')

  const reviewList = (reviews[book.id] || []).map(r => `
    <div class="review-item">
      <div class="review-author">${escape(r.author)}</div>
      <div class="review-text">${escape(r.text)}</div>
      <div class="review-date">${r.date}</div>
    </div>
  `).join('')

  inner.innerHTML = `
    <div class="detail-cover">
      <div class="cover-bg" style="${coverStyle}"></div>
      <div class="cover-pattern"></div>
      ${book.cover_url ? '' : '<div class="cover-icon"><i class="fas fa-book-open"></i></div>'}
    </div>
    <div class="detail-header">
      <h2 class="detail-title">${escape(book.title)}</h2>
      <p class="detail-author">${escape(book.author)}</p>
      <p class="detail-year">${book.year > 0 ? escape(book.year.toString()) : ''}</p>
    </div>
    <div class="detail-rating">
      <div class="rating-stars">${stars}</div>
      <span class="rating-number">${rating.toFixed(1)}</span>
    </div>
    <div class="detail-actions">
      ${canRead ? `<button class="format-badge read-btn" style="padding:8px 20px;font-size:0.85rem"><i class="fas fa-book-open-reader"></i> Читать</button>` : ''}
      ${formatLinks}
      ${pageUrl ? `<a class="format-badge" href="${pageUrl}" target="_blank" rel="noopener" style="padding:8px 16px;font-size:0.8rem"><i class="fas fa-external-link-alt"></i> Источник</a>` : ''}
    </div>
    <div class="detail-section">
      <div class="detail-section-title"><i class="fas fa-tags"></i> Жанры</div>
      <div class="detail-genres">${genres.map(g => `<span class="book-tag">${escape(g)}</span>`).join('')}</div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title"><i class="fas fa-align-left"></i> Описание</div>
      <p class="detail-description">${escape(book.description || 'Описание отсутствует')}</p>
    </div>
    <div class="detail-meta-grid">
      <div class="detail-meta-item">
        <div class="meta-value">${book.pages || '—'}</div>
        <div class="meta-label">Страниц</div>
      </div>
      <div class="detail-meta-item">
        <div class="meta-value">${book.year > 0 ? book.year : '—'}</div>
        <div class="meta-label">Год</div>
      </div>
      <div class="detail-meta-item">
        <div class="meta-value">${rating.toFixed(1)}</div>
        <div class="meta-label">Рейтинг</div>
      </div>
    </div>
    <div class="detail-section detail-inline-reader">
      <button class="detail-reader-toggle" id="readerToggle">
        <i class="fas fa-book-open-reader"></i>
        <span>${canRead ? 'Читать онлайн' : 'Где читать?'}</span>
        <i class="fas fa-chevron-down toggle-arrow"></i>
      </button>
      <div class="detail-reader-body" id="detailReaderBody">
        ${canRead ? `
        <div class="reader-loading">
          <div class="loader"><div class="loader-book"><i class="fas fa-book"></i></div></div>
          <p>Загружаем текст...</p>
        </div>
        ` : `
        <div class="reader-loading" style="gap:20px;padding:30px 20px">
          <div style="font-size:2rem;opacity:0.2"><i class="fas fa-external-link-alt"></i></div>
          <p style="text-indent:0;font-family:var(--font-sans);color:rgba(255,255,255,0.35)">
            Эта книга доступна для чтения во внешних источниках
          </p>
        </div>
        `}
      </div>
    </div>
    <div class="detail-reviews">
      <div class="detail-section-title"><i class="fas fa-comments"></i> Отзывы</div>
      <div class="review-list" id="reviewList">${reviewList || '<div class="review-placeholder"><i class="fas fa-comment-dots"></i><p>Пока нет отзывов. Будьте первым!</p></div>'}</div>
      <div class="review-form">
        <textarea id="reviewInput" placeholder="Напишите ваш отзыв..." maxlength="500"></textarea>
        <button class="btn btn-primary" id="reviewSubmit"><i class="fas fa-paper-plane"></i> Отправить</button>
      </div>
    </div>
  `

  inner.querySelector('.read-btn')?.addEventListener('click', (e) => { e.stopPropagation(); closeDetail(); openReader(book) })
  inner.querySelector('#reviewSubmit')?.addEventListener('click', () => {
    const input = inner.querySelector('#reviewInput')
    const text = input.value.trim()
    if (!text) return
    if (!reviews[book.id]) reviews[book.id] = []
    reviews[book.id].push({ author: 'Читатель', text, date: new Date().toLocaleDateString('ru-RU') })
    input.value = ''
    openDetail(book)
    const list = $1('#reviewList', inner)
    if (list) list.scrollTop = list.scrollHeight
  })

  const toggle = inner.querySelector('#readerToggle')
  const detailReaderBody = inner.querySelector('#detailReaderBody')
  if (toggle && detailReaderBody) {
    let loaded = false
    toggle.addEventListener('click', () => {
      const isOpen = detailReaderBody.classList.toggle('open')
      toggle.querySelector('.toggle-arrow').style.transform = isOpen ? 'rotate(180deg)' : ''
      if (isOpen && !loaded) {
        loaded = true
        if (hasGut) fetchGutenbergText(book.gutenberg, detailReaderBody, null)
        else if (hasIa) fetchIaText(book.ia, detailReaderBody, null, book)
        // else: fallback content already in HTML
      }
    })
  }

  modal.classList.add('active')
  document.body.style.overflow = 'hidden'
  inner.scrollTop = 0
}

function closeDetail() {
  const modal = $1('#detailModal')
  if (modal) modal.classList.remove('active')
  document.body.style.overflow = ''
}

async function fetchGutenbergText(id, containerEl, statusEl) {
  const url = `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`
  try {
    const ctrl = new AbortController()
    const to = setTimeout(() => ctrl.abort(), 15000)
    const res = await fetch(url, { signal: ctrl.signal })
    clearTimeout(to)
    if (!res.ok || !res.headers.get('content-type')?.includes('text')) {
      throw new Error(`HTTP ${res.status}`)
    }
    let text = await res.text()
    text = processGutenbergText(text)
    renderReaderText(text, containerEl, statusEl)
  } catch (err) {
    showReaderError(containerEl, statusEl, 'Не удалось загрузить текст')
  }
}

async function fetchIaText(iaId, containerEl, statusEl, book) {
  const url = `https://archive.org/stream/${iaId}/${iaId}_djvu.txt`
  try {
    const ctrl = new AbortController()
    const to = setTimeout(() => ctrl.abort(), 15000)
    const res = await fetch(url, { signal: ctrl.signal })
    clearTimeout(to)
    const text = await res.text()
    if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
      showReaderError(containerEl, statusEl, 'Текст доступен только на Archive.org', `https://archive.org/details/${iaId}`)
      return
    }
    const clean = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
    if (clean.length < 100) {
      showReaderError(containerEl, statusEl, 'Текст недоступен', `https://archive.org/details/${iaId}`)
      return
    }
    renderReaderText(clean, containerEl, statusEl)
  } catch (err) {
    showReaderError(containerEl, statusEl, 'Не удалось загрузить текст', `https://archive.org/details/${iaId}`)
  }
}

function processGutenbergText(text) {
  const startMarker = text.indexOf('*** START OF')
  const endMarker = text.indexOf('*** END OF')
  let content
  if (startMarker >= 0 && endMarker > startMarker) {
    const start = text.indexOf('\n', startMarker) + 1
    content = text.substring(start, endMarker)
  } else {
    content = text
  }
  content = content
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return content
}

function showReaderError(containerEl, statusEl, msg, linkUrl) {
  containerEl.innerHTML = `
    <div class="reader-loading" style="gap:20px">
      <div style="font-size:2.5rem;opacity:0.2"><i class="fas fa-exclamation-circle"></i></div>
      <p style="text-indent:0;font-family:var(--font-sans);color:rgba(255,255,255,0.35)">
        ${escape(msg)}
      </p>
      ${linkUrl ? `<a href="${escape(linkUrl)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:10px 24px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.5);text-decoration:none;font-size:0.85rem;font-family:var(--font-sans);transition:all 0.2s">
        <i class="fas fa-external-link-alt"></i> Открыть в источнике
      </a>` : ''}
    </div>
  `
  if (statusEl) statusEl.textContent = '\u2717'
}

function renderReaderText(text, containerEl, statusEl) {
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim())
  if (paragraphs.length === 0) {
    showReaderError(containerEl, statusEl, 'Текст пуст')
    return
  }

  const bodyHTML = paragraphs.map(p => `<p>${escape(p.trim())}</p>`).join('')

  containerEl.innerHTML = `
    <div class="reader-header-mark">— Чтение —</div>
    ${bodyHTML}
    <div class="reader-footer-mark">— Конец текста —</div>
  `
  if (statusEl) statusEl.textContent = `${paragraphs.length} абз.`
  // Scroll to top (find reader-body parent)
  const readerBody = containerEl.closest('.reader-body')
  if (readerBody) readerBody.scrollTop = 0
}

function toast(msg, type = 'info') {
  const c = $1('#toastContainer')
  if (!c) return
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' }
  const el = document.createElement('div')
  el.className = `toast toast-${type}`
  el.innerHTML = `<i class="fas ${icons[type]}"></i><span>${msg}</span>`
  c.appendChild(el)
  setTimeout(() => {
    el.classList.add('toast-out')
    setTimeout(() => el.remove(), 300)
  }, 3000)
}
