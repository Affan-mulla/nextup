
import { create } from 'zustand'

type User = {
    id: string,
    email: string,
    name: string,
    role: string,
    image?: string
}

export const useStore = create((set) => ({
    user : {
        id: "",
        email: "",
        name: "",
        role: "",
        image: ""
    },
    setUser : (user : User) => set({user})

}))