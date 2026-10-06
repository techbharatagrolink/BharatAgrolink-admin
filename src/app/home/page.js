import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Home</h1>

      <div className="flex gap-3">
        <Input placeholder="Search anything..." aria-label="Search" className="w-64" />
        <Button>Search</Button>
      </div>
    </div>
  );
}
