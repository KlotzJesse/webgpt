"use server";
import { cookies } from "next/headers";

export default async function setTeam(teamId: string) {
  cookies().set("teamId", teamId);
}
