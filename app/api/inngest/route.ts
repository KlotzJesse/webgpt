import { inngest } from "@/lib/inngest-client";
import { serve } from "inngest/next";
import {
  fetchPage,
  generateEmbedding,
  generateEmbeddings,
  helloWorld,
} from "./functions";

export const runtime = "edge";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve(
  inngest,
  [
    /* your functions will be passed here later! */
    helloWorld,
    fetchPage,
    generateEmbedding,
    generateEmbeddings,
  ],
  {
    streaming: "allow",
  }
);
