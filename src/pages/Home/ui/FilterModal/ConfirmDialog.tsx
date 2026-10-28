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
			className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
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
				className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl outline-none"
				onClick={event => event.stopPropagation()}
			>
				<div className="mb-10 flex items-start justify-between">
					<h3
						id="confirm-dialog-title"
						className="text-[2rem] font-medium text-ink"
					>
						{t('confirmTitle')}
					</h3>
					<button
						type="button"
						onClick={onDismiss}
						aria-label={t('close')}
						className="cursor-pointer text-ink hover:opacity-70"
					>
						<CloseIcon />
					</button>
				</div>
				<div className="flex justify-center gap-4">
					<button
						type="button"
						onClick={onUseOld}
						className="h-12 cursor-pointer rounded-2xl border border-gray-300 px-6 font-semibold text-ink hover:bg-gray-50"
					>
						{t('confirmUseOld')}
					</button>
					<button
						type="button"
						onClick={onApplyNew}
						className="h-12 cursor-pointer rounded-2xl bg-brand px-6 font-semibold text-white hover:bg-brand-hover"
					>
						{t('confirmApplyNew')}
					</button>
				</div>
			</div>
		</div>
	)
}
