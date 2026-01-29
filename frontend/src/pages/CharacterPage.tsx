import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useCharacterStore } from "@/features/character/store/useCharacterStore";
import Navbar from "@/components/layout/Navbar";
import CharacterDetail from "@/features/character/components/CharacterDetail";

const CharacterPage = () => {
    const { char } = useParams<{ char: string }>();
    const navigate = useNavigate();
    const { pushCharacter } = useCharacterStore();

    // Fetch character data when URL param changes
    useEffect(() => {
        if (char) {
            pushCharacter(char);
        } else {
            navigate("/");
        }
    }, [char, pushCharacter, navigate]);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 py-8">
                <CharacterDetail />
            </main>
        </div>
    );
};

export default CharacterPage;
