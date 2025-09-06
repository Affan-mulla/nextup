import { ArrowBigUpDash } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const FormWrapper: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-4 p-6">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <ArrowBigUpDash className="size-4" />
          </div>
          <span className="font-outfit text-xl">Nextup</span>
        </Link>
        {children}
      </div>
    </div>
  )
}

export default FormWrapper