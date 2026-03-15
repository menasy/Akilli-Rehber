import { create } from "zustand"
import { persist } from "zustand/middleware"
import { fetchContacts } from "../services/contactsService"
import { Contact } from "../types"
import { mmkvStorage } from "../storage/mmkv"

type ContactsState = {
  contacts: Contact[]
  loading: boolean
  loadContacts: () => Promise<void>
}

export const useContactsStore = create<ContactsState>()(
  persist(
    (set) => ({
      contacts: [],
      loading: false,
      loadContacts: async () => {
        set({ loading: true })
        const data = await fetchContacts()
        set({ contacts: data, loading: false })
      },
    }),
    {
      name: "akilli-rehber-contacts",
      storage: mmkvStorage,
      partialize: (state) => ({
        contacts: state.contacts.map(({ id, name, phone }) => ({
          id,
          name,
          phone,
          avatar: "",
          isFavorite: false,
        })),
      }),
    }
  )
)
