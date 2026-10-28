import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFilters } from '@/shared/api/filters/useFilters'
import { useFocusTrap } from '@/shared/lib/useFocusTrap'
import { useFiltersStore } from '@/shared/store/useFiltersStore'

import { CheckboxCheckedIcon } from './CheckboxCheckedIcon'
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

	// Clear every selection in the draft.
	const clearAll = () => setDraft({})

	const handleApplyNew = () => {
		setAppliedFilters(draftToSearchRequest(draft))
		onClose()
	}

	return (
		<div
			className={`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-0 pb-0 pt-8 sm:p-20 ${
				isConfirmOpen ? '' : 'bg-[#1b1b1b]/30 backdrop-blur-[25px]'
			}`}
			onClick={onClose}
		>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="filter-modal-title"
				tabIndex={-1}
				className="min-h-dvh w-full max-w-7xl rounded-b-none rounded-t-2xl bg-white px-4 pb-10 pt-4 shadow-xl outline-none sm:min-h-0 sm:rounded-2xl sm:px-8"
				onClick={event => event.stopPropagation()}
			>
				{/* Header */}
				<div className="relative border-b-2 border-grey-200 pb-4 pt-5">
					<h2
						id="filter-modal-title"
						className="text-center text-2xl font-medium text-ink sm:text-[2.5rem]"
					>
						{t('modalTitle')}
					</h2>
					<button
						type="button"
						onClick={onClose}
						aria-label={t('close')}
						className="absolute right-0 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center text-ink hover:opacity-70 focus-visible:opacity-70"
					>
						<CloseIcon />
					</button>
				</div>

				{/* Body */}
				<div>
					{isLoading && <p>{t('loading')}</p>}

					{filters?.map(category => (
						<div
							key={category.id}
							role="group"
							aria-labelledby={`filter-group-${category.id}`}
							className="border-b-2 border-grey-200 py-6"
						>
							<h3
								id={`filter-group-${category.id}`}
								className="mb-5 text-2xl font-medium text-ink"
							>
								{category.name}
							</h3>
							<div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
								{category.options.map(option => (
									<label
										key={option.id}
										className="flex cursor-pointer items-center gap-4 text-base text-ink"
									>
										<span className="relative inline-flex h-5 w-5 shrink-0">
											<input
												type="checkbox"
												checked={(draft[category.id] ?? []).includes(option.id)}
												onChange={() => toggleOption(category.id, option.id)}
												className="peer h-5 w-5 cursor-pointer appearance-none rounded-sm border-2 border-ink hover:bg-grey-100 checked:border-transparent"
											/>
											<CheckboxCheckedIcon className="pointer-events-none absolute inset-0 hidden h-5 w-5 text-ink peer-checked:block" />
										</span>
										<span>{option.name}</span>
									</label>
								))}
							</div>
						</div>
					))}
				</div>

				{/* Footer */}
				<div className="relative flex flex-col items-center gap-4 pt-8 sm:flex-row sm:justify-center">
					<button
						type="button"
						onClick={() => setIsConfirmOpen(true)}
						className="h-16 cursor-pointer rounded-2xl bg-brand px-18 font-semibold text-white hover:bg-brand-hover focus-visible:bg-brand-hover"
					>
						{t('apply')}
					</button>
					<button
						type="button"
						onClick={clearAll}
						className="cursor-pointer font-medium text-accent underline hover:opacity-70 focus-visible:opacity-70 sm:absolute sm:right-0"
					>
						{t('clearAll')}
					</button>
				</div>
			</div>

			{isConfirmOpen && (
				<ConfirmDialog
					onDismiss={() => setIsConfirmOpen(false)}
					onUseOld={onClose}
					onApplyNew={handleApplyNew}
				/>
			)}
		</div>
	)
}
