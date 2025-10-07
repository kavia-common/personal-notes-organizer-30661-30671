//
// Debounce utility and filterNotes pure function.
//

// PUBLIC_INTERFACE
export function debounce(fn, wait = 250) {
  /** Debounce a function call by wait ms. */
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

// PUBLIC_INTERFACE
export function filterNotes(notes, term) {
  /** Return a filtered copy of notes matching term in title or content (case-insensitive). */
  if (!Array.isArray(notes) || !term) return notes || [];
  const q = term.toLowerCase();
  return notes.filter(n => {
    const title = (n.title || '').toLowerCase();
    const content = (n.content || '').toLowerCase();
    return title.includes(q) || content.includes(q);
  });
}
