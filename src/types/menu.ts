export type T_MenuItem = {
	name: string;
	description?: string;
	price: number;
	volume?: string;
	weight?: string;
}

export type T_MenuCategory = {
	title: string;
	list: T_MenuItem[];
}

export type T_MenuData = {
	name: string;
	category: T_MenuCategory[];
}
