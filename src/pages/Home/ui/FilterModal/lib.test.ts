import { FilterType } from '@/shared/api/types/Filter'

import { buildDraft, draftToSearchRequest } from './lib'

describe('buildDraft', () => {
	it('converts applied filters into a draft map', () => {
		const applied = [
			{ id: 'MEAL', type: FilterType.OPTION, optionsIds: ['breakfast'] }
		]
		expect(buildDraft(applied)).toEqual({ MEAL: ['breakfast'] })
	})

	it('returns an empty object for empty input', () => {
		expect(buildDraft([])).toEqual({})
	})
})

describe('draftToSearchRequest', () => {
	it('converts a draft map into applied filters', () => {
		const draft = { MEAL: ['breakfast', 'dinner'] }
		expect(draftToSearchRequest(draft)).toEqual([
			{
				id: 'MEAL',
				type: FilterType.OPTION,
				optionsIds: ['breakfast', 'dinner']
			}
		])
	})

	it('drops categories with no selected options', () => {
		const draft = { MEAL: [], BED: ['double-bed'] }
		expect(draftToSearchRequest(draft)).toEqual([
			{ id: 'BED', type: FilterType.OPTION, optionsIds: ['double-bed'] }
		])
	})
})
