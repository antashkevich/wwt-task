import { FilterItem } from '@/shared/api/types/Filter'
import filterData from '@/shared/temp/filterData.json'

export const getFilters = async (): Promise<FilterItem[]> => {
	return filterData.filterItems as FilterItem[]
}
