"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { db, auth } from "@/config/firebase"; // Importe a instância de autenticação
import { Team } from "@/types/team";
import { version } from "@/data/characters";

interface TeamsContextType {
  teams: Team[];
  addTeam: (team: Omit<Team, "id" | "createdAt" | "uid">) => Promise<void>; // Remova "uid" de Omit
  updateTeam: (
    id: string,
    updatedTeam: Omit<Team, "id" | "createdAt">
  ) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  toggleLike: (teamId: string) => Promise<void>;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export const TeamsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const teamsCollectionRef = collection(db, "teams");

  useEffect(() => {
    const unsubscribe = onSnapshot(teamsCollectionRef, (snapshot) => {
      const fetchedTeams: Team[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data()?.createdAt?.toDate().getTime() || Date.now(),
          } as Team)
      );
      const orderedTeams = [...fetchedTeams].sort(
        (a, b) => b.createdAt - a.createdAt
      );
      setTeams(orderedTeams);
    });
    return () => unsubscribe();
  }, []);

  const addTeam = async (
    teamData: Omit<Team, "id" | "createdAt" | "uid" | "likes">
  ) => {
    if (!auth.currentUser?.uid) {
      console.error("Usuário não autenticado ao tentar criar um time.");
      return;
    }
    const newTeamDocRef = doc(teamsCollectionRef);
    const newTeam: Team = {
      id: newTeamDocRef.id,
      ...teamData,
      createdAt: Date.now(),
      uid: auth.currentUser.uid,
      likes: [],
      version: version,
    };
    await setDoc(newTeamDocRef, {
      name: newTeam.name,
      description: newTeam.description,
      type: newTeam.type,
      missions: newTeam.missions,
      characters: newTeam.characters,
      createdAt: Timestamp.now(),
      uid: newTeam.uid,
      likes: newTeam.likes,
      version: version,
    });
  };

  const updateTeam = async (
    id: string,
    updatedTeamData: Omit<Team, "id" | "createdAt">
  ) => {
    const teamDocRef = doc(db, "teams", id);
    await setDoc(
      teamDocRef,
      {
        name: updatedTeamData.name,
        description: updatedTeamData.description,
        type: updatedTeamData.type,
        missions: updatedTeamData.missions,
        characters: updatedTeamData.characters,
        likes: updatedTeamData.likes,
      },
      { merge: true }
    );
  };

  const deleteTeam = async (id: string) => {
    const teamDocRef = doc(db, "teams", id);
    await deleteDoc(teamDocRef);
  };

  const toggleLike = async (teamId: string) => {
    if (!auth.currentUser?.uid) {
      console.error("Usuário não autenticado ao tentar dar like.");
      return;
    }
    const userId = auth.currentUser.uid;
    const teamDocRef = doc(db, "teams", teamId);
    const teamSnapshot = await getDoc(teamDocRef);

    if (teamSnapshot.exists()) {
      const currentLikes = teamSnapshot.data()?.likes || [];
      const userLiked = currentLikes.includes(userId);

      if (userLiked) {
        await updateDoc(teamDocRef, {
          likes: arrayRemove(userId),
        });
      } else {
        await updateDoc(teamDocRef, {
          likes: arrayUnion(userId),
        });
      }
    }
  };

  const value: TeamsContextType = {
    teams,
    addTeam,
    updateTeam,
    deleteTeam,
    toggleLike,
  };

  return (
    <TeamsContext.Provider value={value}>{children}</TeamsContext.Provider>
  );
};

export const useTeams = () => {
  const context = useContext(TeamsContext);
  if (!context) {
    throw new Error("useTeams must be used within a TeamsProvider");
  }
  return context;
};
