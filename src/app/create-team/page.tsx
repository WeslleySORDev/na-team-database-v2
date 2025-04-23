"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { CHARACTERS } from "@/data/characters";
import { MISSIONS } from "@/data/missions";
import { Character } from "@/types/character";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Info, Users, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast, Toaster } from "sonner";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTeams } from "@/contexts/TeamsContext";
import { version } from "@/data/characters";
import { useTheme } from "next-themes";

function CharacterSelector({
  characters,
  selectedCharacters,
  onSelect,
}: {
  characters: Character[];
  selectedCharacters: string[];
  onSelect: (name: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-4">
      {characters.map((character) => (
        <div
          key={character.name}
          className={`cursor-pointer rounded-full overflow-hidden border transition-all ${
            selectedCharacters.includes(character.name)
              ? "border-primary ring-2 ring-primary ring-offset-2"
              : "border-border hover:border-muted-foreground"
          }`}
          onClick={() => onSelect(character.name)}
        >
          <div className="aspect-square relative">
            <Image
              src={character.url || "/placeholder.svg"}
              alt={character.name}
              fill
              className="object-cover"
            />
            {selectedCharacters.includes(character.name) && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center">
                {selectedCharacters.indexOf(character.name) + 1}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
function MissionSelector({
  missions,
  selectedMissions,
  onAddMission,
  onRemoveMission,
}: {
  missions: string[];
  selectedMissions: string[];
  onAddMission: (mission: string) => void;
  onRemoveMission: (mission: string) => void;
}) {
  const [missionInput, setMissionInput] = useState("");

  const filteredMissions = missions.filter((mission) =>
    mission.toLowerCase().includes(missionInput.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Buscar missão..."
          value={missionInput}
          onChange={(e) => setMissionInput(e.target.value)}
          className="flex-1"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Info className="h-4 w-4 mr-2" />
              Ajuda
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sobre as Missões</DialogTitle>
              <DialogDescription>
                As missões são obrigatórias apenas para times do tipo Quick
                Game. Selecione as missões que seu time realizará.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <p className="text-sm">Exemplos de missões:</p>
              <ul className="list-disc pl-5 text-sm">
                <li>Proteger o construtor de pontes</li>
                <li>Exame Chunin</li>
                <li>Resgate do Kazekage</li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {selectedMissions.length > 0 ? (
          <div className="space-y-2">
            {selectedMissions.map((mission) => (
              <div
                key={mission}
                className="flex items-center justify-between bg-muted p-2 rounded-md"
              >
                <span className="text-sm">{mission}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveMission(mission)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remover</span>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground bg-muted/50 rounded-md border border-dashed">
            <p className="text-sm">Nenhuma missão selecionada</p>
          </div>
        )}
      </div>

      <div className="max-h-48 overflow-y-auto border rounded-md">
        {filteredMissions.length > 0 ? (
          <div className="divide-y">
            {filteredMissions.map((mission) => (
              <button
                key={mission}
                className="w-full text-left px-3 py-2 hover:bg-muted text-sm flex items-center justify-between"
                onClick={() => onAddMission(mission)}
                disabled={selectedMissions.includes(mission)}
              >
                <span>{mission}</span>
                {selectedMissions.includes(mission) ? (
                  <Badge variant="outline">Selecionada</Badge>
                ) : (
                  <Badge variant="outline" className="opacity-0">
                    Selecionada
                  </Badge>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            <p className="text-sm">Nenhuma missão encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreateTeamPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamType, setTeamType] = useState<"quick" | "ladder">("quick");
  const [selectedMissions, setSelectedMissions] = useState<string[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { addTeam } = useTeams();
  const { user, accessLevel, loading } = useAuth();

  const handleCharacterSelect = (characterName: string) => {
    if (selectedCharacters.includes(characterName)) {
      setSelectedCharacters(
        selectedCharacters.filter((name) => name !== characterName)
      );
    } else if (selectedCharacters.length < 3) {
      setSelectedCharacters([...selectedCharacters, characterName]);
    }
  };

  const handleAddMission = (mission: string) => {
    if (!selectedMissions.includes(mission)) {
      setSelectedMissions([...selectedMissions, mission]);
    }
  };

  const handleRemoveMission = (mission: string) => {
    setSelectedMissions(selectedMissions.filter((m) => m !== mission));
  };

  const handleSaveTeam = async (event: FormEvent) => {
    event.preventDefault();

    if (!teamName.trim()) {
      toast("Erro", {
        description: "Por favor, dê um nome ao seu time!",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      });
      return;
    }

    if (!teamDescription.trim() || teamDescription.length < 32) {
      toast("Erro", {
        description:
          "Um time precisa de uma descrição que tenha ao menos 32 caracteres!",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      });
      return;
    }

    if (selectedCharacters.length !== 3) {
      toast("Erro", {
        description: "Selecione exatamente 3 personagens para o seu time!",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      });
      return;
    }

    if (teamType === "quick" && selectedMissions.length <= 0) {
      toast("Erro", {
        description: "Adicione pelo menos uma missão para o seu time!",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      });
      return;
    }

    setIsSaving(true);
    try {
      await addTeam({
        name: teamName,
        description: teamDescription,
        type: teamType,
        missions: teamType === "quick" ? selectedMissions : [],
        characters: selectedCharacters,
        version: version,
        likes: [],
      });
      toast("Time criado com sucesso!", {
        description: `O time ${teamName} foi criado com sucesso.`,
      });
      router.push("/");
    } catch (error) {
      console.error("Erro ao salvar o time:", error);
      toast("Erro", {
        description: "Ocorreu um erro ao salvar o time.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Tela de carregamento
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">
          Carregando informações de autenticação...
        </p>
      </div>
    );
  }

  // Tela de acesso negado
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4 text-destructive">
          Acesso Negado
        </h2>
        <p className="text-muted-foreground mb-4">
          Faça o login e/ou atualize seu nickname na página <Link className="underline underline-offset-1" href="/profile">Meu Perfil</Link>
        </p>
        <Button asChild>
          <Link href="/">Voltar para a página inicial</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Criar Novo Time</h1>
        <p className="text-muted-foreground mt-1">
          Selecione 3 personagens para formar seu time.
        </p>
      </div>

      <Tabs defaultValue="characters" className="mb-8">
        <TabsList>
          <TabsTrigger value="characters" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Personagens
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Detalhes do Time
          </TabsTrigger>
        </TabsList>

        <TabsContent value="characters" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Selecione 3 Personagens</CardTitle>
              <CardDescription>
                Clique nos personagens para adicioná-los ao seu time. Você pode
                selecionar até 3 personagens.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CharacterSelector
                characters={CHARACTERS}
                selectedCharacters={selectedCharacters}
                onSelect={handleCharacterSelect}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Time</CardTitle>
              <CardDescription>
                Preencha as informações do seu time e configure suas missões.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveTeam} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="team-name">Nome do Time*</Label>
                    <Input
                      id="team-name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Digite o nome do time"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="team-description">Estratégia do Time</Label>
                    <Textarea
                      id="team-description"
                      value={teamDescription}
                      onChange={(e) => setTeamDescription(e.target.value)}
                      placeholder="Descreva como usar este time, estratégias e dicas..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Tipo de Time*</Label>
                    <RadioGroup
                      value={teamType}
                      onValueChange={(value) =>
                        setTeamType(value as "quick" | "ladder")
                      }
                      className="flex gap-4 mt-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="quick" id="quick" />
                        <Label htmlFor="quick">Quick Game</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ladder" id="ladder" />
                        <Label htmlFor="ladder">Ladder</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {teamType === "quick" && (
                    <div>
                      <Label>Missões*</Label>
                      <div className="mt-1">
                        <MissionSelector
                          missions={MISSIONS}
                          selectedMissions={selectedMissions}
                          onAddMission={handleAddMission}
                          onRemoveMission={handleRemoveMission}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>
                      Personagens Selecionados ({selectedCharacters.length}/3)*
                    </Label>
                    <div className="mt-2">
                      {selectedCharacters.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground bg-muted/50 rounded-md border border-dashed">
                          <p>Nenhum personagem selecionado</p>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-4 py-6 bg-muted/50 rounded-md border border-dashed">
                          {selectedCharacters.map((charName) => {
                            const character = CHARACTERS.find(
                              (c) => c.name === charName
                            );
                            return (
                              <div key={charName} className="relative">
                                <Avatar className="h-16 w-16 border-2 border-background">
                                  <AvatarImage
                                    src={character?.url || "/placeholder.svg"}
                                    alt={charName}
                                  />
                                  <AvatarFallback>
                                    {charName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCharacterSelect(charName)
                                  }
                                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center hover:bg-destructive/90"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={isSaving} className="w-full">
                    {isSaving ? "Salvando..." : "Salvar Time"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster theme={theme as "light" | "dark" | "system" | undefined} />
    </div>
  );
}
