
import { signIn } from 'next-auth/react'
import React from 'react'

const SignIn = () => {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("github")
      }}
    >
      <button type="submit">Signin with GitHub</button>
    </form>
  )
}

export default SignIn