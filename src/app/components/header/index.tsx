import Link from "next/link";

import { ModeToggle } from "@/app/components/header/mode-toggle";

import { LoginButton } from "./login-button";

export default function Header() {
  return (
    <header className="flex items-center px-32 py-4 justify-between border-b">
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
