import { SignupForm } from "@/components/auth/signup-form";

const SignUpPage = () => {
  return (
    <div className="min-h-screen w-full relative bg-slate-50">
      {/* Subtle green gradient background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 64, 43, 0.05), transparent 70%), #fafafa",
        }}
      />

      <div className="flex min-h-svh relative z-10 flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex items-center gap-2 text-4xl self-center font-medium text-foreground">
            <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md text-lg font-bold">
              字
            </span>
            Hanzi Explorer
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
