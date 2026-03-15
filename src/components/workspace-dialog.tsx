import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface WorkspaceDialogProps {
  open: boolean;
  mode: "create" | "rename";
  initialName?: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => void;
}

export function WorkspaceDialog({
  open,
  mode,
  initialName = "",
  onOpenChange,
  onSubmit,
}: WorkspaceDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(initialName);

  const title =
    mode === "create" ? t("workspace.dialog.create_title") : t("workspace.dialog.rename_title");
  const actionLabel =
    mode === "create"
      ? t("workspace.dialog.create_action")
      : t("workspace.dialog.rename_action");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    onSubmit(trimmedName);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="workspace-name">{t("workspace.dialog.name_label")}</Label>
            <Input
              autoFocus
              id="workspace-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">{actionLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
