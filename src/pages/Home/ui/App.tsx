import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFiltersStore } from '@/shared/store/useFiltersStore'

import { FilterModal } from './FilterModal'

export const App = () => {
	const { t } = useTranslation('filter')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const appliedFilters = useFiltersStore(state => state.appliedFilters)

	return (
		<section className="flex min-h-dvh flex-col items-center justify-center gap-8 p-6">
			<h1 className="text-3xl font-semibold text-gray-700">{t('demoTitle')}</h1>

			<button
				type="button"
				onClick={() => setIsModalOpen(true)}
				className="h-16 cursor-pointer rounded-2xl bg-brand px-10 font-semibold text-white hover:bg-brand-hover focus-visible:bg-brand-hover"
			>
				{t('openFilters')}
			</button>

			<div className="w-full max-w-lg">
				<h2 className="mb-2 text-sm font-medium text-gray-500">
					{t('selectedFilters')}
				</h2>
				<pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-xs text-gray-800">
					{JSON.stringify(appliedFilters, null, 2)}
				</pre>
			</div>

			{isModalOpen && <FilterModal onClose={() => setIsModalOpen(false)} />}
		</section>
	)
}
