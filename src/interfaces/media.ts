import { Book } from './book';
import { BaseQuery, ListMeta } from './meta';

interface RawFile {}

interface Media {
	id: number;
	book_id: number;
	book: Book;
	path: string;
	file_name: string;
}

interface QueryMedia extends Partial<Omit<Media, 'book'>>, BaseQuery{
	[key: string]: string | number | undefined;
	bookName?: string;
	expand?: string;
}
interface MediaResponse {
	items: Array<Media>;
	_meta: ListMeta;
}

interface MediaTotal {
	book_id: number;
	media_count: number
}
interface StorageMedia {
	bookID: number;
	bookName: string;
	mediaList: Array<string>;
}

export type { RawFile, Media, QueryMedia, MediaResponse, MediaTotal, StorageMedia };
