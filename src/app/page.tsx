import { TeamList } from "./components/home/team-list";

export default function Home() {
  return (
    <main className="flex flex-col gap-4 px-4 sm:px-6 md:px-12 lg:px-32 py-8">
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-4">Times Criados</h2>
        <p>
          Visualize todos os times criados ou crie um novo time com seus
          personagens favoritos.
        </p>
      </div>
      <TeamList />
    </main>
  );
}
