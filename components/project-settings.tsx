"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import deleteProject from "@/app/actions/delete-project";
import updateProject from "@/app/actions/update-project";
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
import { Database } from "@/types/database.types";
import { Project } from "@/types/models.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { startTransition } from "react";
import { toast } from "./ui/use-toast";

const projectFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

type ProjectFormProps = {
  project: Project;
};

export default function ProjectSettings({ project }: ProjectFormProps) {
  const supabase = createClientComponentClient<Database>();
  // This can come from your database or API.
  const defaultValues: Partial<ProjectFormValues> = {
    name: project.name,
  };
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  });

  async function onSubmit(data: ProjectFormValues) {
    const { error } = await supabase
      .from("projects")
      .update({
        ...data,
      })
      .match({ id: project.id });

    if (error) {
      toast({ title: "Error!", description: error.message });
      return;
    }

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
      {/* form.handleSubmit(onSubmit) */}
      <form action={updateProject} className="space-y-8">
        <input type="hidden" name="id" value={project.id} />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name for your project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-5">
          <Button
            variant={"destructive"}
            onClick={() => {
              startTransition(() => {
                deleteProject(project.id);
              });
            }}
          >
            Delete Project
          </Button>
          <Button type="submit">Update settings</Button>
        </div>
      </form>
    </Form>
  );
}
