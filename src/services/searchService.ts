import Fuse from "fuse.js"
import type { Contact } from "../types"

const FUSE_OPTIONS = {
  keys: ["name"],
  threshold: 0.4,
}

let cachedList: Contact[] | null = null
let cachedFuse: Fuse<Contact> | null = null

export function searchContacts(list: Contact[], query: string): Contact[] {
  if (!query) return list

  if (list !== cachedList) {
    cachedFuse = new Fuse(list, FUSE_OPTIONS)
    cachedList = list
  }

  return cachedFuse!.search(query).map((r) => r.item)
}
