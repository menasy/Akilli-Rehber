export interface Contact {
    id: string;
    name: string;
    phone: string;
    avatar: string;
}

export type ContactSize = "small" | "medium" | "large"

export type CommunicationMethod = "phone" | "whatsapp" | "both"
