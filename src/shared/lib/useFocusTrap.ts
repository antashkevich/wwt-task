import { RefObject, useEffect } from 'react'

const FOCUSABLE_SELECTOR =
	'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])'

/**
 * Accessibility behaviour for a modal dialog:
 * - moves focus into the dialog on open and restores it to the previously
 *   focused element on close;
 * - keeps Tab / Shift+Tab inside the dialog (focus trap);
 * - closes the dialog on Escape.
 *
 * The keydown listener is attached to the dialog node itself (not document),
 * so a nested dialog (e.g. a confirmation) handles its own keys without
 * interfering with the dialog underneath.
 */
export const useFocusTrap = (
	ref: RefObject<HTMLElement | null>,
	onClose: () => void
) => {
	useEffect(() => {
		const dialog = ref.current
		if (!dialog) {
			return
		}

		const previouslyFocused = document.activeElement as HTMLElement | null

		const getFocusable = () =>
			Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))

		// Move focus into the dialog (first focusable element, or the dialog itself).
		const focusable = getFocusable()
		;(focusable[0] ?? dialog).focus()

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.stopPropagation()
				onClose()
				return
			}

			if (event.key !== 'Tab') {
				return
			}

			const items = getFocusable()
			if (items.length === 0) {
				return
			}

			const first = items[0]
			const last = items[items.length - 1]

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault()
				last.focus()
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault()
				first.focus()
			}
		}

		dialog.addEventListener('keydown', handleKeyDown)

		return () => {
			dialog.removeEventListener('keydown', handleKeyDown)
			previouslyFocused?.focus()
		}
	}, [ref, onClose])
}
