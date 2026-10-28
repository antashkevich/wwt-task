import { useQuery } from '@tanstack/react-query'

import { getFilters } from './getFilters'

export const useFilters = () => {
	return useQuery({
		queryKey: ['filters'],
		queryFn: getFilters
	})
}
