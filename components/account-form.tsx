"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Database } from "@/types/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";

const accountFormSchema = z.object({
  user_name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

type AccountFormProps = {
  user: User;
};

export function AccountForm({ user }: AccountFormProps) {
  const supabase = createClientComponentClient<Database>();
  // This can come from your database or API.
  const defaultValues: Partial<AccountFormValues> = {
    user_name: user.user_metadata.user_name,
  };
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  async function onSubmit(data: AccountFormValues) {
    const { error } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        ...data,
      },
    });
    if (error) {
      toast({ title: "Error!", description: error.message });
      return;
    }
    await supabase.auth.refreshSession();
    toast({
      title: "You changed the following settings:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="user_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in
                emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update account</Button>
      </form>
    </Form>
  );
}
