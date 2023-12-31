import { Book } from './book';
import { ListMeta } from './meta';

interface RawFile {}

interface Image {
	id: number;
	book_id: number;
	book: Book;
	path: string;
	file_name: string;
}

interface QueryImages {
	[key: string]: string | number | undefined;
	id?: number;
	book_id?: number;
	bookName?: string;
	path?: string;
	file_name?: string;
	sort: string;
	perPage: number;
	page: number;
	expand?: string;
}
interface ImagesResponse {
	items: Array<Image>;
	_meta: ListMeta;
}

export type { RawFile, Image, QueryImages, ImagesResponse };
