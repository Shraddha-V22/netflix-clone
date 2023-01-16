import React, { useEffect, useRef, useState } from "react";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";
import profileImg from "/netflix_profile.png";

export default function ProfileMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const profileMenuContainer = useRef<HTMLElement>(null);
  const timerId = useRef(0);

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

  return (
    <section ref={profileMenuContainer} className="relative">
      <section className="flex items-center gap-2">
        <img
          src={profileImg}
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
          <li>username</li>
          <li>Manage Profiles</li>
          <li>Transfer Profile</li>
          <li>Account</li>
          <li>Help Center</li>
          <li className="-mx-4 border-t border-t-gray-500 px-4 pt-2">
            Sign out of Netflix
          </li>
        </ul>
      ) : null}
    </section>
  );
}
