const RATINGS = [
	{ value: 1, name: 'Bad' },
	{ value: 2, name: 'Poor' },
	{ value: 3, name: 'Fair' },
	{ value: 4, name: 'Good' },
	{ value: 5, name: 'Great' },
];
const LIMIT = [10, 15, 20, 25, 50, 100];

const TEXT_SIZES = [
	{ name: 'Base', value: 'text-base' },
	{ name: 'Small', value: 'text-lg' },
	{ name: 'Regular', value: 'text-xl' },
	{ name: 'Large', value: 'text-2xl' },
	{ name: 'Huge', value: 'text-3xl' },
];

const REDIRECT_LOGIN_URL = '/login';

const SORTING_OPTIONS = ['id', 'name', 'tag', 'view_count', 'rating', 'updated_at', 'last_read'];

const SIZES = ['S', 'M', 'L', 'XL'];

const PLAYER_INTERVALS = [3, 5, 7, 10, 15, 20];

export { RATINGS, LIMIT, SIZES, TEXT_SIZES, REDIRECT_LOGIN_URL, SORTING_OPTIONS, PLAYER_INTERVALS };