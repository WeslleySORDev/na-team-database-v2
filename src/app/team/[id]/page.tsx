"use client";

import {
  ChevronDown,
  Heart,
  Info,
  MessageSquare,
  Target,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useTeams } from "@/contexts/TeamsContext";
import { CHARACTERS } from "@/data/characters";
import { Team } from "@/types/team";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Character } from "@/types/character";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function TeamPage() {
  const router = useRouter();
  const params = useParams();
  const { teams, deleteTeam, toggleLike } = useTeams();
  const { user, accessLevel } = useAuth();
  const [canDelete, setCanDelete] = useState(false);
  const [team, setTeam] = useState<Team | null>(null);
  const [comment, setComment] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [creatorNickname, setCreatorNickname] = useState<string | null>(null);
  const [loadingCreatorNickname, setLoadingCreatorNickname] = useState(true);
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

  useEffect(() => {
    if (team && team.uid) {
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
  }, [team, team?.uid]);

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
  if (team)
    return (
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge
                className="text-xs sm:text-sm select-none"
                variant={team.type === "ladder" ? "default" : "secondary"}
              >
                {team.type.charAt(0).toUpperCase() + team.type.slice(1)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Criado em {new Date(team.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-3xl font-bold">{team.name}</h1>
            <p className="text-sm text-muted-foreground">
              Time do{" "}
              {creatorNickname ? (
                creatorNickname
              ) : (
                <strong className="line-through uppercase">desconhecido</strong>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 self-end md:self-auto">
            {user ? (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => toggleLike(teamId)}
              >
                <Heart
                  className={`h-4 w-4 ${
                    team.likes.includes(user.uid)
                      ? "fill-primary text-primary"
                      : ""
                  }`}
                />
                <span>{team.likes.length}</span>
              </Button>
            ) : null}

            {team.uid === user?.uid ? (
              <Dialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Excluir time</DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja excluir o time {team.name}? Esta
                      ação não pode ser desfeita.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteTeam}>
                      Excluir
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : null}
          </div>
        </div>
        <Tabs defaultValue="info" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Informações
            </TabsTrigger>
            <TabsTrigger value="missions" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Missões
            </TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {team?.characters?.map((charName, index) => {
                const character = CHARACTERS.find(
                  (c) => c.name === charName
                ) as Character;
                return (
                  <Card key={index} className="overflow-hidden">
                    <div className="aspect-[3/2] relative bg-muted">
                      <Image
                        src={character?.url || "/placeholder.svg"}
                        alt={character.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{character.name}</CardTitle>
                      <CardDescription>
                        {character.descriptionBR}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-sm font-medium mb-2">Habilidades</h3>
                      <Accordion type="single" collapsible className="w-full">
                        {character.skills?.map((skill, skillIndex) => (
                          <AccordionItem
                            key={skillIndex}
                            value={`skill-${skillIndex}`}
                          >
                            <AccordionTrigger className="text-sm py-2 hover:no-underline">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                  <Image
                                    src={skill.url || "/placeholder.svg"}
                                    alt={skill.name}
                                    width={24}
                                    height={24}
                                    className="object-cover"
                                  />
                                </div>
                                <span>{skill.name}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-3 text-sm pl-8">
                                <p>{skill.descriptionBR}</p>
                                <Separator />
                                <div className="flex flex-wrap gap-2">
                                  {skill.energy.map((energy, energyIndex) => (
                                    <Badge key={energyIndex} variant="outline">
                                      {energy}
                                    </Badge>
                                  ))}
                                  {skill.classes.map(
                                    (className, classIndex) => (
                                      <Badge
                                        key={classIndex}
                                        variant="secondary"
                                      >
                                        {className}
                                      </Badge>
                                    )
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Cooldown: {skill.cooldown} turnos
                                </p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Sobre o Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  {team.description ? (
                    team.description
                  ) : (
                    <strong className="line-through">
                      Esse time não possui descrição
                    </strong>
                  )}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="missions">
            <Card>
              <CardHeader>
                <CardTitle>Missões</CardTitle>
                <CardDescription>
                  Missões realizadas por este time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {team.missions && team.missions.length > 0 ? (
                  <ul className="space-y-2">
                    {team.missions.map((mission, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {index + 1}
                        </span>
                        <span>{mission}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">
                    Nenhuma missão registrada.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comentários{" "}
                <strong className="font-black text-red-400">
                  Ainda não implementado
                </strong>
              </CardTitle>
              <CardDescription>
                Compartilhe sua opinião sobre este time
              </CardDescription>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <form onSubmit={() => {}} className="space-y-4">
              <Textarea
                placeholder="Escreva seu comentário..."
                className="min-h-[100px]"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button
                type="submit"
                disabled
                // disabled={!comment.trim()}
              >
                Enviar comentário
              </Button>
            </form>
            <div className="mt-6">
              <p className="text-center text-muted-foreground text-sm">
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
}
