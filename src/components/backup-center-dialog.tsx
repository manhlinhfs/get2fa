import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { Workspace } from "@/lib/get2fa-data";
import { useTranslation } from "react-i18next";

interface BackupCenterDialogProps {
  open: boolean;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onOpenChange: (open: boolean) => void;
  onExport: (workspaceIds: string[]) => void;
}

export function BackupCenterDialog({
  open,
  workspaces,
  activeWorkspaceId,
  onOpenChange,
  onExport,
}: BackupCenterDialogProps) {
  const { t } = useTranslation();
  const [selectedWorkspaceIds, setSelectedWorkspaceIds] = useState<string[]>([activeWorkspaceId]);

  const toggleWorkspace = (workspaceId: string) => {
    setSelectedWorkspaceIds((currentIds) =>
      currentIds.includes(workspaceId)
        ? currentIds.filter((currentId) => currentId !== workspaceId)
        : [...currentIds, workspaceId],
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedWorkspaceIds.length === 0) {
      return;
    }

    onExport(selectedWorkspaceIds);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("backup.center")}</DialogTitle>
          <DialogDescription>{t("backup.title")}</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            {workspaces.map((workspace) => {
              const isChecked = selectedWorkspaceIds.includes(workspace.id);
              const inputId = `backup-workspace-${workspace.id}`;

              return (
                <Label
                  key={workspace.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-3"
                  htmlFor={inputId}
                >
                  <span className="flex items-center gap-3">
                    <input
                      checked={isChecked}
                      className="size-4 rounded border-border text-primary accent-primary"
                      id={inputId}
                      onChange={() => toggleWorkspace(workspace.id)}
                      type="checkbox"
                    />
                    <span>{workspace.name}</span>
                  </span>
                  <span aria-hidden className="text-xs text-muted-foreground">
                    {workspace.accounts.length}
                  </span>
                </Label>
              );
            })}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button disabled={selectedWorkspaceIds.length === 0} type="submit">
              {t("backup.export_selected")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
