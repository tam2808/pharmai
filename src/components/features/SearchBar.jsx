import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { getSearchSuggestions } from '../../services/drugApi';
import { useDebounce } from '../../hooks/useDebounce';
import { cn } from '../../utils/helpers';

/**
 * SearchBar - Thanh tìm kiếm thông minh có gợi ý autocomplete
 * bo 8px, shadow-hover, debounce 400ms
 */
export default function SearchBar({ placeholder = 'Tìm kiếm tên thuốc, hoạt chất...', className }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const response = await getSearchSuggestions(debouncedQuery);
        setSuggestions(response.data);
        setIsOpen(true);
      } catch (error) {
        console.error('Lỗi khi lấy gợi ý:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion.name);
    setIsOpen(false);
    navigate(`/drug/${suggestion.id}`);
  };

  return (
    <div ref={containerRef} className={cn('relative w-full z-20', className)}>
      <form onSubmit={handleSearch} className="relative flex items-center">
        <div className="absolute left-4 text-text-secondary">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className={cn(
            'w-full bg-surface border border-border text-text-primary pl-12 pr-4 py-5 rounded-lg text-body',
            'outline-none transition-all duration-300',
            'focus:border-primary focus:shadow-[0_0_0_3px_rgba(11,61,46,0.1)]'
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 text-text-secondary hover:text-text-primary text-sm font-medium"
          >
            Xóa
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-surface border border-border rounded-xl shadow-hover overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="py-2">
            {suggestions.map((suggestion) => (
              <li key={suggestion.id}>
                <button
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full text-left px-5 py-3 hover:bg-primary-light transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-text-primary text-sm">
                      {suggestion.name}
                    </p>
                    <p className="text-xs text-text-secondary font-mono mt-0.5">
                      {suggestion.activeIngredient}
                    </p>
                  </div>
                  <span className="text-xs text-text-secondary font-medium">Chi tiết →</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
