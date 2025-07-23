# React Autocomplete Pro Component

[Full Documentation](https://evaficy.com/autocompletepro-advanced-react-autocomplete-component/)

A feature-rich, highly customizable React autocomplete component with advanced search capabilities and rich user experiences.

## Features

- **Advanced Search Algorithms**: Fuzzy, exact, semantic, and hybrid matching
- **Rich Visual Interface**: Images, descriptions, categories, and trending indicators
- **Performance Optimized**: Debounced search, memoized calculations, efficient rendering
- **Multi-Select Support**: Elegant tag management with custom renderers
- **Async Data Loading**: Built-in support for remote data fetching
- **Fully Customizable**: Custom option/tag renderers, flexible styling
- **TypeScript Support**: Complete type safety and IntelliSense
- **Keyboard Navigation**: Full accessibility with arrow keys, enter, escape

## Installation

```bash
npm install react-autocomplete-pro
# or
yarn add react-autocomplete-pro
```

## Quick Start

### Basic Usage

```tsx
import React, { useState } from 'react';
import { AutocompletePro, AutocompleteOption } from 'react-autocomplete-pro';

const options: AutocompleteOption[] = [
  { id: '1', label: 'iPhone 15 Pro', value: 'iphone-15-pro' },
  { id: '2', label: 'Samsung Galaxy S24', value: 'samsung-s24' },
  { id: '3', label: 'MacBook Pro M3', value: 'macbook-pro-m3' }
];

function App() {
  const [selected, setSelected] = useState<AutocompleteOption | undefined>();

  return (
    <AutocompletePro
      options={options}
      value={selected}
      onChange={setSelected}
      placeholder="Search products..."
    />
  );
}
```

### Multi-Select with Categories

```tsx
<AutocompletePro
  options={options}
  value={selectedItems}
  onChange={setSelectedItems}
  multiple={true}
  showCategories={true}
  showTrending={true}
  groupBy={(option) => option.category}
  placeholder="Select multiple products..."
/>
```

### Fuzzy Search with Typo Tolerance

```tsx
<AutocompletePro
  options={options}
  searchConfig={{
    algorithm: 'fuzzy',
    fuzzyThreshold: 0.5
  }}
  placeholder="Try typos: 'macbok', 'ipone'..."
/>
```

### Async Search

```tsx
const handleAsyncSearch = async (query: string): Promise<AutocompleteOption[]> => {
  const response = await fetch(`/api/search?q=${query}`);
  return response.json();
};

<AutocompletePro
  options={[]}
  onSearch={handleAsyncSearch}
  searchConfig={{
    debounceMs: 300,
    minQueryLength: 2
  }}
  placeholder="Type to search..."
/>
```

## Key Props

| Prop | Type | Description |
|------|------|-------------|
| `options` | `AutocompleteOption[]` | Static options array |
| `value` | `AutocompleteOption \| AutocompleteOption[]` | Selected value(s) |
| `onChange` | `(selected) => void` | Selection change handler |
| `onSearch` | `(query: string) => Promise<AutocompleteOption[]>` | Async search function |
| `multiple` | `boolean` | Enable multi-select mode |
| `searchConfig` | `SearchConfig` | Search algorithm configuration |
| `renderOption` | `(option, isHighlighted) => ReactNode` | Custom option renderer |
| `showCategories` | `boolean` | Show category grouping |
| `showTrending` | `boolean` | Show trending indicators |

## Search Algorithms

- **`exact`**: Traditional substring matching
- **`fuzzy`**: Levenshtein distance-based matching for typos
- **`semantic`**: Word-based matching across multiple fields  
- **`hybrid`**: Combines exact and fuzzy for optimal results

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## License

MIT License
