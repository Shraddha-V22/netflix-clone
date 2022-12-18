import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import PlusCircle from "@heroicons/react/24/solid/PlusCircleIcon";
import ModalCard from "./Modal-card";

export default function Profiles({ edit }: { edit: boolean }) {
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const navigate = useNavigate();
  function manageProfiles() {
    navigate("/manageProfiles");
  }
  function closeEditor() {
    setIsProfileEditorOpen(false);
  }
  function openEditor() {
    setIsProfileEditorOpen(true);
  }
  const heading = !edit ? "Who's watching?" : "Manage Profiles";
  return (
    <>
      <h1 className="mb-8 text-5xl">{heading}</h1>
      <section className="flex gap-4">
        <ProfileCard onEditClick={openEditor} edit={edit} />
        <ProfileCard onEditClick={openEditor} edit={edit} />
        <AddProfile />
      </section>
      {edit ? (
        <>
          <ProfileButton>Done</ProfileButton>
          <EditProfile
            edit={edit}
            isOpen={isProfileEditorOpen}
            title=""
            onClose={closeEditor}
          />
        </>
      ) : (
        <ProfileButton
          onClick={manageProfiles}
          className="mt-8"
          buttonType="secondary"
        >
          Manage Profiles
        </ProfileButton>
      )}
    </>
  );
}

function ProfileButton({
  buttonType = "primary",
  ...props
}: {
  buttonType?: "primary" | "secondary";
} & React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`${
        buttonType === "primary"
          ? "bg-gray-100 text-dark hover:bg-netflixRed hover:text-white"
          : "border border-white text-gray-400 hover:text-white"
      } py-2 px-4 text-xl ${props.className}`}
    >
      {props.children}
    </button>
  );
}

function ProfileCard({
  edit,
  onEditClick,
}: {
  edit: boolean;
  onEditClick: () => void;
}) {
  return (
    <section className="flex cursor-pointer flex-col place-items-center gap-2 text-gray-400 hover:text-white">
      <section className="relative h-[10vw] max-h-[200px] min-h-[84px] w-[10vw] min-w-[84px] max-w-[200px] overflow-hidden rounded-md border-gray-100 hover:border-4">
        <img src="/netflix_profile.png" alt="User profile image" />
        {edit ? (
          <button
            className="absolute inset-0 grid place-items-center bg-black/50"
            onClick={onEditClick}
          >
            <PencilIcon className="w-[25%] text-white" />
          </button>
        ) : null}
      </section>
      <h1 className="text-xl">profile name</h1>
    </section>
  );
}

function AddProfile() {
  return (
    <section className="flex cursor-pointer flex-col place-items-center gap-2 text-gray-400">
      <button className="relative grid h-[10vw] max-h-[200px] min-h-[84px] w-[10vw] min-w-[84px] max-w-[200px] place-items-center overflow-hidden rounded-md border-gray-100 hover:border-4 hover:border-gray-100 hover:bg-gray-400 hover:text-white">
        <PlusCircle className="w-[75%]" />
      </button>
    </section>
  );
}

function EditProfile(props: {
  isOpen: boolean;
  onClose: (value: boolean) => void;
  title: string;
  edit?: boolean;
}) {
  const heading = props.edit ? "Edit Profile" : "Add Profile";

  function cancelEdit() {
    props.onClose(false);
  }

  return (
    <ModalCard {...props}>
      <section className="h-screen w-screen">
        <section className="mx-auto my-16 max-w-4xl">
          <h1 className="mb-4 text-6xl">{heading}</h1>
          <section className="grid grid-cols-[200px_auto] gap-4 border-t border-b p-4 text-gray-100">
            <section className="aspect-square overflow-hidden rounded-md">
              <img src="/netflix_profile.png" alt="" />
            </section>
          </section>
          <section>
            <input
              type="text"
              className="w-full bg-zinc-500 p-2 outline-none"
              placeholder="Enter name for the profile"
            />
          </section>
          <section className="mt-8 flex gap-4">
            <ProfileButton>Save</ProfileButton>
            <ProfileButton buttonType="secondary" onClick={cancelEdit}>
              Cancel
            </ProfileButton>
          </section>
        </section>
      </section>
    </ModalCard>
  );
}
