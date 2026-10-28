import { FilterType } from '@/shared/api/types/Filter'
import { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'

// Applied filters -> draft map: { [categoryId]: [selected option ids] }
export const buildDraft = (
	applied: SearchRequestFilter
): Record<string, string[]> =>
	Object.fromEntries(applied.map(filter => [filter.id, filter.optionsIds]))

// Draft map -> applied filters (categories with no selection are dropped).
export const draftToSearchRequest = (
	draft: Record<string, string[]>
): SearchRequestFilter =>
	Object.entries(draft)
		.filter(([, optionsIds]) => optionsIds.length > 0)
		.map(([id, optionsIds]) => ({ id, type: FilterType.OPTION, optionsIds }))
