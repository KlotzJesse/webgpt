import { RequestCookies } from "@edge-runtime/cookies";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";
export function createEdgeHandlerClient(req: Request) {
  const cookies = new RequestCookies(req.headers) as any;
  return createRouteHandlerClient({ cookies: () => cookies });
}
