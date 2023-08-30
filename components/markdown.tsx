import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function MarkdownRenderer({ markdown }: { markdown: string }) {
  return (
    <div className="prose dark:prose-invert prose-sm !w-full p-5 mx-auto">
      <Card className="w-full">
        <CardHeader className="text-2xl font-bold">
          <CardTitle>Document preview</CardTitle>
          <CardContent>
            <CardDescription>
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </CardDescription>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
