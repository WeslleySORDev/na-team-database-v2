"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function ProfilePage() {
  const { theme } = useTheme();
  const router = useRouter();
  const { user, updateNickname } = useAuth();
  const [nickname, setNickname] = useState("");
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);
  useEffect(() => {
    const fetchNickname = async () => {
      if (user?.uid) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setNickname(userData?.nickname || null);
          } else {
            console.log("No such document!");
            setNickname("");
          }
        } catch (error) {
          console.error("Error fetching user nickname:", error);
          setNickname("");
        }
      }
    };

    fetchNickname();
  }, [user, db]);

  const handleSaveNickname = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      toast("Erro", {
        description: "O nickname não pode estar vazio.",
      });
      return;
    }

    try {
      updateNickname(nickname);

      toast("Nickname atualizado", {
        description: "Seu nickname foi atualizado com sucesso.",
      });
    } catch {
      toast("Erro", {
        description: "Ocorreu um erro ao atualizar seu nickname.",
      });
    }
  };

  if (user)
    return (
      <div className="container mx-auto py-8 px-4 max-w-md">
        <div className="mb-6 flex items-center">
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={user.photoURL || "/placeholder.svg"}
                alt={user.displayName as string}
              />
              <AvatarFallback>
                {user.displayName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.displayName}</CardTitle>
              <CardDescription>Altere seu nickname abaixo</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveNickname} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nickname">Nickname</Label>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Digite seu novo nickname"
                />
              </div>
              <Button type="submit" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </form>
          </CardContent>
        </Card>
        <Toaster theme={theme as "light" | "dark" | "system" | undefined} />
      </div>
    );
}
