import React, { useEffect, useState, useCallback } from 'react';
import { getChefs } from '../services/api';
import ChefCard from '../components/ChefCard';
import './Chefs.css';

const CUISINES = ['North Indian', 'South Indian', 'Chinese', 'Continental', 'Mughlai', 'Italian', 'Bengali', 'Gujarati'];

export default function Chefs() {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ city: '', cuisine: '', minRating: '', maxPrice: '', sort: '-rating' });

  const fetchChefs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getChefs({ ...filters, page, size: 9 });
      setChefs(res.data.chefs || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchChefs(); }, [fetchChefs]);

  const handleFilter = (key, val) => {
    setFilters((f) => ({ ...f, [key]: val }));
    setPage(1);
  };

  return (
    <div className="chefs-page">
      <div className="chefs-hero">
        <div className="container">
          <h1>Find Your Perfect Chef</h1>
          <p>Browse {total} verified professional chefs near you</p>
          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍  Search by city..."
              value={filters.city}
              onChange={(e) => handleFilter('city', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container chefs-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <h3>Filters</h3>

          <div className="filter-group">
            <label>Cuisine</label>
            <select value={filters.cuisine} onChange={(e) => handleFilter('cuisine', e.target.value)}>
              <option value="">All Cuisines</option>
              {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Min Rating</label>
            <select value={filters.minRating} onChange={(e) => handleFilter('minRating', e.target.value)}>
              <option value="">Any Rating</option>
              <option value="4">4★ & above</option>
              <option value="4.5">4.5★ & above</option>
              <option value="5">5★ only</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Max Price / Day</label>
            <select value={filters.maxPrice} onChange={(e) => handleFilter('maxPrice', e.target.value)}>
              <option value="">Any Price</option>
              <option value="1500">Under ₹1,500</option>
              <option value="3000">Under ₹3,000</option>
              <option value="5000">Under ₹5,000</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select value={filters.sort} onChange={(e) => handleFilter('sort', e.target.value)}>
              <option value="-rating">Top Rated</option>
              <option value="pricePerDay">Price: Low to High</option>
              <option value="-pricePerDay">Price: High to Low</option>
              <option value="-createdAt">Newest First</option>
            </select>
          </div>

          <button className="btn-outline filter-reset" onClick={() => setFilters({ city: '', cuisine: '', minRating: '', maxPrice: '', sort: '-rating' })}>
            Reset Filters
          </button>
        </aside>

        {/* Chef Grid */}
        <main className="chefs-main">
          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : chefs.length === 0 ? (
            <div className="no-results">
              <span>👨‍🍳</span>
              <h3>No chefs found</h3>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="results-count">{total} chefs available</div>
              <div className="chefs-results-grid">
                {chefs.map((chef) => <ChefCard key={chef._id} chef={chef} />)}
              </div>
              {/* Pagination */}
              <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-outline page-btn">← Prev</button>
                <span>Page {page}</span>
                <button disabled={chefs.length < 9} onClick={() => setPage(p => p + 1)} className="btn-outline page-btn">Next →</button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
