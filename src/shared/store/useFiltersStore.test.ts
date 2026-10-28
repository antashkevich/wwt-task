import { FilterType } from '@/shared/api/types/Filter'

import { useFiltersStore } from './useFiltersStore'

describe('useFiltersStore', () => {
	beforeEach(() => {
		useFiltersStore.setState({ appliedFilters: [] })
	})

	it('starts with no applied filters', () => {
		expect(useFiltersStore.getState().appliedFilters).toEqual([])
	})

	it('setAppliedFilters replaces the applied filters', () => {
		const next = [
			{ id: 'MEAL', type: FilterType.OPTION, optionsIds: ['breakfast'] }
		]

		useFiltersStore.getState().setAppliedFilters(next)

		expect(useFiltersStore.getState().appliedFilters).toEqual(next)
	})
})
