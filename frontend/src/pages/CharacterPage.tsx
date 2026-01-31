import { useParams, Navigate } from "react-router";
import { useCharacter } from "@/features/character/hooks/useCharacter";
import Navbar from "@/components/layout/Navbar";
import CharacterDetail from "@/features/character/components/detail/CharacterDetail";

const CharacterPage = () => {
  const { char } = useParams<{ char: string }>();
  const { data, isLoading } = useCharacter(char);

  if (!char) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <CharacterDetail data={data} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default CharacterPage;
