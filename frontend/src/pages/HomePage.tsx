import { useNavigate } from "react-router";
import Navbar from "@/components/Navbar";

const HomePage = () => {
    const navigate = useNavigate();

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
                            {["清", "想", "妈", "红", "请", "住", "情", "放"].map((char) => (
                                <button
                                    key={char}
                                    onClick={() => navigate(`/character/${char}`)}
                                    className="w-16 h-16 rounded-xl bg-white hover:bg-gray-50 text-black font-bold text-2xl
                    hover:scale-105 transition-all cursor-pointer border-2 border-gray-300 hover:border-primary"
                                >
                                    {char}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
