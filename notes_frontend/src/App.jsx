import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SearchBar from './components/SearchBar';
import { debounce, filterNotes } from './utils/search';

// Simulated initial notes for demo. Replace with real fetch from backend or store.
const demoNotes = [
  { id: 1, title: 'Grocery list', content: 'Milk, Eggs, Bread, Coffee' },
  { id: 2, title: 'Project ideas', content: 'Build a notes app with search and tags' },
  { id: 3, title: 'Meeting notes', content: 'Discuss roadmap and timelines' },
  { id: 4, title: 'Books to read', content: 'The Pragmatic Programmer; Clean Code' }
];

function useQueryParam(key) {
  const getParam = () => new URLSearchParams(window.location.search).get(key) || '';
  const [value, setValue] = useState(getParam);

  useEffect(() => {
    const current = getParam();
    if (current !== value) setValue(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.search]);

  // PUBLIC_INTERFACE
  const update = useCallback((next) => {
    /** Update a single query parameter in the URL without reloading. */
    const url = new URL(window.location.href);
    if (next) {
      url.searchParams.set(key, next);
    } else {
      url.searchParams.delete(key);
    }
    window.history.replaceState({}, '', url.toString());
    setValue(next || '');
  }, [key]);

  return [value, update];
}

export default function App() {
  const [notes, setNotes] = useState(demoNotes);
  const [query, setQuery] = useQueryParam('q');
  const [loading, setLoading] = useState(false);
  const [remoteSupported, setRemoteSupported] = useState(true);
  const abortRef = useRef(null);

  // Debounced backend search call, with fallback to client-side filter when unavailable or fails.
  const performSearch = useCallback(async (term) => {
    if (!remoteSupported || !term) {
      return; // Will rely on client-side filter
    }
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    try {
      const url = new URL('/notes', window.location.origin);
      url.searchParams.set('search', term);
      const res = await fetch(url.toString(), { signal: controller.signal });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      // Expecting array of notes
      if (Array.isArray(data)) {
        // Do not mutate original notes; we display filtered via derived list below.
        // Optionally, we could keep remote results separate.
        // For now, indicate remote works by setting a flag, but still derive filtered list from data.
        setRemoteSupported(true);
        // We could store remote results for rendering directly:
        setRemoteResults(data);
      } else {
        throw new Error('Invalid response');
      }
    } catch (e) {
      // Fallback to client-side filtering
      setRemoteSupported(false);
    } finally {
      setLoading(false);
    }
  }, [remoteSupported]);

  const [remoteResults, setRemoteResults] = useState(null);

  // Debounce the remote search
  const debouncedRemoteSearch = useMemo(() => debounce(performSearch, 300), [performSearch]);

  // Kick off remote search when query changes (if supported)
  useEffect(() => {
    if (query) {
      debouncedRemoteSearch(query);
    } else {
      setRemoteResults(null);
    }
  }, [query, debouncedRemoteSearch]);

  // Derived list based on query.
  const visibleNotes = useMemo(() => {
    // Prefer remote results when available for the current query
    if (remoteResults && query) {
      return remoteResults;
    }
    return filterNotes(notes, query);
  }, [notes, remoteResults, query]);

  // Input change handler with local debounce for UI responsiveness without spamming history
  const onSearchChange = useMemo(() => debounce((val) => setQuery(val), 250), [setQuery]);

  // Initialize from ?q is handled by useQueryParam hook.

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-title" style={{ color: 'var(--color-primary)' }}>Notes</div>
        <div style={{ flex: 1 }} />
        <SearchBar value={query} onChange={onSearchChange} />
      </header>

      <main className="container">
        {loading && <div style={{ color: 'var(--color-primary)' }}>Searching…</div>}
        <section className="notes-grid" aria-live="polite">
          {visibleNotes.map(n => (
            <article key={n.id} className="note-card">
              <h3 className="note-title">{n.title}</h3>
              <p className="note-content">{n.content}</p>
            </article>
          ))}
          {visibleNotes.length === 0 && (
            <div style={{ color: '#6b7280' }}>
              No notes found{query ? ` for “${query}”` : ''}.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
