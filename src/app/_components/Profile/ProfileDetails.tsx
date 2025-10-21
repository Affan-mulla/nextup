"use client";
import { User } from "@/types/store-types";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/kokonutui/file-upload";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/store";


interface ProfileDetailsProps {
  userData: User | null;
  userName: string;
  isOwner: boolean;
  onImageUpdate?: (newImageUrl: string) => void;
}

export default function ProfileDetails({ userData, userName, isOwner, onImageUpdate }: ProfileDetailsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const {setUser, user} = useStore();

  const handleUploadSuccess = async (file: File) => {
    try {
      setIsUploading(true);

      // Get upload URL from avatar upload API
      const { data: { signedUrl, path, publicUrl } } = await axios.post("/api/upload/avatar", {
        fileName: `profile_${file.name}`
      });

      // Upload to Supabase storage using the signed URL
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      if (!uploadResponse.ok) throw new Error('Upload failed');

      // Update user profile with new image URL
      await axios.patch('/api/user/update', {
        image: publicUrl
      });   

      setUser({
        ...user,
        image: publicUrl
      });

      // Notify parent component
      if (onImageUpdate) onImageUpdate(publicUrl);
      
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadError = (error: { message: string }) => {
    toast.error(error.message);
  };

  return (
    <div className="flex gap-4 h-fit mb-10">
      <div className="relative">
        <Image
        unoptimized
          src={userData?.image || "/Placeholder.webp"}
          width={50}
          height={50}
          alt="Profile picture"
          className="rounded-full object-cover w-16 h-16"
        />
        {isOwner && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="secondary"
                size="icon"
                className="absolute -bottom-1 -right-2.5 border-4 border-background font-bold rounded-full cursor-pointer"
                disabled={isUploading}
              >
                <ImagePlus className="font-bold" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <div className="flex justify-between">
                <AlertDialogTitle>Upload Profile Picture</AlertDialogTitle>
                <AlertDialogCancel className="w-fit rounded-full px-1">
                  <X className="font-bold" size={18} />
                </AlertDialogCancel>
              </div>
              <FileUpload
                className=""
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                maxFileSize={5 * 1024 * 1024} // 5MB
                validateFile={(file) => {
                  if (!file.type.startsWith('image/')) {
                    return {
                      message: 'Please upload an image file',
                      code: 'INVALID_FILE_TYPE'
                    };
                  }
                  return null;
                }}
              />
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <aside className="flex flex-col">
        <h2 className="font-outfit text-2xl tracking-wide font-semibold">
          {userData?.name}
        </h2>
        <h4 className="font-inter text-muted-foreground font-md">
          {`u/${userName}`}
        </h4>
      </aside>
    </div>
  );
}