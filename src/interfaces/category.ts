import { Genre } from "./genre";

interface Category {
    id: number,
    name: string
}

interface CategoryExtended extends Category{
    genres?: Array<Genre>
}

export {Category, CategoryExtended}