import type { Tag } from './tag';
import type { Author } from './author';
import type { BaseQuery, ListMeta, ListMetaLinks } from './meta';
import type { Media } from './media';
import type { Series } from './series';

interface BookTableIem {
	id: number;
	name: string;
	description: string | null;
	text: string | null;
	source: string | null;
	rating: number | null;
	author: Author | null;
	series: Series | null;
	tags: Array<Tag>;
	cover: string | null;
	bookmark: number | null;
	text_length: number | null;
	view_count: number | null;
	updated_at: string;
	last_read: string | null;
	media: Media[] | null;
}
interface Book {
	id: number;
	name: string;
	description: string | null;
	text: string | null;
	source: string | null;
	rating: number | null;
	cover: string | null;
	text_length: number | null;
	view_count: number | null;
	updated_at: string;
	last_read: string | null;
	media: Media[] | null;
}

interface BookResponse {
	items: Array<BookTableIem>;
	_meta: ListMeta;
	_links: ListMetaLinks;
}

interface QueryBooks extends Partial<Omit<BookTableIem, 'tags' | 'author' | 'series' | 'media'>>, BaseQuery {
	[key: string]: string | number | undefined | null;
	tag?: string;
	text?: string;
	text_length?: number;
	authorName?: string;
	seriesName?: string;
	size?: number;
}

interface Chapter {
	name: string;
	shortName: string;
	url: string;
	element: Element;
}

export type { Book, BookTableIem, BookResponse, QueryBooks, Chapter };
