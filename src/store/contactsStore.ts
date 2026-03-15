import { create } from "zustand"
import { fetchContacts } from "../services/contactsService"
import { Contact } from "../types"

type ContactsState = {
  contacts: Contact[]
  loading: boolean
  loadContacts: () => Promise<void>
}

export const useContactsStore = create<ContactsState>((set) => ({
  contacts: [],
  loading: false,
  loadContacts: async () => {
    set({ loading: true })
    const data = await fetchContacts()
    set({ contacts: data, loading: false })
  },
}))
