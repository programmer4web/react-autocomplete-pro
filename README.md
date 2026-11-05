# React Autocomplete Pro Component

[Full Documentation](https://evaficy.com/autocompletepro-advanced-react-autocomplete-component/)

> Built by **[EVAFICY](https://evaficy.com/?utm_source=oss&utm_medium=readme&utm_campaign=react-autocomplete-pro)**, a web development company from Iasi, Romania, with 10+ years building React, TypeScript and Node.js applications. Need a custom component or a full web application? [Contact EVAFICY](https://evaficy.com/contact-evaficy/?utm_source=oss&utm_medium=readme&utm_campaign=react-autocomplete-pro).

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
npm install react-autocomplete-pro lucide-react
# or
yarn add react-autocomplete-pro lucide-react
```

Peer dependencies: `react` and `react-dom` (16.8 or higher) and `lucide-react` (used for the icons).

## Styling

The styles ship as a separate CSS file. Import it once, for example in your app entry or root component:

```javascript
import 'react-autocomplete-pro/dist/index.css';
```

The stylesheet contains only the classes the component uses. It doesn't include a global CSS reset, so it won't change the rest of your page.

## Quick Start

### Basic Usage

```tsx
import React, { useState } from 'react';
import { AutocompletePro, AutocompleteOption } from 'react-autocomplete-pro';
import 'react-autocomplete-pro/dist/index.css';

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

## Changelog

- **1.1.1** - README: EVAFICY credit and contact links.
- **1.1.0** - The stylesheet (`dist/index.css`) now contains the component's styles; previous versions shipped an unbuilt Tailwind import, so the component appeared unstyled outside Tailwind projects. Screen reader label on the tag remove button. Build tooling updated.
- **1.0.8** - Funding link.

## License

MIT License

---

Made by [EVAFICY](https://evaficy.com/?utm_source=oss&utm_medium=readme&utm_campaign=react-autocomplete-pro): custom React & Node.js development, full-stack applications and AI-powered QA with [Evaficy Smart Test](https://app.evaficy.com/?utm_source=oss&utm_medium=readme&utm_campaign=react-autocomplete-pro). Need a new component or a full project built? [Get in touch](https://evaficy.com/contact-evaficy/?utm_source=oss&utm_medium=readme&utm_campaign=react-autocomplete-pro).

More open-source components: [live demos](https://components.evaficy.com) · [GitHub](https://github.com/programmer4web) · [npm](https://www.npmjs.com/~evaficy)
