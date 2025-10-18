import { Loader2 } from 'lucide-react'
import React from 'react'

const Loader = () => {
  return (
    <div className='h-full w-full flex justify-center items-center'>
        <Loader2 className='animate-spin' />
    </div>
  )
}

export default Loader