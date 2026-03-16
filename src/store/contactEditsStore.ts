import { create } from "zustand"
import { persist } from "zustand/middleware"
import { mmkvStorage } from "../storage/mmkv"

type ContactEdit = {
  name?: string
  avatar?: string
}

type ContactEditsState = {
  edits: Record<string, ContactEdit>
  setEdit: (id: string, edit: ContactEdit) => void
  clearEdit: (id: string) => void
}

export const useContactEditsStore = create<ContactEditsState>()(
  persist(
    (set) => ({
      edits: {},

      setEdit: (id: string, edit: ContactEdit) => {
        set((state) => ({
          edits: {
            ...state.edits,
            [id]: { ...state.edits[id], ...edit },
          },
        }))
      },

      clearEdit: (id: string) => {
        set((state) => {
          const { [id]: _, ...rest } = state.edits
          return { edits: rest }
        })
      },
    }),
    {
      name: "akilli-rehber-contact-edits",
      storage: mmkvStorage,
      partialize: (state) => ({ edits: state.edits }),
    }
  )
)
