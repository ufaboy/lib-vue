import type { Tag } from './tag';
import type { Author } from './author';
import type { ListMeta } from './meta';
import type { Image } from './images';
import type { Series } from './series';

interface Book {
	[key: string]: string | number | undefined | Author | Series | Tag[] | Image[];
	id?: number;
	name: string;
	description?: string;
	text?: string;
	source?: string;
	rating?: number;
	author?: Author;
	series?: Series;
	tags: Array<Tag>;
	cover?: string;
	bookmark?: number;
	text_length?: number;
	view_count?: number;
	created_at?: number;
	updated_at?: number;
	last_read?: number;
	images?: Image[];
}

interface BookResponse {
	items: Book[];
	_meta: ListMeta;
	_links: MetaLinks;
}

interface MetaLinks {
	first: { href: string };
	last: { href: string };
	next: { href: string };
	self: { href: string };
}

interface QueryBooks {
	[key: string]: string | number | undefined;
	id?: number;
	tag?: string;
	view_count?: number;
	name?: string;
	text?: string;
	rating?: number;
	text_length?: number;
	authorName?: string;
	seriesName?: string;
	size?: number;
	updated_at?: number;
	last_read?: number;
	sort: string;
	perPage: number;
	page: number;
}

interface Chapter {
	name: string;
	url: string;
	element: Element;
}

export type { Book, BookResponse, QueryBooks, Chapter };
