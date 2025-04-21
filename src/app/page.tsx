import { TeamList } from "./components/home/team-list";

export default function Home() {
  return (
    <main className="flex flex-col gap-4 px-4 sm:px-6 md:px-12 lg:px-32 py-8">
      <TeamList />
    </main>
  );
}
