import { useEffect, useMemo, useState } from 'react'
import './App.css'
import BookCard from './components/BookCard'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')

// Hero / featured visual assets (replace with your own if desired)
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1800&q=80'

const coverPool = [
  'https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg', // Project Hail Mary
  'https://covers.openlibrary.org/b/isbn/9781524731656-L.jpg', // Bad Blood
  'https://covers.openlibrary.org/b/isbn/9781492670124-L.jpg', // 7 1/2 Deaths
  'https://covers.openlibrary.org/b/isbn/9780316556347-L.jpg', // Circe
  'https://covers.openlibrary.org/b/isbn/9780307743657-L.jpg', // The Shining
  'https://covers.openlibrary.org/b/isbn/9780593318171-L.jpg', // Klara and the Sun
  'https://covers.openlibrary.org/b/isbn/9780385547345-L.jpg', // Lessons in Chemistry
  'https://covers.openlibrary.org/b/isbn/9780593321201-L.jpg', // Tomorrow and Tomorrow and Tomorrow
  'https://covers.openlibrary.org/b/isbn/9780063021426-L.jpg', // Babel
  'https://covers.openlibrary.org/b/isbn/9780063204157-L.jpg', // Remarkably Bright Creatures
  'https://covers.openlibrary.org/b/isbn/9781649374042-L.jpg', // Fourth Wing
  'https://covers.openlibrary.org/b/isbn/9780593159460-L.jpg', // The Maid
  'https://covers.openlibrary.org/b/isbn/9780593128480-L.jpg', // A Deadly Education
  'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg', // Atomic Habits
  'https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg', // Educated
  'https://covers.openlibrary.org/b/isbn/9781524763138-L.jpg', // Becoming
  'https://covers.openlibrary.org/b/isbn/9780399588198-L.jpg', // Born a Crime
  'https://covers.openlibrary.org/b/isbn/9780062316110-L.jpg', // Sapiens
  'https://covers.openlibrary.org/b/isbn/9780143127741-L.jpg', // Body Keeps the Score
  'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg', // Deep Work
  'https://covers.openlibrary.org/b/isbn/9780735214484-L.jpg', // Range
  'https://covers.openlibrary.org/b/isbn/9780374275631-L.jpg', // Thinking Fast and Slow
  'https://covers.openlibrary.org/b/isbn/9780316017930-L.jpg', // Outliers
  'https://covers.openlibrary.org/b/isbn/9780593653420-L.jpg', // Creative Act
]

const baseBooks = [
  { title: 'Bad Blood', author: 'John Carreyrou', category: 'Non-Fiction', price: 18.99, cover: 'https://covers.openlibrary.org/b/isbn/9781524731656-L.jpg', badge: 'Non-Fiction', rating: 5 },
  { title: 'Circe', author: 'Madeline Miller', category: 'Fiction', price: 19.5, cover: 'https://covers.openlibrary.org/b/isbn/9780316556347-L.jpg', badge: 'Fiction', rating: 5 },
  { title: 'The 7½ Deaths of Evelyn Hardcastle', author: 'Stuart Turton', category: 'Fiction', price: 14.99, cover: 'https://covers.openlibrary.org/b/isbn/9781492670124-L.jpg', badge: 'Mystery', rating: 5 },
  { title: 'The Shining', author: 'Stephen King', category: 'Fiction', price: 18.99, cover: 'https://covers.openlibrary.org/b/isbn/9780307743657-L.jpg', badge: 'Fiction', rating: 5 },
  { title: 'Project Hail Mary', author: 'Andy Weir', category: 'Fiction', price: 21.0, cover: 'https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg', badge: 'Sci-Fi', rating: 5 },
  { title: 'Klara and the Sun', author: 'Kazuo Ishiguro', category: 'Fiction', price: 16.99, cover: 'https://covers.openlibrary.org/b/isbn/9780593318171-L.jpg', badge: 'Literary', rating: 4 },
  { title: 'Lessons in Chemistry', author: 'Bonnie Garmus', category: 'Fiction', price: 17.5, cover: 'https://covers.openlibrary.org/b/isbn/9780385547345-L.jpg', badge: 'Fiction', rating: 5 },
  { title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', category: 'Fiction', price: 18.25, cover: 'https://covers.openlibrary.org/b/isbn/9780593321201-L.jpg', badge: 'Fiction', rating: 5 },
  { title: 'Babel', author: 'R. F. Kuang', category: 'Fiction', price: 20.0, cover: 'https://covers.openlibrary.org/b/isbn/9780063021426-L.jpg', badge: 'Fantasy', rating: 5 },
  { title: 'Remarkably Bright Creatures', author: 'Shelby Van Pelt', category: 'Fiction', price: 15.75, cover: 'https://covers.openlibrary.org/b/isbn/9780063204157-L.jpg', badge: 'Fiction', rating: 4 },
  { title: 'Fourth Wing', author: 'Rebecca Yarros', category: 'Fiction', price: 22.0, cover: 'https://covers.openlibrary.org/b/isbn/9781649374042-L.jpg', badge: 'Fantasy', rating: 4 },
  { title: 'The Maid', author: 'Nita Prose', category: 'Fiction', price: 13.99, cover: 'https://covers.openlibrary.org/b/isbn/9780593159460-L.jpg', badge: 'Mystery', rating: 4 },
  { title: 'A Deadly Education', author: 'Naomi Novik', category: 'Fiction', price: 12.5, cover: 'https://covers.openlibrary.org/b/isbn/9780593128480-L.jpg', badge: 'Fantasy', rating: 4 },
  { title: 'Atomic Habits', author: 'James Clear', category: 'Non-Fiction', price: 27.0, cover: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg', badge: 'Non-Fiction', rating: 5 },
  { title: 'Educated', author: 'Tara Westover', category: 'Non-Fiction', price: 16.0, cover: 'https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg', badge: 'Memoir', rating: 5 },
  { title: 'Becoming', author: 'Michelle Obama', category: 'Non-Fiction', price: 19.5, cover: 'https://covers.openlibrary.org/b/isbn/9781524763138-L.jpg', badge: 'Memoir', rating: 5 },
  { title: 'Born a Crime', author: 'Trevor Noah', category: 'Non-Fiction', price: 17.25, cover: 'https://covers.openlibrary.org/b/isbn/9780399588198-L.jpg', badge: 'Memoir', rating: 5 },
  { title: 'Sapiens', author: 'Yuval Noah Harari', category: 'Non-Fiction', price: 21.0, cover: 'https://covers.openlibrary.org/b/isbn/9780062316110-L.jpg', badge: 'History', rating: 5 },
  { title: 'The Body Keeps the Score', author: 'Bessel van der Kolk', category: 'Non-Fiction', price: 18.5, cover: 'https://covers.openlibrary.org/b/isbn/9780143127741-L.jpg', badge: 'Health', rating: 5 },
  { title: 'Deep Work', author: 'Cal Newport', category: 'Non-Fiction', price: 15.5, cover: 'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg', badge: 'Productivity', rating: 4 },
  { title: 'Range', author: 'David Epstein', category: 'Non-Fiction', price: 14.75, cover: 'https://covers.openlibrary.org/b/isbn/9780735214484-L.jpg', badge: 'Business', rating: 4 },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', category: 'Non-Fiction', price: 17.99, cover: 'https://covers.openlibrary.org/b/isbn/9780374275631-L.jpg', badge: 'Psychology', rating: 5 },
  { title: 'Outliers', author: 'Malcolm Gladwell', category: 'Non-Fiction', price: 16.25, cover: 'https://covers.openlibrary.org/b/isbn/9780316017930-L.jpg', badge: 'Business', rating: 4 },
  { title: 'The Creative Act', author: 'Rick Rubin', category: 'Non-Fiction', price: 22.5, cover: 'https://covers.openlibrary.org/b/isbn/9780593653420-L.jpg', badge: 'Creativity', rating: 5 },
]

const sampleBooks = attachCovers(
  baseBooks.map((book, idx) => ({
    ...book,
    id: `sample-${idx + 1}`,
  })),
)

const teenBooks = [
  {
    id: 'teen-1',
    title: 'The Lightning Thief',
    author: 'Rick Riordan',
    category: 'Teens/Kids',
    price: 9.99,
    cover: 'https://covers.openlibrary.org/b/isbn/9780786838653-L.jpg',
    badge: 'Middle Grade',
    rating: 5,
  },
  {
    id: 'teen-2',
    title: 'A Wrinkle in Time',
    author: 'Madeleine L. Engle',
    category: 'Teens/Kids',
    price: 8.5,
    cover: 'https://covers.openlibrary.org/b/isbn/9780312367541-L.jpg',
    badge: 'Classic',
    rating: 4,
  },
  {
    id: 'teen-3',
    title: 'The Hate U Give',
    author: 'Angie Thomas',
    category: 'Teens/Kids',
    price: 12.99,
    cover: 'https://covers.openlibrary.org/b/isbn/9780062498533-L.jpg',
    badge: 'YA Fiction',
    rating: 5,
  },
  {
    id: 'teen-4',
    title: 'Amari and the Night Brothers',
    author: 'B. B. Alston',
    category: 'Teens/Kids',
    price: 11.5,
    cover: 'https://covers.openlibrary.org/b/isbn/9780062975164-L.jpg',
    badge: 'Fantasy',
    rating: 4,
  },
]

const audiobookBooks = [
  {
    id: 'audio-1',
    title: 'Project Hail Mary (Audio)',
    author: 'Andy Weir',
    category: 'Audiobooks',
    price: 19.99,
    cover: 'https://covers.openlibrary.org/b/isbn/9780593457370-L.jpg',
    badge: 'Audiobook',
    rating: 5,
  },
  {
    id: 'audio-2',
    title: 'Becoming (Audio)',
    author: 'Michelle Obama',
    category: 'Audiobooks',
    price: 17.99,
    cover: 'https://covers.openlibrary.org/b/isbn/9780525633754-L.jpg',
    badge: 'Audiobook',
    rating: 5,
  },
  {
    id: 'audio-3',
    title: 'Born a Crime (Audio)',
    author: 'Trevor Noah',
    category: 'Audiobooks',
    price: 16.5,
    cover: 'https://covers.openlibrary.org/b/isbn/9781478974248-L.jpg',
    badge: 'Audiobook',
    rating: 5,
  },
  {
    id: 'audio-4',
    title: 'The Dutch House (Audio)',
    author: 'Ann Patchett',
    category: 'Audiobooks',
    price: 14.99,
    cover: 'https://covers.openlibrary.org/b/isbn/9780062963703-L.jpg',
    badge: 'Audiobook',
    rating: 4,
  },
]

const toyItems = [
  {
    id: 'toy-1',
    title: 'Magnetic Tiles Starter Set',
    author: 'STEM Play',
    category: 'Toys & Games',
    price: 29.99,
    cover: 'https://images.unsplash.com/photo-1493673272479-a20888bcee10?auto=format&fit=crop&w=1200&q=80',
    badge: 'STEM',
    rating: 5,
  },
  {
    id: 'toy-2',
    title: 'Cozy Reading Light',
    author: 'Night Owl',
    category: 'Toys & Games',
    price: 15.0,
    cover: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    badge: 'Accessory',
    rating: 4,
  },
  {
    id: 'toy-3',
    title: 'Classic Chess Set',
    author: 'Board Games Co.',
    category: 'Toys & Games',
    price: 22.5,
    cover: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=1200&q=80',
    badge: 'Game',
    rating: 5,
  },
  {
    id: 'toy-4',
    title: 'Story Cubes',
    author: 'Imagination Lab',
    category: 'Toys & Games',
    price: 9.5,
    cover: 'https://images.unsplash.com/photo-1600267165506-2041cb9630c5?auto=format&fit=crop&w=1200&q=80',
    badge: 'Creative',
    rating: 4,
  },
]

async function fetchBooks() {
  const endpoint = `${API_BASE_URL}/api/books/`
  const response = await fetch(endpoint)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  const data = await response.json()

  return Array.isArray(data) ? data : data?.results || []
}

function decorateBooks(list) {
  if (!list.length) return sampleBooks

  const covers = coverPool.length ? coverPool : sampleBooks.map((b) => b.cover)
  return list.map((book, idx) => ({
    ...book,
    cover: book.cover || covers[idx % covers.length],
    badge: book.category || sampleBooks[idx % sampleBooks.length].category,
    price: book.price ?? sampleBooks[idx % sampleBooks.length].price,
  }))
}

function attachCovers(list) {
  const pool = coverPool.length ? coverPool : sampleBooks.map((b) => b.cover).filter(Boolean)
  return list.map((book, idx) => ({
    ...book,
    cover: book.cover || pool[idx % pool.length] || pool[0],
  }))
}

function dedupeByTitle(list) {
  const seen = new Set()
  return list.filter((item) => {
    const key = (item.title || '').toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function normalizeCategory(cat) {
  return (cat || '').trim().toLowerCase()
}

function isFictionCategory(cat) {
  const c = normalizeCategory(cat)
  if (!c) return false
  if (c.includes('non-fiction') || c.includes('nonfiction') || c.startsWith('non ')) return false
  const fictionKeywords = ['fiction', 'novel', 'fantasy', 'sci-fi', 'romance']
  return fictionKeywords.some((kw) => c.includes(kw))
}

function isNonfictionCategory(cat) {
  const c = normalizeCategory(cat)
  if (!c) return false
  if (c.includes('non-fiction') || c.includes('nonfiction') || c.startsWith('non ')) return true
  const nonfictionKeywords = ['memoir', 'biography', 'history', 'business', 'self-help', 'self help']
  return nonfictionKeywords.some((kw) => c.includes(kw))
}

function Section({ id, title, eyebrow, children, actionLabel }) {
  return (
    <section className="section" id={id}>
      <div className="section-head">
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2 className="section-title">{title}</h2>
        </div>
        {actionLabel ? <button className="ghost-btn" type="button">{actionLabel}</button> : null}
      </div>
      {children}
    </section>
  )
}

function App() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [counts, setCounts] = useState({})
  const [showCart, setShowCart] = useState(false)
  const [orderMessage, setOrderMessage] = useState('')
  const [wishlist, setWishlist] = useState({})
  const [showWishlist, setShowWishlist] = useState(false)

  const totalCount = useMemo(() => Object.values(counts).reduce((sum, n) => sum + n, 0), [counts])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const getKey = (book) => book.id || book.pk || book.title

  const countFor = (book) => {
    const key = getKey(book)
    return counts[key] ?? 0
  }

  const toggleWishlist = (book) => {
    const key = getKey(book)
    setWishlist((prev) => {
      const next = { ...prev }
      if (next[key]) {
        delete next[key]
      } else {
        next[key] = true
      }
      return next
    })
  }

  const increment = (book) => {
    const key = getKey(book)
    setCounts((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }))
  }

  const decrement = (book) => {
    const key = getKey(book)
    setCounts((prev) => {
      const next = (prev[key] ?? 0) - 1
      return { ...prev, [key]: Math.max(0, next) }
    })
  }

  const cartItems = useMemo(
    () =>
      books
        .filter((book) => countFor(book) > 0)
        .map((book) => ({ ...book, quantity: countFor(book), subtotal: (book.price ?? 0) * countFor(book) })),
    [books, counts],
  )

  const cartTotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.subtotal, 0), [cartItems])

  const checkout = () => {
    if (!cartItems.length) return
    setOrderMessage('Order placed! Check your email for the receipt.')
    setCounts({})
    setShowCart(false)
  }

  const load = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await fetchBooks()
      const decorated = decorateBooks(data)
      const merged = decorated.length >= 20 ? decorated : dedupeByTitle([...decorated, ...sampleBooks])
      setBooks(attachCovers(merged))
    } catch (err) {
      setError('Could not reach the API. Showing sample data.')
      setBooks(attachCovers(sampleBooks))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return books
    return books.filter((book) =>
      [book.title, book.author, book.category]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term)),
    )
  }, [books, query])

  const wishlistItems = useMemo(
    () => books.filter((book) => wishlist[getKey(book)]),
    [books, wishlist],
  )

  const featured = attachCovers(filtered.slice(0, 4))
  const fiction = attachCovers(filtered.filter((b) => isFictionCategory(b.category || b.badge)).slice(0, 12))
  const nonfiction = attachCovers(filtered.filter((b) => isNonfictionCategory(b.category || b.badge)).slice(0, 12))

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon" aria-hidden="true">📚</span>
          <span className="brand-name">Burt&apos;s Bookshelf</span>
        </div>
        <div className="top-actions">
          <input
            className="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for books, authors, or categories"
          />
          <button className="ghost-btn" type="button" onClick={load} disabled={loading}>
            {loading ? 'Refreshing…' : 'Search'}
          </button>
        </div>
        <div className="nav-actions">
          <button className="ghost-btn" type="button">My Account</button>
          <button className="ghost-btn wishlist-btn-top" type="button" onClick={() => setShowWishlist((prev) => !prev)}>
            Wishlist
            {wishlistItems.length > 0 ? (
              <span className="wishlist-badge" aria-label={`${wishlistItems.length} wishlisted`}>
                {wishlistItems.length}
              </span>
            ) : null}
          </button>
          <button className="ghost-btn cart-btn" type="button" onClick={() => setShowCart(true)}>
            Cart
            {totalCount > 0 ? <span className="cart-badge" aria-label={`${totalCount} books in cart`}>{totalCount}</span> : null}
          </button>
        </div>
      </header>

      <nav className="nav">
        <button className="nav-link active" type="button" onClick={() => scrollToSection('top')}>Home</button>
        <button className="nav-link" type="button" onClick={() => scrollToSection('fiction')}>Fiction</button>
        <button className="nav-link" type="button" onClick={() => scrollToSection('nonfiction')}>Non-Fiction</button>
        <button className="nav-link" type="button" onClick={() => scrollToSection('teens')}>Teens/Kids</button>
        <button className="nav-link" type="button" onClick={() => scrollToSection('audiobooks')}>Audiobooks</button>
        <button className="nav-link" type="button" onClick={() => scrollToSection('toys')}>Toys &amp; Games</button>
      </nav>

      {orderMessage ? <p className="success" role="status">{orderMessage}</p> : null}

      {showWishlist ? (
        <div className="wishlist-strip" aria-label="Wishlist">
          <div className="wishlist-head">
            <span className="eyebrow">Wishlist</span>
            <span className="wishlist-count">{wishlistItems.length} saved</span>
          </div>
          {wishlistItems.length ? (
            <div className="wishlist-chips">
              {wishlistItems.map((item) => (
                <button
                  key={`wish-${getKey(item)}`}
                  type="button"
                  className="wishlist-chip"
                  onClick={() => toggleWishlist(item)}
                >
                  <span className="chip-title">{item.title}</span>
                  <span aria-hidden="true">✕</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="muted wishlist-empty">Tap the heart on any book to save it here.</p>
          )}
        </div>
      ) : null}

      <div className="hero" id="top" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
        <div className="hero-overlay" />
        <div className="hero-body">
          <span className="hero-icon" aria-hidden="true">📖</span>
          <h1>Burt&apos;s Bookshelf</h1>
          <p>Your gateway to literary adventures.</p>
          <div className="hero-actions">
            <button className="primary-btn" type="button" onClick={() => scrollToSection('featured')}>
              Shop Featured
            </button>
            <button className="ghost-btn" type="button" onClick={() => scrollToSection('fiction')}>
              Browse Categories
            </button>
          </div>
          {error ? <p className="error" role="alert">{error}</p> : null}
        </div>
      </div>

      <Section id="featured" title="Featured Books" eyebrow="Curated picks" actionLabel="View all">
        {loading ? <p className="muted">Loading books…</p> : null}
        <div className="grid">
          {featured.map((book) => (
            <BookCard
              key={getKey(book)}
              book={book}
              wishlisted={Boolean(wishlist[getKey(book)])}
              onToggleWishlist={() => toggleWishlist(book)}
              count={countFor(book)}
              onInc={() => increment(book)}
              onDec={() => decrement(book)}
            />
          ))}
        </div>
      </Section>

      <Section id="fiction" title="Fiction" eyebrow="Captivating stories" actionLabel="See more">
        <div className="grid">
          {attachCovers(fiction.length ? fiction : sampleBooks.filter((b) => isFictionCategory(b.category || b.badge))).map((book, idx) => (
            <BookCard
              key={`fic-${getKey(book)}-${idx}`}
              book={book}
              wishlisted={Boolean(wishlist[getKey(book)])}
              onToggleWishlist={() => toggleWishlist(book)}
              count={countFor(book)}
              onInc={() => increment(book)}
              onDec={() => decrement(book)}
            />
          ))}
        </div>
      </Section>

      <Section id="nonfiction" title="Non-Fiction" eyebrow="Inspiring insights" actionLabel="See more">
        <div className="grid">
          {attachCovers(nonfiction.length ? nonfiction : sampleBooks.filter((b) => isNonfictionCategory(b.category || b.badge))).map((book, idx) => (
            <BookCard
              key={`nf-${getKey(book)}-${idx}`}
              book={book}
              wishlisted={Boolean(wishlist[getKey(book)])}
              onToggleWishlist={() => toggleWishlist(book)}
              count={countFor(book)}
              onInc={() => increment(book)}
              onDec={() => decrement(book)}
            />
          ))}
        </div>
      </Section>

      <Section id="teens" title="Teens/Kids" eyebrow="For young readers" actionLabel="See more">
        <div className="grid">
          {teenBooks.map((book) => (
            <BookCard
              key={`teen-${getKey(book)}`}
              book={book}
              wishlisted={Boolean(wishlist[getKey(book)])}
              onToggleWishlist={() => toggleWishlist(book)}
              count={countFor(book)}
              onInc={() => increment(book)}
              onDec={() => decrement(book)}
            />
          ))}
        </div>
      </Section>

      <Section id="audiobooks" title="Audiobooks" eyebrow="Listen on the go" actionLabel="See more">
        <div className="grid">
          {audiobookBooks.map((book) => (
            <BookCard
              key={`audio-${getKey(book)}`}
              book={book}
              wishlisted={Boolean(wishlist[getKey(book)])}
              onToggleWishlist={() => toggleWishlist(book)}
              count={countFor(book)}
              onInc={() => increment(book)}
              onDec={() => decrement(book)}
            />
          ))}
        </div>
      </Section>

      <Section id="toys" title="Toys &amp; Games" eyebrow="Gifts and play" actionLabel="See more">
        <div className="grid">
          {toyItems.map((book) => (
            <BookCard
              key={`toy-${getKey(book)}`}
              book={book}
              wishlisted={Boolean(wishlist[getKey(book)])}
              onToggleWishlist={() => toggleWishlist(book)}
              count={countFor(book)}
              onInc={() => increment(book)}
              onDec={() => decrement(book)}
            />
          ))}
        </div>
      </Section>

      {showCart ? <div className="cart-overlay" onClick={() => setShowCart(false)} /> : null}

      <aside className={`cart-drawer ${showCart ? 'open' : ''}`} role="dialog" aria-label="Shopping cart">
        <div className="cart-header">
          <div>
            <p className="eyebrow">Shopping Cart</p>
            <h3 className="cart-title">Your picks ({totalCount})</h3>
          </div>
          <button className="ghost-btn" type="button" onClick={() => setShowCart(false)}>Close</button>
        </div>

        {cartItems.length ? (
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={getKey(item)} className="cart-item">
                <img src={item.cover} alt={`${item.title || 'Book'} cover`} className="cart-thumb" />
                <div className="cart-item-details">
                  <p className="book-title cart-item-title">{item.title}</p>
                  <p className="book-author cart-item-author">{item.author || 'Unknown author'}</p>
                  <div className="cart-qty-row">
                    <div className="counter">
                      <button type="button" className="counter-btn" onClick={() => decrement(item)} aria-label="Decrease quantity">
                        ↓
                      </button>
                      <span className="counter-value" aria-live="polite">{item.quantity}</span>
                      <button type="button" className="counter-btn" onClick={() => increment(item)} aria-label="Increase quantity">
                        ↑
                      </button>
                    </div>
                    <span className="cart-subtotal">${item.subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted empty-cart">Your cart is empty.</p>
        )}

        <div className="cart-footer">
          <div className="cart-total-row">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button className="primary-btn" type="button" onClick={checkout} disabled={!cartItems.length}>
            Place Order
          </button>
        </div>
      </aside>
    </div>
  )
}

export default App
