interface ListMetaLinks {
	first: {
		href: string;
	};
	last: {
		href: string;
	};
	next: {
		href: string;
	};
	self: {
		href: string;
	};
	prev: {
		href: string;
	};
}

interface ListMeta {
	currentPage: number;
	pageCount: number;
	perPage: number;
	totalCount: number;
}

interface BaseQuery {
	[key: string]: string | number | undefined;
	name?: string;
	sort?: string;
	perPage?: number;
	page?: number;
  }

export type { ListMetaLinks, ListMeta, BaseQuery };
