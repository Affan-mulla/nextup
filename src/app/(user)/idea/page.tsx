"use client";
import ProductSelector from "@/components/forms/ProductSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { IdeaData, IdeaDataSchema } from "@/lib/validation";
import { useStore } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { replaceImagesFromLexical } from "@/utils/replaceImage";
import { base64ToFile } from "@/utils/baseToFile";
import { extractImagesFromLexical } from "@/utils/extractImage";
import { Editor } from "@/components/blocks/editor-x/editor";
import {  SerializedEditorState, SerializedLexicalNode } from "lexical";
import { Store } from "@/types/store-types";
import { LexicalJsonNode } from "@/types/lexical-json";

type ImageInput = { src: string };

const Page = () => {
  const user = useStore((state : Store) => state.user);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editorJson, setEditorJson] = useState<SerializedEditorState<SerializedLexicalNode>>();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<IdeaData>({
    resolver: zodResolver(IdeaDataSchema),
    defaultValues: {
      title: "",
      productId: "",
      description: undefined,
      userId: user.id,
    },
  });

  // Walk through Lexical JSON tree

  async function uploadImage(file: File) {
    // 1. Ask server for signed URL
    const res = await axios.post("/api/upload/idea", { fileName: file.name });

    const { signedUrl, publicUrl, error } = await res.data;
    if (error) throw new Error(error);

    // 2. Upload directly to Supabase Storage
    const uploadRes = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: { "Content-Type": file.type },
    });

    if (!uploadRes.ok) throw new Error("Upload failed");

    // 3. Return public URL
    return { publicUrl };
  }

  const imagesExist = async (images: LexicalJsonNode[]) => {
    const imagesFile = images.map( (image :  LexicalJsonNode) => {
      const file = base64ToFile(image.src || "", `image-${Date.now()}.png`);
      return file;
    });

    const uploadedImages = await Promise.all(
      imagesFile.map((file) => uploadImage(file))
    );

    return uploadedImages;
  };

  const onSubmit = async (data: IdeaData) => {
    setLoading(true);
    const images = extractImagesFromLexical(editorJson?.root);

    if (images.length > 0) {
      const uploadedImages = await imagesExist(images);
      const imageUrls = uploadedImages.map((image) => image.publicUrl);

      // Replace image URLs in editor JSON
      const replacedEditorJson = replaceImagesFromLexical(
        editorJson?.root,
        imageUrls
      );
      setEditorJson(JSON.parse(JSON.stringify(replacedEditorJson)));
    }

    // attach editor JSON before submit
    data.description = editorJson;

    try {
      const res = await axios.post("/api/idea/create", data);
      if (res.status === 200) {
        router.push(`/idea/${res.data.id}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex md:pt-3 pt-2 items-center justify-center">
      <div className="w-full max-w-3xl md:bg-card h-full md:p-6 p-3  rounded-2xl md:border md:border-border md:shadow-sm flex flex-col gap-4">
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
            {errors.productId && (
              <span className="text-red-500 text-sm">Required</span>
            )}
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
            {errors.title && (
              <span className="text-red-500 text-sm">
                {errors.title.message}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <div className="border h-100 rounded-lg overflow-hidden">
              <Editor
                editorSerializedState={editorJson}
                onSerializedChange={setEditorJson}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin" /> : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
