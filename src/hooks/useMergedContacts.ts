import { useMemo } from "react"
import { useContactsStore } from "../store/contactsStore"
import { useContactEditsStore } from "../store/contactEditsStore"
import { Contact } from "../types"

export function useMergedContacts(): Contact[] {
  const contacts = useContactsStore((state) => state.contacts)
  const edits = useContactEditsStore((state) => state.edits)

  return useMemo(() => {
    return contacts.map((contact) => {
      const edit = edits[contact.id]
      if (!edit) return contact
      return {
        ...contact,
        name: edit.name ?? contact.name,
        avatar: edit.avatar ?? contact.avatar,
      }
    })
  }, [contacts, edits])
}
