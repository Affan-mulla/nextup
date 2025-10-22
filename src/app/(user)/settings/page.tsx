"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useStore } from "@/store/store";
import { User } from "@/types/store-types";
import Loader from "@/components/kokonutui/loader";
import ProfileDetails from "@/app/_components/Profile/ProfileDetails";
import SettingForm from "@/components/forms/setting-form";

const SettingsPage = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const { user, setUser } = useStore();

  useEffect(() => {
    if (user?.id) setUserData(user);
  }, [user]);

  if (!user || !userData) return <Loader size="sm" />;

  return (
    <motion.div
      className="h-full w-full text-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-full"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8 w-full">
          <ProfileDetails
            userData={userData}
            userName={userData.username ?? ""}
            isOwner
          />
        </div>
        <SettingForm
          userId={userData.id}
          username={userData.username}
          name={userData.name}
          email={userData.email}
          jobRole={userData.jobRole}
          bio={userData.bio}
          setUser={setUser}
        />
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;
