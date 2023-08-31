"use client";

import * as React from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Database } from "@/types/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import * as z from "zod";
import { useToast } from "./ui/use-toast";

import { useForm } from "react-hook-form";
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const authFormSchema = z.object({
  email: z
    .string()
    .regex(
      /^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i,
      "Invalid email address"
    ),
});

type AuthFormValues = z.infer<typeof authFormSchema>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();

  const defaultValues: Partial<AuthFormValues> = {};
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues,
  });

  async function onSubmit(input: AuthFormValues) {
    setIsLoading(true);
    console.log(input);
    const { error, data } = await supabase.auth.signInWithOtp({
      ...input,

      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          user_name: input.email.split("@")[0],
        },
      },
    });
    console.log({ error, data });
    if (error) {
      toast({ title: "Error!", description: error.message });
      return;
    }
    toast({
      title: "Magic link sended!",
      description: "You received your login link by E-Mail.",
    });

    setIsLoading(false);
  }

  async function onSubmitOAuth(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast({ title: "Error!", description: error.message });
      return;
    }
    toast({ title: "Success!", description: "You have been signed in." });

    setIsLoading(false);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* <Messages /> */}
          <div className="grid gap-2">
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
              /> */}
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In with Email
            </Button>
          </div>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        onClick={onSubmitOAuth}
        disabled={isLoading}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Github
      </Button>
    </div>
  );
}
