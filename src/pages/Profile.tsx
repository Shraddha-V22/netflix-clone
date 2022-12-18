import React from "react";
import Profiles from "../components/Profiles";

export default function Profile({ edit = false }: { edit?: boolean }) {
  return (
    <article className="grid min-h-screen place-content-center place-items-center">
      <Profiles edit={edit} />
    </article>
  );
}
