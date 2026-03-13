import { createMMKV } from "react-native-mmkv"
import { createJSONStorage, type StateStorage } from "zustand/middleware"

export const mmkv = createMMKV({
  id: "nasai-storage",
})

const mmkvStateStorage: StateStorage = {
  setItem: (key, value) => {
    mmkv.set(key, value)
  },
  getItem: (key) => {
    return mmkv.getString(key) ?? null
  },
  removeItem: (key) => {
    mmkv.remove(key)
  },
}

export const mmkvStorage = createJSONStorage(() => mmkvStateStorage)
