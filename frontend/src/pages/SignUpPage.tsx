import { SignupForm } from "@/components/signup-form";
import { MessageCircle } from "lucide-react";

const SignUpPage = () => {
  return (
    <div className="min-h-screen w-full relative bg-black">
      {/* Ocean Abyss Background with Top Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 182, 212, 0.25), transparent 70%), #000000",
        }}
      />

      <div className="flex min-h-svh relative z-10 flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium text-white"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <MessageCircle className="size-4" />
            </div>
            Chatty
          </a>
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
