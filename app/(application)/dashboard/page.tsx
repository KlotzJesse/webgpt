import getCurrentTeam from "@/app/actions/get-current-team";
import AddProjectAction from "@/components/actions/add-project-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database } from "@/types/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { BotIcon, ChevronDown } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";
export default async function Dashboard() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const teamId = await getCurrentTeam();

  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("team_id", teamId!);

  const { data: sourcesData, error: sourcesError } = await supabase
    .from("sources")
    .select("project_id")
    .in(
      "project_id",
      projectData!.map((project) => project.id)
    );

  const { data: dataData, error: dataError } = await supabase
    .from("data")
    .select("project_id")
    .in(
      "project_id",
      projectData!.map((project) => project.id)
    );

  return (
    <main>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {/* TODO: Implement */}
                  <Button disabled>
                    Add New... <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" forceMount>
                  <DropdownMenuItem>Project</DropdownMenuItem>
                  <DropdownMenuItem>Source</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <Tabs defaultValue="projects" className="space-y-4">
            <TabsList>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="team">Team Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="projects" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {projectData?.map((project, i) => (
                  <Link key={i} href={`/project/${project.id}`}>
                    <Card className="hover:opacity-50">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {project.name}
                        </CardTitle>
                        <BotIcon className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        {/* <div className="text-2xl font-bold">Active</div> */}
                        <p className="text-xs text-muted-foreground">
                          {
                            dataData?.filter(
                              (data) => data.project_id === project.id
                            ).length
                          }{" "}
                          Documents
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {
                            sourcesData?.filter(
                              (source) => source.project_id === project.id
                            ).length
                          }{" "}
                          Sources
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
                {projectData?.length === 0 && (
                  <AddProjectAction teamId={teamId!}>
                    <button className="flex h-[110px] w-full items-center justify-center rounded-md border border-dashed text-sm">
                      Add your first project
                    </button>
                  </AddProjectAction>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
