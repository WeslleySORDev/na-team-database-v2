"use client";
import { useTeams } from "@/contexts/TeamsContext";
import { TeamCard } from "@/app/components/home/team-card";
import { CHARACTERS } from "@/data/characters";
import { useAuth } from "@/contexts/AuthContext";

export function MyTeamList() {
  const { user } = useAuth();
  const { teams } = useTeams();

  const getCharacterImages = () => {
    const images: Record<string, string> = {};
    CHARACTERS.forEach((char) => {
      images[char.name] = char.url;
    });
    return images;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {teams.filter(team => team.uid === user?.uid).map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          characterImages={getCharacterImages()}
        />
      ))}
    </div>
  );
}
