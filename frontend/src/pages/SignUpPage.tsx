import { SignupForm } from "@/components/auth/signup-form";

const SignUpPage = () => {
  return (
    <div className="min-h-screen w-full relative bg-muted">
      
      <div className="flex min-h-svh relative z-10 flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a
            href="/"
            className="flex items-center gap-2 text-4xl self-center font-medium text-foreground hover:opacity-80 transition-opacity"
          >
            <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md text-lg font-bold">
              字
            </span>
            Hanzi Park
          </a>
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
