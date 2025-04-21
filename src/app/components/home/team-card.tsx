"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { Team } from "@/types/team";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import Image from "next/image";
import { Eye } from "lucide-react";

type TeamCardProps = {
  team: Team;
  characterImages: Record<string, string>;
};

export function TeamCard({ team, characterImages }: TeamCardProps) {
  const [creatorNickname, setCreatorNickname] = useState<string | null>(null);
  const [loadingCreatorNickname, setLoadingCreatorNickname] = useState(true);

  useEffect(() => {
    if (team.uid) {
      const fetchCreatorNickname = async () => {
        setLoadingCreatorNickname(true);
        try {
          const userDocRef = doc(db, "users", team.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setCreatorNickname(
              docSnap.data()?.nickname || "Usuário Desconhecido"
            );
          } else {
            setCreatorNickname("Usuário Desconhecido");
          }
        } catch (error) {
          console.error("Erro ao buscar nickname do criador:", error);
          setCreatorNickname("Erro ao Carregar");
        } finally {
          setLoadingCreatorNickname(false);
        }
      };

      fetchCreatorNickname();
    } else {
      setLoadingCreatorNickname(false);
      setCreatorNickname(null);
    }
  }, [team.uid]);

  function formatMillisecondsTimestampToDDMMYYYY(milliseconds: number) {
    const date = new Date(milliseconds);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{team.name}</CardTitle>
            {team.type && <Badge>{team.type}</Badge>}
          </div>
          <CardDescription className="text-sm">
            <div className="flex flex-col gap-1">
              {team.uid && (
                <h4 className="text-sm font-bold">
                  Criador:{" "}
                  {loadingCreatorNickname ? "Carregando..." : creatorNickname}
                </h4>
              )}
              <h4 className="text-sm font-bold">
                Data de criação:{" "}
                {formatMillisecondsTimestampToDDMMYYYY(team.createdAt)}
              </h4>
            </div>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="py-4 sm:py-6">
        <div className="flex flex-col gap-4 sm:gap-6 items-center">
          <div className="flex justify-center items-center gap-2 sm:gap-4">
            {team.characters.map((charName, index) => (
              <div
                key={index}
                className="relative w-20 h-20 rounded-full overflow-hidden"
              >
                <Image
                  src={characterImages[charName] || "/placeholder.svg"}
                  alt={charName}
                  fill
                  className="object-cover"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
          {team.description && (
            <p className="text-sm text-gray-600 mt-3 line-clamp-2">
              {team.description}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button className="w-full" asChild>
          <Link href={`/teams/${team.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalhes
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
