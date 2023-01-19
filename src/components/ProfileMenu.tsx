import React, { useEffect, useRef, useState } from "react";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";
// import profileImg from "/netflix_profile.png";
import { useAuth } from "../commmon/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  useProfilesContext,
  useProfilesDispatchContext,
} from "../commmon/profile-context";
import { ActionType, UserProfile } from "../commmon/types";

export default function ProfileMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const profileMenuContainer = useRef<HTMLElement>(null);
  const timerId = useRef(0);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const userProfiles = useProfilesContext();
  const dispatch = useProfilesDispatchContext();
  const currentProfile = userProfiles?.profiles.find(
    (profile) => profile.id === userProfiles.selectedProfileId
  );

  function onMouseEnter() {
    if (timerId.current) {
      //if timerId is available then clear clear timeout and set show menu to true
      clearTimeout(timerId.current);
    }
    setShowMenu(true);
  }

  function onMouseLeave() {
    timerId.current = setTimeout(() => {
      //hide menu after 300ms
      setShowMenu(false);
    }, 300);
  }

  useEffect(() => {
    profileMenuContainer.current?.addEventListener("mouseenter", onMouseEnter);
    profileMenuContainer.current?.addEventListener("mouseleave", onMouseLeave);

    return () => {
      profileMenuContainer.current?.removeEventListener(
        "mouseenter",
        onMouseEnter
      );
      profileMenuContainer.current?.removeEventListener(
        "mouseleave",
        onMouseLeave
      );
    };
  }, []);

  async function signOutOfNetflix() {
    await signOut();
    dispatch({ type: "load", payload: null });
    navigate("/login");
  }

  function loadProfile(profile: UserProfile) {
    dispatch({ type: "current", payload: profile });
    window.location.reload();
  }

  return (
    <section ref={profileMenuContainer} className="relative">
      <section className="flex items-center gap-2">
        <img
          src={currentProfile?.imageUrl}
          alt="User profile img"
          className="h-10 w-10 rounded-md"
        />
        <ChevronDownIcon
          style={{ strokeWidth: ".2rem" }}
          className={`h-6 w-6 transition-transform duration-300 ${
            showMenu ? "rotate-180" : ""
          }`}
        />
      </section>
      {showMenu ? (
        <ul className="absolute top-[60px] -left-20 flex w-[200px] flex-col justify-center gap-4 bg-dark px-4 py-2">
          {userProfiles?.profiles
            .filter((profile) => profile.id !== currentProfile?.id)
            ?.map((profile) => (
              <li
                key={profile.id}
                onClick={() => loadProfile(profile)}
                className="flex cursor-pointer items-center gap-2 hover:underline"
              >
                <img
                  className="h-8 w-8"
                  src={profile.imageUrl}
                  alt={profile.name}
                />
                {profile.name}
              </li>
            ))}
          <li
            className={
              (userProfiles?.profiles.length ?? 0) > 1
                ? `-mx-4 border-t border-t-gray-500 px-4 pt-2`
                : ""
            }
          >
            <Link className="hover:underline" to="/manageProfiles">
              Manage Profiles
            </Link>
          </li>
          <li>Transfer Profile</li>
          <li>Account</li>
          <li>Help Center</li>
          <li
            onClick={signOutOfNetflix}
            className="-mx-4 cursor-pointer border-t border-t-gray-500 px-4 pt-2 hover:underline"
          >
            Sign out of Netflix
          </li>
        </ul>
      ) : null}
    </section>
  );
}
