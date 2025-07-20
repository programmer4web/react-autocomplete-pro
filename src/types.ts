export interface AutocompleteOption {
  id: string;
  label: string;
  value: string;
  category?: string;
  description?: string;
  image?: string;
  metadata?: Record<string, any>;
  popularity?: number;
  recent?: boolean;
  trending?: boolean;
}

export interface SearchConfig {
  algorithm: 'fuzzy' | 'exact' | 'semantic' | 'hybrid';
  fuzzyThreshold: number;
  minQueryLength: number;
  maxResults: number;
  debounceMs: number;
  caseSensitive: boolean;
  accentSensitive: boolean;
}

export interface AdvancedAutocompleteProps {
  options: AutocompleteOption[];
  value?: AutocompleteOption | AutocompleteOption[];
  onChange?: (selected: AutocompleteOption | AutocompleteOption[]) => void;
  onSearch?: (query: string) => Promise<AutocompleteOption[]>;
  placeholder?: string;
  multiple?: boolean;
  searchConfig?: Partial<SearchConfig>;
  renderOption?: (option: AutocompleteOption, isHighlighted: boolean) => React.ReactNode;
  renderTag?: (option: AutocompleteOption, onRemove: () => void) => React.ReactNode;
  groupBy?: (option: AutocompleteOption) => string;
  filterBy?: string[];
  showCategories?: boolean;
  showRecent?: boolean;
  showTrending?: boolean;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}