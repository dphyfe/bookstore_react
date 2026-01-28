import React from 'react'

function Rating({ value = 0 }) {
    const stars = Math.round(value)
    return (
        <div className="rating" aria-label={`${stars} out of 5`}>
            {'★★★★★'.slice(0, stars)}
        </div>
    )
}

function BookCard({ book, count = 0, onInc, onDec }) {
    const disableDec = count <= 0

    return (
        <article className="book-card">
            <div className="cover" style={{ backgroundImage: `url(${book.cover})` }}>
                <span className="badge">{book.badge || book.category || 'Book'}</span>
            </div>
            <div className="book-body">
                <p className="book-title">{book.title}</p>
                <p className="book-author">{book.author || 'Unknown author'}</p>
                <div className="meta-row">
                    <Rating value={book.rating || 5} />
                    <p className="book-price">${Number(book.price ?? 0).toFixed(2)}</p>
                </div>
                <div className="counter">
                    <button type="button" className="counter-btn" onClick={onDec} disabled={disableDec} aria-label="Decrease quantity">
                        ↓
                    </button>
                    <span className="counter-value" aria-live="polite">{count}</span>
                    <button type="button" className="counter-btn" onClick={onInc} aria-label="Increase quantity">
                        ↑
                    </button>
                </div>
            </div>
        </article>
    )
}

export default BookCard
