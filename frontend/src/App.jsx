import { useEffect, useMemo, useState } from 'react'
import './App.css'
import BookCard from './components/BookCard'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')

// Hero / featured visual assets (replace with your own if desired)
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1800&q=80'

const sampleBooks = [
  {
    id: 'sample-1',
    title: 'The Shining',
    author: 'Stephen King',
    category: 'Fiction',
    price: 18.99,
    cover: 'https://images.unsplash.com/photo-1541961017774-22349e4a1271?auto=format&fit=crop&w=600&q=80',
    badge: 'Fiction',
    rating: 5,
  },
  {
    id: 'sample-2',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Non-Fiction',
    price: 27.0,
    cover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80',
    badge: 'Non-Fiction',
    rating: 5,
  },
  {
    id: 'sample-3',
    title: 'Bad Blood',
    author: 'John Carreyrou',
    category: 'Non-Fiction',
    price: 18.99,
    cover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80',
    badge: 'Non-Fiction',
    rating: 4,
  },
  {
    id: 'sample-4',
    title: 'Circe',
    author: 'Madeline Miller',
    category: 'Fiction',
    price: 19.5,
    cover: 'https://images.unsplash.com/photo-1541961017774-22349e4a1271?auto=format&fit=crop&w=600&q=80',
    badge: 'Fiction',
    rating: 5,
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

  const covers = sampleBooks.map((b) => b.cover)
  return list.map((book, idx) => ({
    ...book,
    cover: book.cover || covers[idx % covers.length],
    badge: book.category || sampleBooks[idx % sampleBooks.length].category,
    price: book.price ?? sampleBooks[idx % sampleBooks.length].price,
  }))
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

  const totalCount = useMemo(() => Object.values(counts).reduce((sum, n) => sum + n, 0), [counts])

  const getKey = (book) => book.id || book.pk || book.title

  const countFor = (book) => {
    const key = getKey(book)
    return counts[key] ?? 0
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

  const load = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await fetchBooks()
      setBooks(decorateBooks(data))
    } catch (err) {
      setError('Could not reach the API. Showing sample data.')
      setBooks(sampleBooks)
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

  const featured = filtered.slice(0, 4)
  const fiction = filtered.filter((b) => (b.category || '').toLowerCase().includes('fiction')).slice(0, 6)
  const nonfiction = filtered.filter((b) => (b.category || '').toLowerCase().includes('non')).slice(0, 6)

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
          <button className="ghost-btn" type="button">Wishlist</button>
          <button className="ghost-btn cart-btn" type="button">
            Cart
            {totalCount > 0 ? <span className="cart-badge" aria-label={`${totalCount} books in cart`}>{totalCount}</span> : null}
          </button>
        </div>
      </header>

      <nav className="nav">
        <a className="nav-link active" href="#top">Home</a>
        <a className="nav-link" href="#fiction">Fiction</a>
        <a className="nav-link" href="#nonfiction">Non-Fiction</a>
        <a className="nav-link" href="#teens">Teens/Kids</a>
        <a className="nav-link" href="#audiobooks">Audiobooks</a>
        <a className="nav-link" href="#toys">Toys &amp; Games</a>
      </nav>

      <div className="hero" id="top" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
        <div className="hero-overlay" />
        <div className="hero-body">
          <span className="hero-icon" aria-hidden="true">📖</span>
          <h1>Burt&apos;s Bookshelf</h1>
          <p>Your gateway to literary adventures.</p>
          <div className="hero-actions">
            <button className="primary-btn" type="button">Shop Featured</button>
            <button className="ghost-btn" type="button">Browse Categories</button>
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
              count={countFor(book)}
              onInc={() => increment(book)}
              onDec={() => decrement(book)}
            />
          ))}
        </div>
      </Section>

      <Section id="fiction" title="Fiction" eyebrow="Captivating stories" actionLabel="See more">
        <div className="grid">
          {(fiction.length ? fiction : sampleBooks).map((book) => (
            <BookCard
              key={`fic-${getKey(book)}`}
              book={book}
              count={countFor(book)}
              onInc={() => increment(book)}
              onDec={() => decrement(book)}
            />
          ))}
        </div>
      </Section>

      <Section id="nonfiction" title="Non-Fiction" eyebrow="Inspiring insights" actionLabel="See more">
        <div className="grid">
          {(nonfiction.length ? nonfiction : sampleBooks.filter((b) => b.badge === 'Non-Fiction')).map((book) => (
            <BookCard
              key={`nf-${getKey(book)}`}
              book={book}
              count={countFor(book)}
              onInc={() => increment(book)}
              onDec={() => decrement(book)}
            />
          ))}
        </div>
      </Section>

      <Section id="teens" title="Teens/Kids" eyebrow="For young readers" actionLabel="See more">
        <p className="muted">Coming soon — browse by age and interests.</p>
      </Section>

      <Section id="audiobooks" title="Audiobooks" eyebrow="Listen on the go" actionLabel="See more">
        <p className="muted">Coming soon — add your favorite listens here.</p>
      </Section>

      <Section id="toys" title="Toys &amp; Games" eyebrow="Gifts and play" actionLabel="See more">
        <p className="muted">Coming soon — toys and games collection.</p>
      </Section>
    </div>
  )
}

export default App
