export interface Contact {
    id: string;
    name: string;
    phone: string;
    avatar:  string;
    isFavorite: boolean;
}

export type ContactSize = "small" | "medium" | "large"

export interface Settings {
    theme: "light" | "dark"
    contactSize: ContactSize
    defaultScreen: "home" | "favorites"
    language: "tr" | "ku"
}