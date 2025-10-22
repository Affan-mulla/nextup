"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import Loader from "../Loader";
import { SettingFormType, settingFormSchema } from "@/lib/validation";
import { User } from "@/types/store-types";

interface Props {
  userId: string;
  username: string;
  name?: string;
  email: string;
  jobRole?: string;
  bio?: string;
  setUser: (user: User) => void;
}

const SettingForm = ({ userId, username, name, email, jobRole, bio ,  setUser}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SettingFormType>({
    resolver: zodResolver(settingFormSchema),
    defaultValues: { userId, username, name, email, jobRole, bio },
  });

  const submitHandler = async (data: SettingFormType) => {
    setIsSubmitting(true);
    try {
      const res = await axios.put("/api/user/update-profile", data);
      if (res.status !== 200) throw new Error("Failed to update profile");
      setUser(res.data);
      toast.success("Profile updated successfully");

    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="flex justify-center w-full px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-3xl w-full">
        <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-6">
          {/* Name + Username */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...form.register("username")} />
              {form.formState.errors.username && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.username.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...form.register("email")} disabled />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="jobRole">Role</Label>
            <Input id="jobRole" {...form.register("jobRole")} />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us something about yourself..."
              maxLength={150}
              {...form.register("bio")}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default SettingForm;
