import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TwoFactorAccount, ColorTag } from "@/hooks/use-2fa";
import { colorTagMap } from "@/lib/colors";
import { cn } from "@/lib/utils";

interface AddAccountDialogProps {
  onAdd: (account: Omit<TwoFactorAccount, "id" | "token" | "period" | "remaining">) => void;
}

const COLORS: ColorTag[] = ["default", "blue", "green", "indigo", "rose", "orange"];

export function AddAccountDialog({ onAdd }: AddAccountDialogProps) {
  const [open, setOpen] = useState(false);
  const [issuer, setIssuer] = useState("");
  const [label, setLabel] = useState("");
  const [secret, setSecret] = useState("");
  const [colorTag, setColorTag] = useState<ColorTag>("default");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret) return;

    // Basic cleanup of secret (remove spaces)
    const cleanSecret = secret.replace(/\s/g, "").toUpperCase();

    onAdd({
      issuer: issuer || "Unknown",
      label: label || "Account",
      secret: cleanSecret,
      colorTag,
    });

    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setIssuer("");
    setLabel("");
    setSecret("");
    setColorTag("default");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Account</DialogTitle>
          <DialogDescription>
            Enter the details from your 2FA provider manually.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="issuer">Issuer (Service Name)</Label>
            <Input
              id="issuer"
              placeholder="e.g. Google, GitHub"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="label">Account Name</Label>
            <Input
              id="label"
              placeholder="e.g. john@example.com"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="secret">Secret Key</Label>
            <Input
              id="secret"
              placeholder="JBSWY3DPEHPK3PXP"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              required
              className="font-mono uppercase"
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Color Tag</Label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setColorTag(color)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    colorTagMap[color].bg,
                    colorTag === color ? "border-primary scale-110 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                  )}
                  title={color}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Add Account</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
