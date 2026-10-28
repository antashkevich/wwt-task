import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useFocusTrap } from '@/shared/lib/useFocusTrap'

import { CloseIcon } from './CloseIcon'

interface ConfirmDialogProps {
	onDismiss: () => void
	onUseOld: () => void
	onApplyNew: () => void
}

export const ConfirmDialog = ({
	onDismiss,
	onUseOld,
	onApplyNew
}: ConfirmDialogProps) => {
	const { t } = useTranslation('filter')
	const dialogRef = useRef<HTMLDivElement>(null)
	useFocusTrap(dialogRef, onDismiss)

	return (
		<div
			className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-[#1b1b1b]/30 px-0 pb-0 pt-8 backdrop-blur-[25px] sm:items-center sm:p-4"
			onClick={event => {
				event.stopPropagation()
				onDismiss()
			}}
		>
			<div
				ref={dialogRef}
				role="alertdialog"
				aria-modal="true"
				aria-labelledby="confirm-dialog-title"
				tabIndex={-1}
				className="flex min-h-[calc(100dvh-2rem)] w-full max-w-7xl flex-col rounded-b-none rounded-t-2xl bg-white p-6 shadow-xl outline-none sm:min-h-0 sm:rounded-2xl sm:p-8"
				onClick={event => event.stopPropagation()}
			>
				<div className="relative mb-12 text-center sm:mb-28">
					<h3
						id="confirm-dialog-title"
						className="px-10 text-2xl font-medium text-ink sm:text-[2.5rem]"
					>
						{t('confirmTitle')}
					</h3>
					<button
						type="button"
						onClick={onDismiss}
						aria-label={t('close')}
						className="absolute right-0 top-0 flex h-6 w-6 cursor-pointer items-center justify-center text-ink hover:opacity-70 focus-visible:opacity-70"
					>
						<CloseIcon />
					</button>
				</div>
				<div className="mt-auto flex flex-col gap-4 sm:mt-0 sm:flex-row sm:justify-center sm:gap-8">
					<button
						type="button"
						onClick={onUseOld}
						className="h-16 w-full cursor-pointer rounded-2xl border-2 border-grey-200 font-semibold text-ink hover:bg-gray-50 focus-visible:bg-gray-50 sm:w-[280px]"
					>
						{t('confirmUseOld')}
					</button>
					<button
						type="button"
						onClick={onApplyNew}
						className="h-16 w-full cursor-pointer rounded-2xl bg-brand font-semibold text-white hover:bg-brand-hover focus-visible:bg-brand-hover sm:w-[280px]"
					>
						{t('confirmApplyNew')}
					</button>
				</div>
			</div>
		</div>
	)
}
