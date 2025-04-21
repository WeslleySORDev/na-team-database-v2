"use client";
import { useTeams } from "@/contexts/TeamsContext";
import { TeamCard } from "@/app/components/home/team-card";
import { CHARACTERS } from "@/data/characters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TeamList() {
  const { teams } = useTeams();

  const getCharacterImages = () => {
    const images: Record<string, string> = {};
    CHARACTERS.forEach((char) => {
      images[char.name] = char.url;
    });
    return images;
  };

  return (
    <Tabs defaultValue="all">
      <TabsList className="w-full sm:w-fit">
        <TabsTrigger className="cursor-pointer text-base" value="all">Todos os times</TabsTrigger>
        <TabsTrigger className="cursor-pointer text-base" value="ladder">Ladder</TabsTrigger>
        <TabsTrigger className="cursor-pointer text-base" value="quick">Quick</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              characterImages={getCharacterImages()}
            />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="ladder">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {teams
            .filter((team) => team.type === "ladder")
            .map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                characterImages={getCharacterImages()}
              />
            ))}
        </div>
      </TabsContent>
      <TabsContent value="quick">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {teams
            .filter((team) => team.type === "quick")
            .map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                characterImages={getCharacterImages()}
              />
            ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
