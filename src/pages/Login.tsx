import React, { FormEvent } from "react";
import netflixLogo from "../assets/Netflix_Logo_RGB.png";

export default function Login() {
  function signIn(event: FormEvent) {
    event.preventDefault();
    const { email, password } = event.target as any;
    console.log(email.value, password.value);
  }

  return (
    <>
      <header className="relative z-[1] w-56">
        <img className="h-full w-full" src={netflixLogo} alt="Netflix logo" />
      </header>
      <main>
        <section
          className={`absolute top-0 -z-[1] min-h-screen w-full bg-[url("/netflix_bg_img.jpg")] bg-cover`}
        ></section>
        <section className="absolute inset-0 bg-gradient-to-b from-zinc-900/50"></section>
        <form
          onSubmit={signIn}
          className="relative mx-auto min-h-[70vh] w-[450px] rounded-lg bg-black/75 p-16"
        >
          <article>
            <h1 className="mb-4 text-4xl">Sign In</h1>
            <section className="mb-4 flex flex-col gap-4">
              <input
                className="rounded-md bg-zinc-500 p-2 text-gray-300"
                type="email"
                name="email"
                id="email"
              />
              <input
                className="rounded-md bg-zinc-500 p-2 text-gray-300"
                type="password"
                name="password"
                id="password"
              />
              <button className="my-8 rounded-md bg-netflixRed p-2 font-semibold">
                Sign In
              </button>
            </section>
            <p>New to Netflix? Sign Up</p>
          </article>
        </form>
      </main>
    </>
  );
}
