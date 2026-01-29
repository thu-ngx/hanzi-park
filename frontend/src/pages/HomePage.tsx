import Navbar from "@/components/Navbar";
import CharacterTile from "@/components/hanzi/CharacterTile";
import GlobalSearch from "@/components/hanzi/GlobalSearch";
import { Link } from "react-router";

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
            <p className="text-gray-600 mb-6">
              Use the search bar below or click a character to get started
            </p>

            {/* Global Search */}
            <div className="max-w-md mx-auto">
              <GlobalSearch />
            </div>
          </div>

          {/* Quick examples */}
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-4">Try these characters:</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {["清", "想", "妈", "红", "教", "房", "船", "放"].map((char) => (
                <CharacterTile key={char} char={char} />
              ))}
            </div>
          </div>

          {/* Footer paragraph */}
          <div className="text-center border-t border-gray-200 mt-52 pt-8">
            <p className="text-gray-600 text-sm leading-relaxed">
              <Link to="/signup" className="text-primary hover:underline">
                Sign up for an account
              </Link>{" "}
              if you want to save personal notes for characters in collections.{" "}
              <br /> This project uses data from{" "}
              <a
                href="https://github.com/skishore/makemeahanzi"
                className="text-primary hover:underline"
              >
                MakeMeAHanzi
              </a>{" "}
              and{" "}
              <a
                href="https://www.ugent.be/pp/experimentele-psychologie/en/research/documents/subtlexch"
                className="text-primary hover:underline"
              >
                SUBTLEX-CH
              </a>
              , inspired by{" "}
              <a
                href="https://www.hanlyapp.com/"
                className="text-primary hover:underline"
              >
                Hanly
              </a>
              and{" "}
              <a
                href="https://hanzicraft.com/"
                className="text-primary hover:underline"
              >
                HanziCraft
              </a>{" "}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
