"use client";

import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useTeams } from "@/contexts/TeamsContext";
import { CHARACTERS } from "@/data/characters";
import { Team } from "@/types/team";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function TeamPage() {
  const router = useRouter();
  const params = useParams();
  const { teams, deleteTeam, toggleLike } = useTeams();
  const { user, accessLevel } = useAuth();
  const [canDelete, setCanDelete] = useState(false);
  const [team, setTeam] = useState<Team | null>(null);
  const teamId = params.id as string;

  useEffect(() => {
    const foundTeam = teams.find((t) => t.id === teamId);
    if (foundTeam) {
      setTeam(foundTeam);
    } else {
      router.push("/");
    }
  }, [teamId, teams, router]);

  useEffect(() => {
    setCanDelete(
      !!team && !!user && (team.uid === user.uid || accessLevel === 2)
    );
  }, [team, user, accessLevel]);

  const handleDeleteTeam = useCallback(async () => {
    if (!team) return;

    if (!canDelete) {
      alert("Você não tem permissão para excluir este time.");
      return;
    }

    if (confirm("Tem certeza que deseja excluir este time?")) {
      try {
        await deleteTeam(teamId);
        router.push("/");
      } catch (error) {
        console.error("Erro ao excluir o time:", error);
        alert("Ocorreu um erro ao excluir o time.");
      }
    }
  }, [team, canDelete, deleteTeam, teamId, router]);

  return (
    <main className="relative container mx-auto px-4 py-12">
      {canDelete ? (
        <Button className="absolute top-12 right-12" onClick={handleDeleteTeam}>
          Excluir Time
        </Button>
      ) : (
        <span className="absolute top-12 right-12 underline">
          Você só pode excluir um time que você criou
        </span>
      )}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <CardTitle className="text-3xl font-bold mr-3">
                {team?.name}
              </CardTitle>
              <Button
                className={`cursor-pointer border border-foreground ${
                  team?.likes.includes(user?.uid as string)
                    ? "bg-blue-600"
                    : "bg-background"
                }`}
                onClick={() => toggleLike(team?.id as string)}
                variant="ghost"
              >
                <ThumbsUp
                  className={`w-4 h-4 ${
                    team?.likes.includes(user?.uid as string)
                      ? "stroke-white"
                      : "stroke-foreground"
                  }`}
                />
              </Button>
            </div>
            <Badge variant={team?.type === "ladder" ? "secondary" : "default"}>
              {team?.type === "ladder" ? "Ladder" : "Quick Game"}
            </Badge>
          </div>
          <span>Contagem de likes: {team?.likes.length}</span>
        </CardHeader>
        <CardContent className="flex justify-center space-x-4 my-6">
          {team?.characters?.map((charName, index) => {
            const character = CHARACTERS.find((c) => c.name === charName);
            return (
              <div
                key={index}
                className="relative w-24 h-24 rounded-full overflow-hidden"
              >
                <Image
                  src={character?.url || "/placeholder.svg"}
                  alt={charName}
                  fill
                  className="object-cover"
                  style={{ objectFit: "cover" }}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </main>
  );
}
