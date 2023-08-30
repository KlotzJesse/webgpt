import { DataTable } from "@/components/data-table";
import ProjectSettings from "@/components/project-settings";
import { SourcesTable } from "@/components/sources-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database } from "@/types/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export default async function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });
  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.projectId)
    .single();

  if (!projectData) {
    return redirect("/dashboard");
  }

  const { data: sourcesData, error: sourcesError } = await supabase
    .from("sources")
    .select("*")
    .eq("project_id", params.projectId);

  const { data: dataData, error: dataError } = await supabase
    .from("data")
    .select("*")
    .eq("project_id", params.projectId);

  return (
    <main>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {projectData!.name}
            </h2>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                {/* TODO: Add global add new button */}
                {/* <DropdownMenuTrigger asChild>
                  <Button variant={"secondary"}>
                    Add New... <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger> */}
                <DropdownMenuContent align="end" forceMount>
                  <DropdownMenuItem>Source</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button asChild>
                <Link href={`/project/${params.projectId}/playground`}>
                  Playground
                </Link>
              </Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="sources">Sources</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashbordCard
                  title={"Documents"}
                  value={`${dataData?.length ?? 0}`}
                />
                <DashbordCard
                  title={"Sources"}
                  value={`${sourcesData?.length ?? 0}`}
                />
              </div>
            </TabsContent>
            <TabsContent value="data" className="space-y-4">
              <DataTable data={dataData} />
            </TabsContent>
            <TabsContent value="sources" className="space-y-4">
              <SourcesTable projectId={projectData!.id} data={sourcesData} />
            </TabsContent>
            <TabsContent value="settings" className="space-y-4">
              <ProjectSettings project={projectData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}

const DashbordCard = ({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description?: string;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};
