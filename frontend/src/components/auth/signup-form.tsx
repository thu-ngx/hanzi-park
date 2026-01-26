import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const signUpSchema = z
  .object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.email("Email is invalid"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    // call api to sign up
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Welcome! Sign up to start using Chatty
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="firstname">First Name</FieldLabel>
                    <Input
                      id="firstname"
                      type="text"
                      {...register("firstname")}
                    />
                    {errors.firstname && (
                      <p className="text-destructive text-sm ">
                        {errors.firstname?.message}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lastname">Last Name</FieldLabel>
                    <Input
                      id="lastname"
                      type="text"
                      {...register("lastname")}
                    />
                    {errors.lastname && (
                      <p className="text-destructive text-sm ">
                        {errors.lastname?.message}
                      </p>
                    )}
                  </Field>
                </Field>
              </Field>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input id="username" type="text" {...register("username")} />
                {errors.username && (
                  <p className="text-destructive text-sm ">
                    {errors.username?.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-destructive text-sm ">
                    {errors.email?.message}
                  </p>
                )}
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-destructive text-sm ">
                        {errors.password?.message}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <p className="text-destructive text-sm ">
                        {errors.confirmPassword?.message}
                      </p>
                    )}
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 6 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  Create Account
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <a href="/login" className="underline underline-offset-2">
                    Log in
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="text-sm text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline-offset-2">
        By clicking continue, you agree to our <a href="/">Terms of Service</a>{" "}
        and <a href="/">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
