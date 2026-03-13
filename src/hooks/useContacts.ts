import { useEffect } from "react"
import { useContactsStore } from "../store/contactsStore"

export function useContacts() {
  const contacts = useContactsStore((state: any) => state.contacts)
  const loadContacts = useContactsStore((state: any) => state.loadContacts)

  useEffect(() => {
    void loadContacts()
  }, [loadContacts])

  return contacts
}