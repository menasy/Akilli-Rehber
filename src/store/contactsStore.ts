import { create } from "zustand"
import { fetchContacts } from "../services/contactsService"
import { Contact } from "../types"

export const useContactsStore = create((set) => ({

  contacts: [] as Contact[],
  loading: false,

   loadContacts: async (): Promise<void> => {

    set({ loading:true })

    const data = await fetchContacts()

    set({
      contacts: data,
      loading:false
    })

  }

}))