import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-md">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src="" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>

        <div>
          <p className="font-semibold">User Name</p>
          <p className="text-gray-500 text-sm">user@example.com</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input placeholder="Enter your name" />
        </div>

        <div>
          <Label>Email</Label>
          <Input type="email" placeholder="Enter your email" />
        </div>

        <div className="flex items-center gap-3">
          <Switch id="notify" />
          <Label htmlFor="notify">Enable Notifications</Label>
        </div>

        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
