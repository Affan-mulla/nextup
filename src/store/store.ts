
import { Store, User } from '@/types/store-types'
import { create } from 'zustand'



export const useStore = create<Store>((set) => ({
    user : {
        id: "",
        email: "",
        name: "",
        role: "",
        image: ""
    },
    setUser : (user : User) => set(()=> ({ user }))
}))