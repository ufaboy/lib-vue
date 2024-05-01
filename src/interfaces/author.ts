import { BaseQuery, ListMeta } from './meta';

interface Author {
	id: number;
	name: string;
	url: string;
}

interface QueryAuthor extends Partial<Author>, BaseQuery {
	[key: string]: string | number | undefined;
}
interface AuthorResponse {
	items: Array<Author>;
	_meta: ListMeta;
}

export type { Author, QueryAuthor, AuthorResponse };
