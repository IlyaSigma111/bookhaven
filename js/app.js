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
  const id = book.gutenberg
  if (!id || id <= 0) return null
  switch (format) {
    case 'txt': return `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`
    case 'epub': return `https://www.gutenberg.org/ebooks/${id}.epub.noimages`
    case 'mobi': return `https://www.gutenberg.org/ebooks/${id}.kindle.noimages`
    default: return null
  }
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
    const url = hasGut ? getFormatUrl(book, f) : null
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
  card.querySelector('.read-btn')?.addEventListener('click', () => openReader(book))
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
        if (!book.gutenberg || book.gutenberg <= 0) continue
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

function initReader() {
  const closeBtn = $1('#readerClose')
  const overlay = $1('#readerOverlay')
  if (closeBtn) closeBtn.addEventListener('click', closeReader)
  if (overlay) overlay.addEventListener('click', closeReader)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeReader()
  })
}

function openReader(book) {
  const modal = $1('#readerModal')
  const title = $1('#readerTitle')
  const author = $1('#readerAuthor')
  const body = $1('#readerBody')
  const status = $1('#readerStatus')
  if (!modal) return

  readerBookId = book.gutenberg || book.ia || null
  title.textContent = book.title || ''
  author.textContent = book.author || ''
  body.innerHTML = `
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
    fetchGutenbergText(book.gutenberg, body, status)
  } else if (hasIa) {
    fetchIaText(book.ia, body, status, book)
  } else {
    body.innerHTML = '<div class="reader-loading"><p style="color:var(--red)">Текст недоступен</p></div>'
  }
}

function closeReader() {
  const modal = $1('#readerModal')
  if (modal) modal.classList.remove('active')
  document.body.style.overflow = ''
  readerBookId = null
}

async function fetchGutenbergText(id, bodyEl, statusEl) {
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
    renderReaderText(text, bodyEl, statusEl, id)
  } catch (err) {
    if (err.name === 'AbortError') {
      bodyEl.innerHTML = '<div class="reader-loading"><p style="color:var(--red)">Превышено время ожидания</p></div>'
    } else {
      bodyEl.innerHTML = '<div class="reader-loading"><p style="color:var(--red)">Не удалось загрузить текст</p></div>'
    }
  }
}

async function fetchIaText(iaId, bodyEl, statusEl, book) {
  const url = `https://archive.org/stream/${iaId}/${iaId}_djvu.txt`
  try {
    const ctrl = new AbortController()
    const to = setTimeout(() => ctrl.abort(), 15000)
    const res = await fetch(url, { signal: ctrl.signal })
    clearTimeout(to)
    const text = await res.text()
    if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
      bodyEl.innerHTML = `
        <div class="reader-loading" style="gap:16px">
          <p style="color:var(--text-muted)">Текст доступен только на Archive.org</p>
          <a class="format-badge" href="https://archive.org/details/${iaId}" target="_blank" rel="noopener" style="padding:10px 24px;font-size:0.9rem">
            <i class="fas fa-external-link-alt"></i> Открыть на Archive.org
          </a>
        </div>`
      return
    }
    const clean = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
    renderReaderText(clean, bodyEl, statusEl, iaId)
  } catch (err) {
    bodyEl.innerHTML = `
      <div class="reader-loading" style="gap:16px">
        <p style="color:var(--red)">Не удалось загрузить текст</p>
        <a class="format-badge" href="https://archive.org/details/${iaId}" target="_blank" rel="noopener" style="padding:10px 24px;font-size:0.9rem">
          <i class="fas fa-external-link-alt"></i> Открыть на Archive.org
        </a>
      </div>`
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

function renderReaderText(text, bodyEl, statusEl, id) {
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim())
  if (paragraphs.length === 0) {
    bodyEl.innerHTML = '<div class="reader-loading"><p style="color:var(--text-muted)">Текст пуст</p></div>'
    return
  }

  const headerMark = `<div class="reader-header-mark">— Project Gutenberg eBook #${id} —</div>`
  const footerMark = `<div class="reader-footer-mark">— Конец текста —</div>`
  const bodyHTML = paragraphs.map(p => `<p>${escape(p.trim())}</p>`).join('')

  bodyEl.innerHTML = headerMark + bodyHTML + footerMark
  statusEl.textContent = `${paragraphs.length} абзацев`
  bodyEl.scrollTop = 0
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
