import { create } from "zustand"
import type { MatchResult, VoiceSearchState } from "../voice/types"

const initialState: VoiceSearchState = {
  isListening: false,
  isProcessing: false,
  transcript: "",
  error: null,
  matches: [],
  showResults: false,
}

type VoiceStore = {
  state: VoiceSearchState
  startListening: () => void
  stopListening: () => void
  setProcessing: (processing: boolean) => void
  setTranscript: (text: string) => void
  setMatches: (matches: MatchResult[]) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useVoiceStore = create<VoiceStore>()((set) => ({
  state: initialState,
  startListening: () =>
    set({ state: { ...initialState, isListening: true } }),
  stopListening: () =>
    set((prev) => ({ state: { ...prev.state, isListening: false } })),
  setProcessing: (processing) =>
    set((prev) => ({ state: { ...prev.state, isProcessing: processing } })),
  setTranscript: (text) =>
    set((prev) => ({ state: { ...prev.state, transcript: text } })),
  setMatches: (matches) =>
    set((prev) => ({
      state: {
        ...prev.state,
        matches,
        showResults: matches.length > 0,
        isProcessing: false,
      },
    })),
  setError: (error) =>
    set((prev) => ({
      state: {
        ...prev.state,
        error,
        isListening: false,
        isProcessing: false,
      },
    })),
  reset: () => set({ state: initialState }),
}))
