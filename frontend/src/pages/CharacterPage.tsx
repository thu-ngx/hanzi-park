import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useHanziStore } from "@/stores/useHanziStore";
import Navbar from "@/components/Navbar";
import CharacterDetail from "@/components/hanzi/CharacterDetail";

const CharacterPage = () => {
    const { char } = useParams<{ char: string }>();
    const navigate = useNavigate();
    const { pushCharacter } = useHanziStore();

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
