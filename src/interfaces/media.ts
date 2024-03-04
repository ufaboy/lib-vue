import { Book } from './book';
import { ListMeta } from './meta';

interface RawFile {}

interface Media {
	id: number;
	book_id: number;
	book: Book;
	path: string;
	file_name: string;
}

interface QueryMedia {
	[key: string]: string | number | undefined;
	id?: number;
	book_id?: number;
	bookName?: string;
	path?: string;
	file_name?: string;
	sort: string;
	perPage?: number;
	page?: number;
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
