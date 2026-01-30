import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Next.js + shadcn/ui</CardTitle>
          <CardDescription>
            Your project is ready with TypeScript and Tailwind CSS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="email" placeholder="Enter your email" />
          <Input type="password" placeholder="Enter your password" />
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1">Sign In</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
