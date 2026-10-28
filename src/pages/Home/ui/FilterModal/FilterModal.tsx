import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFilters } from '@/shared/api/filters/useFilters'
import { useFocusTrap } from '@/shared/lib/useFocusTrap'
import { useFiltersStore } from '@/shared/store/useFiltersStore'

import { CloseIcon } from './CloseIcon'
import { ConfirmDialog } from './ConfirmDialog'
import { buildDraft, draftToSearchRequest } from './lib'

interface FilterModalProps {
	onClose: () => void
}

export const FilterModal = ({ onClose }: FilterModalProps) => {
	const { t } = useTranslation('filter')
	const { data: filters, isLoading } = useFilters()

	const appliedFilters = useFiltersStore(state => state.appliedFilters)
	const setAppliedFilters = useFiltersStore(state => state.setAppliedFilters)

	const [draft, setDraft] = useState<Record<string, string[]>>(() =>
		buildDraft(appliedFilters)
	)
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)

	const dialogRef = useRef<HTMLDivElement>(null)
	useFocusTrap(dialogRef, onClose)

	const toggleOption = (categoryId: string, optionId: string) => {
		setDraft(prev => {
			const current = prev[categoryId] ?? []
			const next = current.includes(optionId)
				? current.filter(id => id !== optionId)
				: [...current, optionId]
			return { ...prev, [categoryId]: next }
		})
	}

	const clearAll = () => setDraft({})

	const handleApplyNew = () => {
		setAppliedFilters(draftToSearchRequest(draft))
		onClose()
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
			onClick={onClose}
		>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="filter-modal-title"
				tabIndex={-1}
				className="my-6 w-full max-w-4xl rounded-2xl bg-white shadow-xl outline-none"
				onClick={event => event.stopPropagation()}
			>
				{/* Header */}
				<div className="relative border-b border-gray-200 px-8 py-5">
					<h2
						id="filter-modal-title"
						className="text-center text-2xl font-bold text-gray-900"
					>
						{t('modalTitle')}
					</h2>
					<button
						type="button"
						onClick={onClose}
						aria-label={t('close')}
						className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
					>
						<CloseIcon />
					</button>
				</div>

				{/* Body */}
				<div className="px-8 py-6">
					{isLoading && <p>{t('loading')}</p>}

					{filters?.map(category => (
						<fieldset
							key={category.id}
							className="border-b border-gray-200 py-6 first:pt-0"
						>
							<legend className="mb-4 text-lg font-semibold text-gray-900">
								{category.name}
							</legend>
							<div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
								{category.options.map(option => (
									<label
										key={option.id}
										className="flex cursor-pointer items-center gap-3 text-sm text-gray-700"
									>
										<input
											type="checkbox"
											checked={(draft[category.id] ?? []).includes(option.id)}
											onChange={() => toggleOption(category.id, option.id)}
											className="h-5 w-5 shrink-0 accent-[#F85C00]"
										/>
										<span>{option.name}</span>
									</label>
								))}
							</div>
						</fieldset>
					))}
				</div>

				{/* Footer */}
				<div className="relative flex flex-col items-center gap-4 px-8 py-6 sm:flex-row sm:justify-center">
					<button
						type="button"
						onClick={() => setIsConfirmOpen(true)}
						className="rounded-full bg-[#F85C00] px-10 py-3 font-medium text-white hover:bg-[#dd5200]"
					>
						{t('apply')}
					</button>
					<button
						type="button"
						onClick={clearAll}
						className="font-medium text-sky-600 underline sm:absolute sm:right-8"
					>
						{t('clearAll')}
					</button>
				</div>
			</div>

			{isConfirmOpen && (
				<ConfirmDialog
					onDismiss={() => setIsConfirmOpen(false)}
					onUseOld={() => setIsConfirmOpen(false)}
					onApplyNew={handleApplyNew}
				/>
			)}
		</div>
	)
}
