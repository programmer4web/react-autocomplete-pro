import React, { useState } from 'react';
import AdvancedAutocomplete from './AutocompletePro';
import { AutocompleteOption } from './types';

// Demo Component
const AutocompleteDemo: React.FC = () => {
  const [selectedSingle, setSelectedSingle] = useState<AutocompleteOption | undefined>();
  const [selectedMultiple, setSelectedMultiple] = useState<AutocompleteOption[]>([]);
  
  // Sample data
  const sampleOptions: AutocompleteOption[] = [
    { 
      id: '1', 
      label: 'iPhone 15 Pro', 
      value: 'iphone-15-pro',
      category: 'Smartphones',
      description: 'Latest Apple smartphone with titanium design',
      image: 'https://via.placeholder.com/32',
      popularity: 95,
      trending: true
    },
    { 
      id: '2', 
      label: 'Samsung Galaxy S24', 
      value: 'samsung-s24',
      category: 'Smartphones',
      description: 'Android flagship with AI features',
      image: 'https://via.placeholder.com/32',
      popularity: 88,
      recent: true
    },
    { 
      id: '3', 
      label: 'MacBook Pro M3', 
      value: 'macbook-pro-m3',
      category: 'Laptops',
      description: 'Professional laptop with M3 chip',
      image: 'https://via.placeholder.com/32',
      popularity: 92
    },
    { 
      id: '4', 
      label: 'iPad Air', 
      value: 'ipad-air',
      category: 'Tablets',
      description: 'Versatile tablet for work and play',
      image: 'https://via.placeholder.com/32',
      popularity: 85,
      recent: true
    },
    { 
      id: '5', 
      label: 'AirPods Pro', 
      value: 'airpods-pro',
      category: 'Audio',
      description: 'Wireless earbuds with noise cancellation',
      image: 'https://via.placeholder.com/32',
      popularity: 90,
      trending: true
    },
    { 
      id: '6', 
      label: 'Dell XPS 13', 
      value: 'dell-xps-13',
      category: 'Laptops',
      description: 'Ultrabook with premium design',
      image: 'https://via.placeholder.com/32',
      popularity: 78
    }
  ];
  
  // Simulated async search
  const handleAsyncSearch = async (query: string): Promise<AutocompleteOption[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return sampleOptions.filter(option => 
      option.label.toLowerCase().includes(query.toLowerCase()) ||
      option.description?.toLowerCase().includes(query.toLowerCase())
    );
  };
  
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Advanced Autocomplete Component
        </h1>
        <p className="text-gray-600">
          Full-featured search component with fuzzy matching, categories, and rich results
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Single Select */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Single Select</h2>
          <AdvancedAutocomplete
            options={sampleOptions}
            value={selectedSingle}
            onChange={(value) => setSelectedSingle(value as AutocompleteOption)}
            placeholder="Search products..."
            showCategories={true}
            showRecent={true}
            showTrending={true}
            groupBy={(option) => option.category}
          />
          {selectedSingle && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Selected: <strong>{selectedSingle.label}</strong>
              </p>
            </div>
          )}
        </div>
        
        {/* Multiple Select */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Multiple Select</h2>
          <AdvancedAutocomplete
            options={sampleOptions}
            value={selectedMultiple}
            onChange={(value) => setSelectedMultiple(value as AutocompleteOption[])}
            placeholder="Search and select multiple..."
            multiple={true}
            showCategories={true}
            groupBy={(option) => option.category}
          />
          {selectedMultiple.length > 0 && (
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                Selected {selectedMultiple.length} items:
              </p>
              <ul className="text-sm text-green-700 mt-1">
                {selectedMultiple.map(item => (
                  <li key={item.id}>• {item.label}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Async Search */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Async Search</h2>
          <AdvancedAutocomplete
            options={[]} // No static options
            onSearch={handleAsyncSearch}
            placeholder="Type to search (async)..."
            searchConfig={{ 
              debounceMs: 500,
              minQueryLength: 2
            }}
          />
        </div>
        
        {/* Fuzzy Search */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Fuzzy Search</h2>
          <AdvancedAutocomplete
            options={sampleOptions}
            placeholder="Try typos: 'macbok', 'ipone'..."
            searchConfig={{ 
              algorithm: 'fuzzy',
              fuzzyThreshold: 0.5
            }}
          />
        </div>
      </div>
      
      {/* Features List */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Features Included:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Search Algorithms</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Fuzzy matching</li>
              <li>• Exact matching</li>
              <li>• Semantic search</li>
              <li>• Hybrid approach</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">UI Features</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Rich result cards</li>
              <li>• Category grouping</li>
              <li>• Recent searches</li>
              <li>• Trending indicators</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Interactions</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Keyboard navigation</li>
              <li>• Multi-select support</li>
              <li>• Async data loading</li>
              <li>• Debounced search</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutocompleteDemo;
