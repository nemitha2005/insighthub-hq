import { useState, useEffect } from 'react';

// Mock prices based on country
export function usePaddlePrices(country: string) {
  // Mock pricing data
  const mockPrices = {
    pri_01hsxyh9txq4rzbrhbyngkhy46: '$9.99',
    pri_01hsxycme6m95sejkz7sbz5e9g: '$29.99',
    pri_01hsxyeb2bmrg618bzwcwvdd6q: '$299.99',
    pri_01hsxyff091kyc9rjzx7zm6yqh: '$79.99',
    pri_01hsxyfysbzf90tkh2wqbfxwa5: '$799.99',
  };

  if (country === 'GB') {
    mockPrices['pri_01hsxyh9txq4rzbrhbyngkhy46'] = '£7.99';
  }

  return { prices: mockPrices, loading: false };
}
