"use server"
import { auth } from "@/lib/auth"


const page = async() => {
  const session = await auth()
  
  return (

    <div>page
      {JSON.stringify(session)}

    
    </div>
  )
}

export default page