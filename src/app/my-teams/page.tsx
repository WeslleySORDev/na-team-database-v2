"use client";
import { MyTeamList } from "../components/my-teams/my-team-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function MyTeams() {
  return (
    <main className="flex flex-col gap-4 px-4 sm:px-6 md:px-12 lg:px-32 py-8">
      <div className="flex justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold mb-4">Meus Times</h2>
        </div>
        <Button>
          <Link
            className="flex items-center justify-center gap-2"
            href="/create-team"
          >
            <Plus /> Criar novo time
          </Link>
        </Button>
      </div>
      <MyTeamList />
    </main>
  );
}
