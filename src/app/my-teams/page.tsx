"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MyTeamList } from "../components/my-teams/my-team-list";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function MyTeams() {
  const { user } = useAuth();
  const router = useRouter();
  const [creatorNickname, setCreatorNickname] = useState<string | null>(null);

  useEffect(() => {
    if (!user && router) {
      router.push("/");
      return; // Adicione um return para evitar a execução do código abaixo se o usuário não estiver autenticado
    }

    const fetchNickname = async () => {
      if (user?.uid) {
        try {
          const userDocRef = doc(db, "users", user.uid); // Assumindo que a coleção é 'users' e o ID do documento é o uid do usuário
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setCreatorNickname(userData?.nickname || null); // Assumindo que o campo com o nickname é 'nickname'
          } else {
            console.log("No such document!");
            setCreatorNickname(null);
          }
        } catch (error) {
          console.error("Error fetching user nickname:", error);
          setCreatorNickname(null);
        }
      }
    };

    fetchNickname();
  }, [user, db]);

  useEffect(() => {
    if (creatorNickname) {
      console.log("Nickname do usuário:", creatorNickname);
      // Você pode usar o creatorNickname onde precisar
    }
  }, [creatorNickname]);

  return (
    <main className="flex flex-col gap-4 px-4 sm:px-6 md:px-12 lg:px-32 py-8">
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-4">Meus Times</h2>
        <p>
          Visualize todos os times criados por você -{" "}
          {creatorNickname ? creatorNickname : "Carregando..."}
        </p>
      </div>
      <MyTeamList />
    </main>
  );
}
