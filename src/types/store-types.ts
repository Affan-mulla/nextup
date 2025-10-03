export interface User {
    id: string ,
    email?: string | null | undefined,
    name?: string | null | undefined,
    role?: string | null | undefined,
    image?: string | null | undefined
}

export interface Store {
    user : User,
    setUser : (user : User) => void
}