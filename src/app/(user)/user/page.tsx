import { auth } from "@/lib/auth"

const page = async() => {
    const session = await auth()
  return (
    <div>User{JSON.stringify(session)}</div>
  )
}

export default page