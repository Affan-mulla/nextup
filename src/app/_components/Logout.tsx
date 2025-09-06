"use client"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth"

const Logout = () => {
    const log = async () => {
        await signOut()

    }
  return (
   <Button className="w-full" onClick={log}>
    Logout
   </Button>
  )
}

export default Logout