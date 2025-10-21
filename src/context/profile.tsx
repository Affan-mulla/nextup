import React, { createContext, useContext } from "react";

export interface ProfileContextValue {
  userData: { id: string; username?: string; name?: string | null | undefined; image?: string | null | undefined } | null;
  isOwner: boolean;
}

export const ProfileContext = createContext<ProfileContextValue>({ userData: null, isOwner: false });

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ProfileContext.Provider;

export default ProfileContext;
