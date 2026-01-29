import Navbar from "@/components/Navbar";
import CharacterTile from "@/components/hanzi/CharacterTile";
import GlobalSearch from "@/components/hanzi/GlobalSearch";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-6xl mx-auto px-4 py-6 sm:py-8 w-full">
        <div className="flex-1 flex flex-col">
          {/* Welcome message */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Explore Chinese Characters
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
              Use the search bar below or click a character to get started
            </p>

            {/* Global Search */}
            <div className="max-w-xs sm:max-w-md mx-auto">
              <GlobalSearch />
            </div>
          </div>

          {/* Quick examples */}
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4">
              Try these characters:
            </p>
            <div className="flex justify-center gap-2 sm:gap-3 flex-wrap px-2">
              {["清", "想", "妈", "红", "房", "船"].map((char) => (
                <CharacterTile key={char} char={char} />
              ))}
            </div>
          </div>

          {/* Spacer to push footer down */}
          <div className="flex-1 min-h-16 sm:min-h-24" />

          {/* Footer paragraph */}
          <div className="text-center border-t border-gray-200 pt-6 sm:pt-8 pb-4">
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed px-4">
              Use desktop for better experience with tooltip!
              <br />
              This project uses data from{" "}
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
              </a>{" "}
              and{" "}
              <a
                href="https://hanzicraft.com/"
                className="text-primary hover:underline"
              >
                HanziCraft
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
