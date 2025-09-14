"use client"
import EditorPage from "@/app/editor-x/page"
import ProductSelector  from "@/components/forms/ProductSelector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { IdeaData, IdeaDataSchema } from "@/lib/validation"
import { useStore } from "@/store/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Loader } from "lucide-react"

const Page = () => {
  const user = useStore((state : any) => state.user)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const {handleSubmit, register, setValue, formState: {errors}} = useForm<IdeaData>({
    resolver: zodResolver(IdeaDataSchema),
    defaultValues : {
      title : "",
      productId : "",
      description: undefined,
      userId : user.id,
    }
  })

  const [editorJson, setEditorJson] = useState<any>(null)

  const onSubmit = async(data: any) => {
    // attach editor JSON before submit
    data.description = editorJson
    console.log("Form Data:", data)
    // try {
    //   setLoading(true)
    //   const res = await axios.post("/api/idea/create", data)

    //   if(res.status === 200){
    //     toast.success("Idea created successfully.");
    //     setEditorJson(null)
    //     router.push(`/idea/${res.data.id}`)
    //   }

    // } catch (error) {
    //   console.log(error);
    //   toast.error("Something went wrong. Please try again.");
      
    // }
    // finally {
    //   setLoading(false)
    // }
  }

  return (
    <div className="max-h-screen flex items-center justify-center">
      <div className="w-full max-w-3xl md:bg-card h-full md:p-6 p-3 rounded-2xl md:border md:border-border md:shadow-sm flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold font-outfit">Create Idea</h1>
          <p className="text-muted-foreground text-sm">
            Fill out the details below to submit your idea.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Product */}
          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <ProductSelector setId={(val) => setValue("productId", val)} />
            {errors.productId && <span className="text-red-500 text-sm">Required</span>}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              placeholder="Enter a catchy title" 
              className="h-11"
              {...register("title", { required: true })}
            />
            {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <div className="border rounded-lg overflow-hidden">
              <EditorPage onChange={setEditorJson} /> 
              {/* 👈 pass a callback to capture JSON */}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {
                loading ? <Loader className="animate-spin" /> : "Create"
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Page
