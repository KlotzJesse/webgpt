import Logo from "@/components/Logo";
import { MainNav } from "@/components/main-nav";
import ProjectSwitcher from "@/components/project-switcher";
import TeamSwitcher from "@/components/team-switcher";
import { UserNav } from "@/components/user-nav";
import { Database } from "@/types/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import getCurrentTeam from "../actions/get-current-team";
export const dynamic = "force-dynamic";

interface AppLayoutProps {
  children: ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/login");
  }
  const { data: teamData, error: teamError } = await supabase
    .from("teams")
    .select("*");

  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select("*");

  const teamId = await getCurrentTeam();

  return (
    <div className="hidden flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Logo />
          {teamId && <TeamSwitcher teamId={teamId} teams={teamData} />}
          <ProjectSwitcher projects={projectData} />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
