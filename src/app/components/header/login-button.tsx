"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, User, UserIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LoginButton() {
  const { user, signOut, signInWithGoogle, userNickname } = useAuth();

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 cursor-pointer">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white">
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || userNickname || "User Avatar"}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                ) : (
                  <UserIcon className="h-5 w-5 text-white" />
                )}
              </div>
              <span className="hidden sm:block">{userNickname || user?.displayName || "Usuário"}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center space-x-2">
                <User className="mr-2 h-4 w-4" />
                Meu Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/my-teams" className="flex items-center space-x-2">
                <Users className="mr-2" />
                Meus Times
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={signOut}
              className="cursor-pointer flex items-center space-x-2"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          className="cursor-pointer"
          onClick={signInWithGoogle}
          variant="secondary"
        >
          <Image
            src="./assets/google-icon.svg"
            alt="Icone do google"
            width={16}
            height={16}
          />
          <span className="hidden sm:block sm:ml-2">Login com Google</span>
        </Button>
      )}
    </>
  );
}
