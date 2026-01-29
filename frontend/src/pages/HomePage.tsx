import Navbar from "@/components/Navbar";
import CharacterTile from "@/components/hanzi/CharacterTile";

const HomePage = () => {

    return (
        <div className="min-h-screen bg-background">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="space-y-8">
                    {/* Welcome message */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Explore Chinese Characters
                        </h1>
                        <p className="text-gray-600">
                            Use the search bar above or click a character below to get started
                        </p>
                    </div>

                    {/* Quick examples */}
                    <div className="text-center">
                        <p className="text-lg text-gray-600 mb-4">Try these characters:</p>
                        <div className="flex justify-center gap-3 flex-wrap">
                            {["清", "想", "妈", "红", "请", "住", "船", "放"].map((char) => (
                                <CharacterTile key={char} char={char} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
