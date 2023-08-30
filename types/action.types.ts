import { PostgrestError } from "@supabase/supabase-js";

export type ActionResponse = {
  success?: boolean;
  error?: PostgrestError;
  message?: string;
};
