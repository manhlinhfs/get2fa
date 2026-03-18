import { useState } from "react";
import { X, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { TwoFactorAccount, Workspace } from "@/lib/get2fa-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface EditAccountDialogProps {
  account: TwoFactorAccount;
  currentWorkspaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (account: TwoFactorAccount, destinationWorkspaceId?: string) => void;
  availableTags: string[];
  workspaces: Workspace[];
}

export function EditAccountDialog({
  account,
  currentWorkspaceId,
  open,
  onOpenChange,
  onUpdate,
  availableTags,
  workspaces,
}: EditAccountDialogProps) {
  const { t } = useTranslation();
  const [label, setLabel] = useState(account.label);
  const [secret, setSecret] = useState(account.secret);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(account.tags || []);
  const [workspaceId, setWorkspaceId] = useState(currentWorkspaceId);

  const handleAddTag = () => {
    const cleanTag = tagInput.trim();
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
      setTagInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleAddTag();
    }
  };

  const toggleTag = (tag: string) => {
      if (tags.includes(tag)) {
          setTags(tags.filter(t => t !== tag));
      } else {
          setTags([...tags, tag]);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextAccount = {
      ...account,
      label,
      secret: secret.replace(/[\s-]/g, "").toUpperCase(),
      tags,
      updatedAt: new Date().toISOString(),
    };

    onUpdate(nextAccount, workspaceId);

    if (workspaceId !== currentWorkspaceId) {
      const nextWorkspaceName =
        workspaces.find((workspace) => workspace.id === workspaceId)?.name ?? workspaceId;
      toast.success(
        t("edit_dialog.move_success", { label: nextAccount.label, workspace: nextWorkspaceName }),
      );
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('edit_dialog.title')}</DialogTitle>
          <DialogDescription className="sr-only">
            {t("edit_dialog.description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-label">{t('edit_dialog.account_name')}</Label>
            <Input
              id="edit-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-secret">{t('edit_dialog.secret_key')}</Label>
            <Input
              id="edit-secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="font-mono uppercase"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-workspace">{t("edit_dialog.workspace")}</Label>
            <Select onValueChange={setWorkspaceId} value={workspaceId}>
              <SelectTrigger className="w-full" id="edit-workspace">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {workspaces.map((workspace) => (
                  <SelectItem key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
             <Label>{t('common.tags')}</Label>
             <div className="flex flex-wrap gap-2 items-center bg-background border rounded-md p-2 min-h-[42px]">
                {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                        {tag}
                        <button
                          aria-label={t("edit_dialog.remove_tag", { tag })}
                          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-background/60 hover:text-destructive"
                          onClick={() => toggleTag(tag)}
                          type="button"
                        >
                          <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
                <input 
                    className="flex-1 bg-transparent outline-none text-sm min-w-[60px]"
                    placeholder={t('common.add_tag')}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
             </div>
             {availableTags.length > 0 && (
                 <div className="flex flex-wrap gap-1 mt-1">
                     {availableTags.filter(t => !tags.includes(t)).map(tag => (
                         <Badge 
                            key={tag} 
                            variant="outline" 
                            className="cursor-pointer hover:bg-muted text-[10px]"
                            onClick={() => toggleTag(tag)}
                        >
                             + {tag}
                         </Badge>
                     ))}
                 </div>
             )}
          </div>

          <DialogFooter>
            <Button type="submit">
                <Save className="h-4 w-4 mr-2" /> {t('edit_dialog.save_changes')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
