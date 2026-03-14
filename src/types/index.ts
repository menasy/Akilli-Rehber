export interface Contact {
    id: string;
    name: string;
    phone: string;
    avatar: string;
    isFavorite: boolean;
    normalizedName: string;
    phoneticName: string;
}

export type ContactSize = "small" | "medium" | "large"

export type DetectedLanguage = "tr" | "ku" | "unknown"

export interface ParsedIntent {
    rawText: string;
    detectedLanguage: DetectedLanguage;
    candidateNames: string[];
    normalizedCandidates: string[];
}

export interface MatchResult {
    contact: Contact;
    score: number;
    confidence: "high" | "medium" | "low";
}

export interface VoiceSearchState {
    status: "idle" | "modelLoading" | "listening" | "processing" | "result" | "error";
    transcript: string;
    matches: MatchResult[];
    error: string | null;
}

export interface Settings {
    theme: "light" | "dark"
    contactSize: ContactSize
    defaultScreen: "index" | "favorites" | "voice"
    language: "tr" | "ku"
}