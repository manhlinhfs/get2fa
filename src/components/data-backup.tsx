import { useRef } from "react";
import { Download, Upload, Settings2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { TwoFactorAccount } from "@/hooks/use-2fa";

interface DataBackupProps {
  accounts: TwoFactorAccount[];
  onImport: (accounts: Partial<TwoFactorAccount>[]) => number;
}

export function DataBackup({ accounts, onImport }: DataBackupProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (accounts.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      const dataToExport = {
        version: 1,
        exportedAt: new Date().toISOString(),
        data: accounts.map(({ secret, issuer, label, tags }) => ({
          secret,
          issuer,
          label,
          tags,
        })),
      };

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `authenticator-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Backup downloaded successfully");
    } catch (error) {
      toast.error("Failed to export data");
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
        
        let accountsToImport = [];

        // Support both our format and array format
        if (Array.isArray(parsed)) {
            accountsToImport = parsed;
        } else if (parsed.data && Array.isArray(parsed.data)) {
            accountsToImport = parsed.data;
        } else {
            throw new Error("Invalid format");
        }

        const count = onImport(accountsToImport);
        
        if (count > 0) {
            toast.success(`Successfully imported ${count} accounts`);
        } else {
            toast.info("No new accounts found to import (duplicates skipped)");
        }
      } catch (error) {
        toast.error("Invalid backup file");
        console.error(error);
      } finally {
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset input
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
          <Button variant="outline" size="icon" className="bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/50">
            <Settings2 className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-xl">
          <DropdownMenuLabel>Data Management</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleExport} className="cursor-pointer">
            <Download className="mr-2 h-4 w-4" />
            <span>Export Backup</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleImportClick} className="cursor-pointer">
            <Upload className="mr-2 h-4 w-4" />
            <span>Import Backup</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
