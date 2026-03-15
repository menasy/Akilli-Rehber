import { useEffect, useRef } from "react"
import { useContactsStore } from "../store/contactsStore"

export function useContacts() {
  const contacts = useContactsStore((state) => state.contacts)
  const loadContacts = useContactsStore((state) => state.loadContacts)
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true
    void loadContacts()
  }, [loadContacts])

  return contacts
}
