"use client"
import EditorPage from "@/app/editor-x/page"
import { ProductSelector } from "@/components/forms/ProductSelector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const page = () => {
  return (
    <div className="w-full h-full flex items-center justify-center md:px-8 md:py-4 ">
        <div className="w-full md:max-w-4xl  md:bg-card h-full md:py-4 md:px-6 rounded-xl md:border md:border-border flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-semibold font-outfit">Create idea</h1>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Product</Label>
              <ProductSelector/>
          </div>
          <div className="space-y-2">
          <Label>Title</Label>
          <Input className="h-10 w-full"/>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <EditorPage/>
          </div>
          <div>
            <Button>Create</Button>
            <Button variant={"secondary"}>Cancel</Button>
          </div>
        </div>
    </div>
  )
}

export default page