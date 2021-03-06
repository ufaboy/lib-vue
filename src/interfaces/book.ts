import {Genre} from "./genre";

interface BookLink {
    href: string
}

interface BookLinks {
    first: BookLink,
    last: BookLink,
    next: BookLink,
    self: BookLink,
    prev: BookLink
}

interface BookMeta {
    currentPage: number
    pageCount: number
    perPage: number
    totalCount: number
}

interface Book {
    id?: number,
    name: string,
    annotation?: string,
    text?: string,
    book_type?: string,
    source?: string,
    bookmark?: number,
    rating?: number,
    ad: boolean,
    author?: Author,
    genres:Array<Genre>
    cover_path?: string,
    files?: Array<BookFile>,
    view_count?: number,
    created_at?: number,
    updated_at?: number,
    last_read?: number,
}

interface BookTable {
    id: number,
    name: string,
    annotation: string,
    source: string,
    bookmark: number,
    book_type: string,
    rating: number,
    view_count: number,
    last_read: number,
    updated_at: number
    author?: Author,
    ad: boolean,
    cover_path: string,
    genres: Genre[],
    files: Array<BookFile>
}

interface BookData {
    items: BookTable[],
    _links: BookLinks,
    _meta: BookMeta
}

interface Author {
    id:number,
    name: string,
    url: string,
    ad: boolean
}

interface BookFile {
    created_at: number,
    extension: string,
    file_name: string,
    full_name: string,
    id: number,
    path: string,
    size: number,
    type: string,
    url: string,
    status?: string,
}

interface FileRaw {
    id?: number,
    name: string,
    status: string,
    file: File,
    type?: string,
    error?: string
}
type FileMix = FileRaw | BookFile

interface BookScrolling {
    bookId: number,
    bookmark: number
}

interface BookFilesUpload {
    name: string,
    status: string,
    file: File
}

interface BookDirFile {
    full_name: string
    id: number
    type: string
    url: string
}

interface BookDirFiles {
    [key: string]: number | string | BookDirFile[],

    bookId: number,
    dir_name: string,
    files: BookDirFile[]
}

interface ActiveMedia {
    full_name: string,
    type: string,
    url: string,
}

interface QueryData {
    genre: Genre | undefined,
    rating: number | undefined,
    limit: number,
    page: number,
    ad: boolean | undefined,
    searchQuery: string | undefined,
    orderBy: string,
    ascending: boolean
}

interface FormFilter {
    genre_id: number | undefined,
    rating: number | undefined,
    ad: boolean | undefined,
    searchQuery: string | undefined,
}

interface BookSave {
    id: number | undefined,
    ad?: boolean | undefined,
    annotation?: string | undefined,
    cover_path?: string | undefined,
    name: string | undefined,
    rating?: number | undefined
    source?: string | undefined,
    text: string | undefined,
    genres: Genre[],
    author_id?: number
}

export {
    BookLink,
    Book,
    BookTable,
    BookData,
    FileRaw,
    FileMix,
    BookFile,
    BookScrolling,
    BookFilesUpload,
    BookDirFile,
    BookDirFiles,
    QueryData,
    FormFilter,
    ActiveMedia,
    BookSave
}