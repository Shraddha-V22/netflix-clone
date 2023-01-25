import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import PlusCircle from "@heroicons/react/24/solid/PlusCircleIcon";
import ModalCard from "./Modal-card";
import {
  useProfilesContext,
  useProfilesDispatchContext,
} from "../commmon/profile-context";
import { ActionType, UserProfile } from "../commmon/types";

export default function Profiles({ edit }: { edit: boolean }) {
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const userProfiles = useProfilesContext();
  const dispatch = useProfilesDispatchContext() as React.Dispatch<ActionType>;
  const [profile, setProfile] = useState<UserProfile>();
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
  function onProfileClick(profile: UserProfile) {
    dispatch({ type: "current", payload: profile });
    navigate("/browse");
  }
  function onEditProfile(profile: UserProfile) {
    setProfile(profile);
    openEditor();
  }
  function onAddProfile() {
    const newProfile: UserProfile = {
      id: "",
      name: "",
      imageUrl: `/profile-${(userProfiles?.profiles?.length ?? 0) + 1}.png`,
    };
    setProfile(newProfile);
    openEditor();
  }
  function onSaveProfile(profile: UserProfile) {
    const action: ActionType = {
      type: profile.id ? "edit" : "add",
      payload: profile,
    };
    dispatch(action);
    setIsProfileEditorOpen(false);
  }
  function onDeleteProfile(profile: UserProfile) {
    dispatch({ type: "delete", payload: profile });
    setIsProfileEditorOpen(false);
  }
  const heading = !edit ? "Who's watching?" : "Manage Profiles";
  return (
    <>
      <h1 className="mb-8 text-5xl">{heading}</h1>
      <section className="flex gap-4">
        {userProfiles?.profiles?.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile as UserProfile}
            onProfileClick={onProfileClick}
            onEditClick={onEditProfile}
            edit={edit}
          />
        ))}
        {(userProfiles?.profiles.length ?? 0) < 3 ? (
          <AddProfile onAddProfile={onAddProfile} />
        ) : null}
      </section>
      {profile ? (
        <EditProfile
          edit={edit}
          isOpen={isProfileEditorOpen} //to open and close edit modal
          title=""
          onClose={closeEditor}
          profile={profile}
          onSave={onSaveProfile}
          onDelete={onDeleteProfile}
        />
      ) : null}
      {edit ? (
        <>
          <ProfileButton className="mt-8" onClick={() => navigate("/")}>
            Done
          </ProfileButton>
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
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
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
  onProfileClick,
  profile,
}: {
  edit: boolean;
  onEditClick: (profile: UserProfile) => void;
  onProfileClick: (profile: UserProfile) => void;
  profile: UserProfile;
}) {
  function editClick(event: React.SyntheticEvent) {
    event.stopPropagation();
    onEditClick(profile);
  }

  const { id, imageUrl, name } = profile;
  return (
    <section
      onClick={() => onProfileClick(profile)}
      id={id}
      className="flex cursor-pointer flex-col place-items-center gap-2 text-gray-400 hover:text-white"
    >
      <section className="relative h-[10vw] max-h-[200px] min-h-[84px] w-[10vw] min-w-[84px] max-w-[200px] overflow-hidden rounded-md border-gray-100 hover:border-4">
        <img src={imageUrl} alt={name} />
        {edit ? (
          <button
            className="absolute inset-0 grid place-items-center bg-black/50"
            onClick={editClick}
          >
            <PencilIcon className="w-[25%] text-white" />
          </button>
        ) : null}
      </section>
      <h1 className="text-xl">{name}</h1>
    </section>
  );
}

function AddProfile({ onAddProfile }: { onAddProfile: () => void }) {
  return (
    <section className="flex cursor-pointer flex-col place-items-center gap-2 text-gray-400">
      <button
        onClick={onAddProfile}
        className="relative grid h-[10vw] max-h-[200px] min-h-[84px] w-[10vw] min-w-[84px] max-w-[200px] place-items-center overflow-hidden rounded-md border-gray-100 hover:border-4 hover:border-gray-100 hover:bg-gray-400 hover:text-white"
      >
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
  profile: UserProfile;
  onSave?: (profile: UserProfile) => void;
  onDelete: (profile: UserProfile) => void;
}) {
  const heading = props.profile.id ? "Edit Profile" : "Add Profile";

  function cancelEdit() {
    props.onClose(false);
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const { profileName } = event.target as typeof event.target & {
      profileName: HTMLInputElement;
    };
    if (props.onSave) {
      let profile: UserProfile = {
        name: profileName.value,
        id: props?.profile.id,
        imageUrl: props?.profile.imageUrl,
      };
      props.onSave(profile);
    }
  }

  return (
    <ModalCard {...props}>
      <section className="h-screen w-screen">
        <form onSubmit={onSubmit} className="mx-auto my-16 max-w-2xl">
          <h1 className="mb-4 text-6xl">{heading}</h1>
          <section className="grid grid-cols-[200px_auto] gap-4 border-t border-b p-4 text-gray-100">
            <section className="aspect-square overflow-hidden rounded-md">
              <img src={props.profile.imageUrl} alt="" />
            </section>
            <section>
              <input
                name="profileName"
                id="profileName"
                defaultValue={props.profile.name}
                type="text"
                className="w-full bg-zinc-500 p-2 px-4 outline-none"
                placeholder="Enter name for the profile"
              />
            </section>
          </section>
          <section className="mt-8 flex gap-4">
            <ProfileButton type="submit">Save</ProfileButton>
            {props.profile.id ? (
              <ProfileButton
                onClick={() => props.onDelete(props.profile)}
                type="button"
                buttonType="secondary"
              >
                Delete Profile
              </ProfileButton>
            ) : null}
            <ProfileButton
              type="button"
              buttonType="secondary"
              onClick={cancelEdit}
            >
              Cancel
            </ProfileButton>
          </section>
        </form>
      </section>
    </ModalCard>
  );
}
