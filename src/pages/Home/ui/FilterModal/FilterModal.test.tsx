import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'

import { FilterType } from '@/shared/api/types/Filter'
import '@/shared/i18n'
import { useFiltersStore } from '@/shared/store/useFiltersStore'

import { FilterModal } from './FilterModal'

const renderModal = () => {
	const onClose = vi.fn()
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } }
	})
	render(
		<QueryClientProvider client={queryClient}>
			<FilterModal onClose={onClose} />
		</QueryClientProvider>
	)
	return { onClose }
}

describe('FilterModal', () => {
	beforeEach(() => {
		useFiltersStore.setState({ appliedFilters: [] })
	})

	it('does not apply changes and closes the modal when the user keeps the old filter', async () => {
		const { onClose } = renderModal()

		const option = await screen.findByLabelText('Breakfast included')
		fireEvent.click(option)
		fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
		fireEvent.click(screen.getByRole('button', { name: 'Use old filter' }))

		// The new selection is discarded — applied filters stay untouched...
		expect(useFiltersStore.getState().appliedFilters).toEqual([])
		// ...and the modal is closed.
		expect(onClose).toHaveBeenCalled()
	})

	it('saves the selected filters when the user applies the new filter', async () => {
		const { onClose } = renderModal()

		const option = await screen.findByLabelText('Breakfast included')
		fireEvent.click(option)
		fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
		fireEvent.click(screen.getByRole('button', { name: 'Apply new filter' }))

		expect(useFiltersStore.getState().appliedFilters).toEqual([
			{ id: 'MEAL_OPTIONS', type: FilterType.OPTION, optionsIds: ['breakfast'] }
		])
		expect(onClose).toHaveBeenCalled()
	})
})
