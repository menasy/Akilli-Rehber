import Fuse from "fuse.js"

export function searchContacts(list: any[], query: string) {

  if (!query) return list

  const fuse = new Fuse(list, {
    keys: ["name"],
    threshold: 0.4
  })

  return fuse.search(query).map(r => r.item)
}