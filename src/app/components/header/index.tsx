import Link from "next/link";

import { ModeToggle } from "@/app/components/header/mode-toggle";

import { LoginButton } from "./login-button";

export default function Header() {
  return (
    <header className="sticky top-0 bg-background z-50 flex flex-col items-center p-4 py-4 justify-between border-b sm:px-6 md:px-12 lg:px-32 sm:flex-row">
      <Link className="text-3xl font-semibold tracking-tight" href="/">
        NA Team Database
      </Link>
      <div className="flex items-center gap-4">
        <LoginButton />
        <ModeToggle />
      </div>
    </header>
  );
}
