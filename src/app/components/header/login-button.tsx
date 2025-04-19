"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import Image from "next/image";

import { LogOut, User, UserIcon, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";

export function LoginButton() {
  const { user, signOut, signInWithGoogle, userNickname } = useAuth();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <>
      {user ? (
        <div className="relative">
          <button
            onClick={toggleUserMenu}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white">
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || userNickname || "User Avatar"}
                  fill
                  className="object-cover"
                />
              ) : (
                <UserIcon className="h-5 w-5 text-white" />
              )}
            </div>
            <span>{userNickname || user?.displayName || "Usuário"}</span>
          </button>
          {isUserMenuOpen && (
            <div
              ref={userMenuRef}
              className="absolute left-0 mt-2 w-52 bg-white rounded-md border z-10"
            >
              <Link
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                href="/profile"
              >
                <User className="mr-2 h-4 w-4 inline-block" />
                Meu Perfil
              </Link>
              <Separator />
              <Link
                href="/my-teams"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                <Users className="mr-2 h-4 w-4 inline-block" /> Meus Times
              </Link>
              <Separator />
              <button
                onClick={signOut}
                className="block w-full cursor-pointer text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                <LogOut className="mr-2 h-4 w-4 inline-block" />
                Sair
              </button>
            </div>
          )}
        </div>
      ) : (
        <Button className="cursor-pointer" onClick={signInWithGoogle} variant="secondary">
          <User className="mr-2 h-4 w-4" />
          Login com Google
        </Button>
      )}
    </>
  );
}
