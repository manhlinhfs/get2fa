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
import { useTranslation } from "react-i18next";

interface DataBackupProps {
  accounts: TwoFactorAccount[];
  onImport: (accounts: Partial<TwoFactorAccount>[]) => number;
}

export function DataBackup({ accounts, onImport }: DataBackupProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (accounts.length === 0) {
      toast.error(t('backup.no_data'));
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
      
      toast.success(t('backup.export_success'));
    } catch (error) {
      toast.error(t('backup.export_error'));
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
            toast.success(t('backup.import_success', { count }));
        } else {
            toast.info(t('backup.import_info'));
        }
      } catch (error) {
        toast.error(t('backup.import_error'));
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
          <DropdownMenuLabel>{t('backup.title')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleExport} className="cursor-pointer">
            <Download className="mr-2 h-4 w-4" />
            <span>{t('backup.export')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleImportClick} className="cursor-pointer">
            <Upload className="mr-2 h-4 w-4" />
            <span>{t('backup.import')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
