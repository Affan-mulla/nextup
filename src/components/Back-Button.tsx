import React from 'react'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation';

const BackButton = () => {
    const router = useRouter();
    const handleBack = () => {
        router.back();
    }
  return (
    <Button
    variant={"ghost"}
    size={"icon"}
    className="p-2"
    onClick={handleBack}
    >
        <ArrowLeft className='' />
    </Button>
  )
}

export default BackButton