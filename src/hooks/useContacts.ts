import { useEffect, useRef } from "react"
import { useContactsStore } from "../store/contactsStore"
import { useMergedContacts } from "./useMergedContacts"

export function useContacts() {
  const loadContacts = useContactsStore((state) => state.loadContacts)
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true
    void loadContacts()
  }, [loadContacts])

  return useMergedContacts()
}
