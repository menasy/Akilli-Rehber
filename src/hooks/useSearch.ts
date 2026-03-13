import { useState, useMemo } from "react"
import { searchContacts } from "../services/searchService"
import { Contact } from "../types"

export function useSearch(contacts: Contact[]) {
  const [query, setQuery] = useState("")

  const results = useMemo(
    () => (query.trim() ? searchContacts(contacts, query) : contacts),
    [contacts, query]
  )

  return { query, setQuery, results }
}