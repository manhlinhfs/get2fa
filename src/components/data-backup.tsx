import { useRef, useState } from "react";
import { Download, Layers3, Settings2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BackupCenterDialog } from "@/components/backup-center-dialog";
import { Button } from "@/components/ui/button";
import type { Workspace } from "@/lib/get2fa-data";
import { useTranslation } from "react-i18next";
import { createBackupFilename, downloadBackup } from "@/lib/backup-download";

interface BackupImportResult {
  kind: "bundle" | "legacy";
  count: number;
}

interface DataBackupProps {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onExportCurrentWorkspace: () => unknown;
  onExportSelectedWorkspaces: (workspaceIds: string[]) => unknown;
  onImport: (payload: unknown) => BackupImportResult;
}

export function DataBackup({
  workspaces,
  activeWorkspaceId,
  onExportCurrentWorkspace,
  onExportSelectedWorkspaces,
  onImport,
}: DataBackupProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backupCenterOpen, setBackupCenterOpen] = useState(false);

  const handleExportCurrentWorkspace = () => {
    try {
      downloadBackup(
        onExportCurrentWorkspace(),
        createBackupFilename("get2fa-backup"),
      );
      toast.success(t("backup.export_success"));
    } catch {
      toast.error(t("backup.export_error"));
    }
  };

  const handleExportSelectedWorkspaces = (workspaceIds: string[]) => {
    try {
      downloadBackup(
        onExportSelectedWorkspaces(workspaceIds),
        createBackupFilename("get2fa-backup"),
      );
      toast.success(t("backup.export_success"));
    } catch {
      toast.error(t("backup.export_error"));
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        const importResult = onImport(parsed);

        if (importResult.count > 0) {
          const successKey =
            importResult.kind === "bundle"
              ? "backup.import_bundle_success"
              : "backup.import_success";
          toast.success(t(successKey, { count: importResult.count }));
        } else {
          const infoKey =
            importResult.kind === "bundle" ? "backup.import_bundle_info" : "backup.import_info";
          toast.info(t(infoKey));
        }
      } catch (error) {
        toast.error(t("backup.import_error"));
        console.error(error);
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={t("backup.title")}
            className="bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/50"
            size="icon"
            variant="outline"
          >
            <Settings2 className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-xl">
          <DropdownMenuLabel>{t("backup.title")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleExportCurrentWorkspace}>
            <Download className="mr-2 h-4 w-4" />
            <span>{t("backup.export_current")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => setBackupCenterOpen(true)}>
            <Layers3 className="mr-2 h-4 w-4" />
            <span>{t("backup.center")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={handleImportClick}>
            <Upload className="mr-2 h-4 w-4" />
            <span>{t("backup.import")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <BackupCenterDialog
        activeWorkspaceId={activeWorkspaceId}
        key={`${activeWorkspaceId}-${backupCenterOpen ? "open" : "closed"}`}
        onExport={handleExportSelectedWorkspaces}
        onOpenChange={setBackupCenterOpen}
        open={backupCenterOpen}
        workspaces={workspaces}
      />
    </>
  );
}
