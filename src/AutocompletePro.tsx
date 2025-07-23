import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, X, ChevronDown, Star, Clock, TrendingUp, MapPin } from 'lucide-react';
import { AutocompleteOption, SearchConfig, AdvancedAutocompleteProps } from './types';

// Default search configuration
const DEFAULT_SEARCH_CONFIG: SearchConfig = {
  algorithm: 'hybrid',
  fuzzyThreshold: 0.5,
  minQueryLength: 1,
  maxResults: 10,
  debounceMs: 300,
  caseSensitive: false,
  accentSensitive: false,
};

// Fuzzy search implementation
const fuzzyMatch = (query: string, text: string, threshold: number): boolean => {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  if (textLower.includes(queryLower)) return true;
  
  // Split text into words and check fuzzy match against each word
  const words = textLower.split(/\s+/);
  
  for (const word of words) {
    // Check if query fuzzy matches this word
    const distance = levenshteinDistance(queryLower, word);
    const maxLength = Math.max(queryLower.length, word.length);
    const similarity = 1 - distance / maxLength;
    
    if (similarity >= threshold) return true;
    
    // Also check substrings for partial matches
    if (word.length >= queryLower.length) {
      for (let i = 0; i <= word.length - queryLower.length; i++) {
        const substring = word.substring(i, i + queryLower.length);
        const substringDistance = levenshteinDistance(queryLower, substring);
        const substringSimilarity = 1 - substringDistance / queryLower.length;
        
        if (substringSimilarity >= threshold) return true;
      }
    }
  }
  
  return false;
};

const levenshteinDistance = (a: string, b: string): number => {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }
  
  return matrix[b.length][a.length];
};

// Highlight matching text
const highlightMatch = (text: string, query: string): React.ReactNode => {
  if (!query) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="bg-blue-200 text-blue-900 rounded px-1">
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    )
  );
};

// Main component
const AdvancedAutocomplete: React.FC<AdvancedAutocompleteProps> = ({
  options = [],
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  multiple = false,
  searchConfig = {},
  renderOption,
  renderTag,
  groupBy,
  filterBy = ['label', 'value', 'description'],
  showCategories = true,
  showRecent = true,
  showTrending = true,
  className = "",
  disabled = false,
  loading = false
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [filteredOptions, setFilteredOptions] = useState<AutocompleteOption[]>([]);
  const [recentSearches, setRecentSearches] = useState<AutocompleteOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  
  const config = useMemo(() => ({ ...DEFAULT_SEARCH_CONFIG, ...searchConfig }), [searchConfig]);
  
  // Get selected values as array
  const selectedValues = useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);
  
  // Filter and search logic
  const filterOptions = useCallback((searchQuery: string, availableOptions: AutocompleteOption[]) => {
    if (!searchQuery || searchQuery.length < config.minQueryLength) {
      // Show recent and trending when no query
      const recent = showRecent ? availableOptions.filter(opt => opt.recent).slice(0, 3) : [];
      const trending = showTrending ? availableOptions.filter(opt => opt.trending).slice(0, 3) : [];
      const popular = availableOptions.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 4);
      
      return [...recent, ...trending, ...popular]
        .filter((opt, index, arr) => arr.findIndex(o => o.id === opt.id) === index)
        .slice(0, config.maxResults);
    }
    
    const filtered = availableOptions.filter(option => {
      const searchText = filterBy.map(field => option[field as keyof AutocompleteOption] || '').join(' ');
      
      switch (config.algorithm) {
        case 'exact':
          return config.caseSensitive 
            ? searchText.includes(searchQuery)
            : searchText.toLowerCase().includes(searchQuery.toLowerCase());
        case 'fuzzy':
          return fuzzyMatch(searchQuery, searchText, config.fuzzyThreshold);
        case 'semantic':
          // Simple semantic matching - in real implementation, use embeddings
          return searchText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 searchQuery.toLowerCase().split(' ').some(word => 
                   searchText.toLowerCase().includes(word)
                 );
        case 'hybrid':
        default:
          return searchText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 fuzzyMatch(searchQuery, searchText, config.fuzzyThreshold);
      }
    });
    
    return filtered
      .sort((a, b) => {
        // Prioritize exact matches
        const aExact = a.label.toLowerCase().startsWith(searchQuery.toLowerCase());
        const bExact = b.label.toLowerCase().startsWith(searchQuery.toLowerCase());
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Then by popularity
        return (b.popularity || 0) - (a.popularity || 0);
      })
      .slice(0, config.maxResults);
  }, [config, filterBy, showRecent, showTrending]);
  
  // Debounced search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (onSearch && searchQuery.length >= config.minQueryLength) {
      setIsLoading(true);
      try {
        const results = await onSearch(searchQuery);
        setFilteredOptions(filterOptions(searchQuery, results));
      } catch (error) {
        console.error('Search error:', error);
        setFilteredOptions([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setFilteredOptions(filterOptions(searchQuery, options));
    }
  }, [onSearch, config.minQueryLength, filterOptions, options]);
  
  // Handle input change with debouncing
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setHighlightedIndex(-1);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      performSearch(newQuery);
    }, config.debounceMs);
  }, [performSearch, config.debounceMs]);
  
  // Handle option selection
  const handleSelect = useCallback((option: AutocompleteOption) => {
    if (multiple) {
      const newSelection = selectedValues.some(v => v.id === option.id)
        ? selectedValues.filter(v => v.id !== option.id)
        : [...selectedValues, option];
      onChange?.(newSelection);
    } else {
      onChange?.(option);
      setQuery(option.label);
      setIsOpen(false);
    }
    
    // Add to recent searches
    setRecentSearches(prev => {
      const filtered = prev.filter(r => r.id !== option.id);
      return [{ ...option, recent: true }, ...filtered].slice(0, 5);
    });
  }, [multiple, selectedValues, onChange]);
  
  // Handle tag removal
  const handleRemoveTag = useCallback((optionId: string) => {
    if (multiple) {
      const newSelection = selectedValues.filter(v => v.id !== optionId);
      onChange?.(newSelection);
    }
  }, [multiple, selectedValues, onChange]);
  
  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  }, [isOpen, highlightedIndex, filteredOptions, handleSelect]);
  
  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Initial load
  useEffect(() => {
    performSearch('');
  }, []);
  
  // Group options by category
  const groupedOptions = useMemo(() => {
    if (!groupBy) return [{ category: '', options: filteredOptions }];
    
    const groups = filteredOptions.reduce((acc, option) => {
      const category = groupBy(option) || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(option);
      return acc;
    }, {} as Record<string, AutocompleteOption[]>);
    
    return Object.entries(groups).map(([category, options]) => ({
      category,
      options
    }));
  }, [filteredOptions, groupBy]);
  
  // Default option renderer
  const defaultRenderOption = (option: AutocompleteOption, isHighlighted: boolean) => (
    <div className={`px-4 py-3 cursor-pointer transition-colors ${
      isHighlighted ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50'
    }`}>
      <div className="flex items-center space-x-3">
        {option.image && (
          <img 
            src={option.image} 
            alt={option.label}
            className="w-8 h-8 rounded object-cover"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-medium">
              {highlightMatch(option.label, query)}
            </span>
            {option.trending && (
              <TrendingUp className="w-3 h-3 text-orange-500" />
            )}
            {option.recent && (
              <Clock className="w-3 h-3 text-blue-500" />
            )}
          </div>
          {option.description && (
            <p className="text-sm text-gray-600 truncate">
              {highlightMatch(option.description, query)}
            </p>
          )}
          {option.category && showCategories && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 mt-1">
              {option.category}
            </span>
          )}
        </div>
        {option.popularity && (
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs">{option.popularity}</span>
          </div>
        )}
      </div>
    </div>
  );
  
  // Default tag renderer
  const defaultRenderTag = (option: AutocompleteOption, onRemove: () => void) => (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
      {option.image && (
        <img 
          src={option.image} 
          alt={option.label}
          className="w-4 h-4 rounded-full mr-2"
        />
      )}
      {option.label}
      <button
        onClick={onRemove}
        className="ml-2 hover:text-blue-600"
        type="button"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
  
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input Field */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
              disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
            }`}
          />
          <div className="absolute right-3 flex items-center space-x-2">
            {(loading || isLoading) && (
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            )}
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`} />
          </div>
        </div>
        
        {/* Selected Tags (Multiple Mode) */}
        {multiple && selectedValues.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedValues.map(option => 
              renderTag ? renderTag(option, () => handleRemoveTag(option.id)) : 
              defaultRenderTag(option, () => handleRemoveTag(option.id))
            )}
          </div>
        )}
      </div>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              {isLoading ? 'Searching...' : 'No results found'}
            </div>
          ) : (
            <div ref={listRef} className="overflow-y-auto max-h-96">
              {groupedOptions.map(({ category, options }, groupIndex) => (
                <div key={category || groupIndex}>
                  {category && showCategories && (
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b">
                      {category}
                    </div>
                  )}
                  {options.map((option, optionIndex) => {
                    const globalIndex = filteredOptions.findIndex(o => o.id === option.id);
                    return (
                      <div key={option.id}>
                        <div
                          onClick={() => handleSelect(option)}
                          className="border-b border-gray-100 last:border-b-0"
                        >
                          {renderOption ? 
                            renderOption(option, globalIndex === highlightedIndex) :
                            defaultRenderOption(option, globalIndex === highlightedIndex)
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedAutocomplete;
