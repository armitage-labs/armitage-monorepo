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
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface CreateTeamCardProps {
  handleCreateTeam: () => void;
  setCreateTeamName: (teamName: string) => void;
}

export function CreateTeamCard({
  handleCreateTeam,
  setCreateTeamName,
}: CreateTeamCardProps) {
  const router = useRouter();
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create new team</CardTitle>
        <CardDescription>Analyze contributions with one click.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              onChange={(event) => {
                setCreateTeamName(event.target.value);
              }}
              id="name"
              placeholder="Name of your team"
            />
          </div>
          <div className="flex flex-col space-y-1.5"></div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            router.push("/teams");
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleCreateTeam}>Create</Button>
      </CardFooter>
    </Card>
  );
}
