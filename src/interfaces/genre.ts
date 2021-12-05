import {Category} from "./category";
interface Genre {
    [key: string]: number|string|Category|boolean
    id: number,
    name: string,
    description: string,
    category: Category,
    ad: boolean,
    created_at: number,
}

interface GenreForm {
    id?: number,
    name: string,
    description?: string,
    category_id?: number,
    ad?: boolean,
}
interface GenreFilter {
    
}

export {Genre, GenreForm}