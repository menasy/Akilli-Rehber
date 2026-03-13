import { useEffect } from "react"
import { useContactsStore } from "../store/contactsStore"
import { useSettingsStore } from "../store/settingsStore"

export function useContacts() {
  const contacts = useContactsStore((state) => state.contacts)
  const loadContacts = useContactsStore((state) => state.loadContacts)
  const contactsBootstrapped = useSettingsStore((state) => state.contactsBootstrapped)
  const setContactsBootstrapped = useSettingsStore(
    (state) => state.setContactsBootstrapped
  )

  useEffect(() => {
    if (contactsBootstrapped) return

    setContactsBootstrapped(true)
    void loadContacts()
  }, [contactsBootstrapped, loadContacts, setContactsBootstrapped])

  return contacts
}
