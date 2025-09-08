
import { create } from 'zustand'

type User = {
    id: string,
    email: string,
    name: string,
    role: string,
    image?: string
}

export const useStore = create((set) => ({
    user : null,
    setUser : (user : User) => set({user})

}))