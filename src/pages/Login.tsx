import React, { FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import netflixLogo from "../assets/Netflix_Logo_RGB.png";
import { AuthContextType, useAuth } from "../commmon/auth";

export default function Login() {
  const { signIn, user } = useAuth() as AuthContextType;
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  async function authenticateUser(event: React.SyntheticEvent) {
    event.preventDefault();
    const { email, password } = event.target as typeof event.target & {
      email: HTMLInputElement;
      password: HTMLInputElement;
    };
    await signIn(email.value, password.value);
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
          onSubmit={authenticateUser}
          className="relative mx-auto w-[380px] rounded-lg bg-black/75 p-16"
        >
          <article className="text-gray-300">
            <h1 className="mb-4 text-center text-4xl text-white">Sign In</h1>
            <section className="mb-4 flex flex-col gap-4">
              <input
                className="rounded-md bg-zinc-500 p-2 outline-none"
                type="email"
                name="email"
                id="email"
                placeholder="Enter email"
              />
              <input
                className="rounded-md bg-zinc-500 p-2 outline-none"
                type="password"
                name="password"
                id="password"
                placeholder="Enter password"
              />
              <button className="my-8 rounded-md bg-netflixRed p-2 font-semibold text-white outline-none">
                Sign In
              </button>
            </section>
            <p>
              New to Netflix?{" "}
              <Link to="/signup" className="text-white hover:underline">
                Sign Up now.
              </Link>
            </p>
          </article>
        </form>
      </main>
    </>
  );
}
