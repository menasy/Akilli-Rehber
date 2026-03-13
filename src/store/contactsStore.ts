import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { fetchContacts } from "../services/contactsService"
import { Contact } from "../types"

export const useContactsStore = create(
  persist(
    (set) => ({
      contacts: [] as Contact[],
      loading: false,
      loadContacts: async (): Promise<void> => {
        set({ loading: true })

        const data = await fetchContacts()

        set({
          contacts: data,
          loading: false,
        })
      },
    }),
    {
      name: "nasai-contacts",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ contacts: state.contacts }),
    }
  )
)
