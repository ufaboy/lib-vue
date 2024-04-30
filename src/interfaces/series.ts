import { ListMeta } from './meta';

interface Series {
	id: number;
	name: string;
	url: string;
}

interface QuerySeries extends Partial<Series>{
	[key: string]: string | number | undefined;
	sort: string;
	perPage: number;
	page: number;
}

interface SeriesResponse {
	items: Array<Series>;
	_meta: ListMeta;
}

export type { Series, QuerySeries, SeriesResponse };
