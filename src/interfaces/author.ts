import { ListMeta } from './meta';

interface Author {
	id: number;
	name: string;
	url: string;
}

interface QueryAuthor extends Partial<Author> {
	[key: string]: string | number | undefined;
	sort: string;
	perPage: number;
	page: number;
}
interface AuthorResponse {
	items: Array<Author>;
	_meta: ListMeta;
}

export type { Author, QueryAuthor, AuthorResponse };
