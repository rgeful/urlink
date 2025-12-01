"use client";

import Link from "next/link";
import { FormEvent } from "react";
import Image from "next/image";

export default function SignupPage() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex w-full max-w-6xl mx-auto px-4">
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            <div className="text-left space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">
                create your account
              </h1>
              <p className="text-sm text-neutral-500">
                sign up to start building ur link profile
              </p>
            </div>

            <div className="bg-white/80 rounded-2xl shadow-sm p-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-black"
                  >
                    name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="urname"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-1"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-black"
                  >
                    email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-1"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-black"
                  >
                    password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-1"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-gray-950 hover:bg-black transition-colors text-white text-sm font-medium py-2.5"
                >
                  sign up
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-neutral-500">
                already have an account?{" "}
                <Link
                  href="/login"
                  className="text-gray-700 font-medium hover:underline"
                >
                  log in
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex w-1/2 items-center justify-center">
          <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-sm">
            <Image
              src="/auth-image.jpg"
              alt="Auth Image"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
