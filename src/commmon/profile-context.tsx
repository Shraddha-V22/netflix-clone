import React, { createContext, useContext, useEffect, useReducer } from "react";
import profilesReducer from "../reducer/profilesReducer";
import { useAuth } from "./auth";
import { ActionType, ProfileContextType, UserProfile } from "./types";

type StoredProfiles = Map<string, ProfileContextType>;

const LOCAL_STORAGE_KEY = "profiles";

const ProfileContext = createContext<ProfileContextType | null>(null);

const ProfileDispatchContext = createContext<React.Dispatch<ActionType> | null>(
  null
);

export default function ProfileProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const { user } = useAuth();

  const userProfiles = findProfiles(user?.email as string);

  const [state, dispatch] = useReducer(profilesReducer, userProfiles);

  useEffect(() => {
    if (user?.email) {
      if (state) {
        const storedProfiles = getProfiles(); //get stored profiles
        storedProfiles.set(user.email, state as ProfileContextType); //add new element to map with user.email and state
        updateProfiles(storedProfiles); //sync with local storage
      } else {
        dispatch({ type: "load", payload: userProfiles }); //if no state -> load userProfiles as payload
      }
    }
  }, [user?.email, state]); //on user's email change

  return (
    <ProfileContext.Provider value={state}>
      <ProfileDispatchContext.Provider value={dispatch}>
        {children}
      </ProfileDispatchContext.Provider>
    </ProfileContext.Provider>
  );
}

function getProfiles(): StoredProfiles {
  return new Map(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]"));
}

function findProfiles(id: string) {
  const profiles = getProfiles();
  return id ? profiles.get(id) ?? null : null;
}

function updateProfiles(profiles: StoredProfiles) {
  //updating profile in localstorage
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(profiles)));
}

export const useProfilesContext = () => useContext(ProfileContext);
export const useProfilesDispatchContext = () =>
  useContext(ProfileDispatchContext) as React.Dispatch<ActionType>;
