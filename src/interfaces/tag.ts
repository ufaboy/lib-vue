interface BaseTag {
	name: string;
}
interface Tag extends BaseTag {
	id: number;
}

export type { BaseTag, Tag };
