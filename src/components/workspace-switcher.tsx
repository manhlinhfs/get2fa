import { ChevronDown, FolderKanban, Pencil, Plus, Trash2 } from "lucide-react";

import type { Workspace } from "@/lib/get2fa-data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

interface WorkspaceSwitcherProps {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSelectWorkspace: (workspaceId: string) => void;
  onCreateWorkspace: () => void;
  onRenameWorkspace: () => void;
  onDeleteWorkspace: () => void;
}

export function WorkspaceSwitcher({
  workspaces,
  activeWorkspaceId,
  onSelectWorkspace,
  onCreateWorkspace,
  onRenameWorkspace,
  onDeleteWorkspace,
}: WorkspaceSwitcherProps) {
  const { t } = useTranslation();
  const activeWorkspace =
    workspaces.find((workspace) => workspace.id === activeWorkspaceId) ?? workspaces[0];
  const canDeleteWorkspace = workspaces.length > 1;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-10 rounded-full border-border/50 bg-background/60 px-3 text-sm shadow-xs"
        >
          <FolderKanban className="size-4 text-primary" />
          <span className="max-w-32 truncate sm:max-w-44">{activeWorkspace.name}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 bg-background/95 backdrop-blur-xl">
        <DropdownMenuLabel>{t("workspace.switcher")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={activeWorkspace.id} onValueChange={onSelectWorkspace}>
          {workspaces.map((workspace) => (
            <DropdownMenuRadioItem key={workspace.id} value={workspace.id}>
              {workspace.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onCreateWorkspace}>
          <Plus className="mr-2 size-4" />
          {t("workspace.create")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onRenameWorkspace}>
          <Pencil className="mr-2 size-4" />
          {t("workspace.rename")}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!canDeleteWorkspace}
          onClick={onDeleteWorkspace}
          variant="destructive"
        >
          <Trash2 className="mr-2 size-4" />
          {t("workspace.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
