import { BaseQuery, ListMeta } from './meta';

interface Series {
	id: number;
	name: string;
	url: string;
}

interface QuerySeries extends Partial<Series>, BaseQuery {
	[key: string]: string | number | undefined;
}

interface SeriesResponse {
	items: Array<Series>;
	_meta: ListMeta;
}

export type { Series, QuerySeries, SeriesResponse };
