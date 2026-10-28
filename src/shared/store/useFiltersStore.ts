import { create } from 'zustand'

import { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'

interface FiltersState {
	appliedFilters: SearchRequestFilter
	setAppliedFilters: (filters: SearchRequestFilter) => void
}

export const useFiltersStore = create<FiltersState>(set => ({
	appliedFilters: [],
	setAppliedFilters: filters => set({ appliedFilters: filters })
}))
