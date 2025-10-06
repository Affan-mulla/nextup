import { Store, User } from '@/types/store-types'
import { create } from 'zustand'
import axios from 'axios'
import { IdeaType } from '@/types/api-data-types'

export const useStore = create<Store & {
  ideas: IdeaType[]
  loading: boolean
  fetchIdeas: () => Promise<void>
}>(set => ({
  user: {
    id: "",
    email: "",
    name: "",
    role: "",
    image: ""
  },

  setUser: (user: User) => set(() => ({ user })),

  // new state
  ideas: [],
  loading: false,

  fetchIdeas: async () => {
    set({ loading: true })
    try {
      const res = await axios.get('/api/idea/get-idea')
      if (res.status === 200 && res.data.length > 0) {
        set({ ideas: res.data })
      }
    } finally {
      set({ loading: false })
    }
  }
}))
