import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Pencil, CheckCircle2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import type { TwoFactorAccount, Workspace } from "@/lib/get2fa-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTotpClock } from "@/hooks/use-totp-clock";
import * as OTPAuth from "otpauth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditAccountDialog } from "@/components/edit-account-dialog";
import { useTranslation, Trans } from "react-i18next";

interface AccountRowProps {
  account: TwoFactorAccount;
  currentWorkspaceId: string;
  onRemove: (id: string) => void;
  onUpdate: (account: TwoFactorAccount, destinationWorkspaceId?: string) => void;
  availableTags: string[];
  workspaces: Workspace[];
  dragHandleProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  dragHandleRef?: (node: HTMLButtonElement | null) => void;
  isDragging?: boolean;
  isDraggable?: boolean;
}

export function AccountRow({
  account,
  currentWorkspaceId,
  onRemove,
  onUpdate,
  availableTags,
  workspaces,
  dragHandleProps,
  dragHandleRef,
  isDragging = false,
  isDraggable = false,
}: AccountRowProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [justCopied, setJustCopied] = useState(false);
  const currentEpochSecond = useTotpClock();

  const totp = useMemo(() => {
    try {
      return new OTPAuth.TOTP({
        issuer: account.issuer || "2FA",
        label: account.label,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(account.secret),
      });
    } catch {
      return null;
    }
  }, [account.secret, account.label, account.issuer]);

  const timestamp = currentEpochSecond * 1000;
  const period = totp?.period ?? 30;
  const displayToken = useMemo(() => {
    if (!totp) {
      return "ERROR";
    }

    try {
      const token = totp.generate({ timestamp });
      return `${token.slice(0, 3)} ${token.slice(3)}`;
    } catch {
      return "ERROR";
    }
  }, [timestamp, totp]);
  const remaining = useMemo(() => {
    if (!totp) {
      return 0;
    }

    return Math.ceil(totp.remaining({ timestamp }) / 1000);
  }, [timestamp, totp]);
  const progress = totp ? remaining / period : 0;
  const isExpiring = totp ? remaining < Math.min(5, period) : true;
  const dragHandleLabel = t("account_row.drag_handle", { label: account.label }).replace(
    "{{label}}",
    account.label,
  );
  const copyActionLabel = t("account_row.copy_code");
  const editActionLabel = t("account_row.edit");
  const deleteActionLabel = t("account_row.delete_action");
  
  const handleCopy = () => {
    const rawToken = displayToken.replace(/\s/g, "");
    if (rawToken && rawToken !== "ERROR") {
      navigator.clipboard.writeText(rawToken);
      toast.success(t('account_row.copied'));
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
    }
  };

  return (
    <>
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
                "group relative flex flex-col justify-between gap-3 rounded-xl border p-3 transition-all duration-200 md:flex-row md:items-center md:gap-0 md:p-4",
                "bg-white/70 dark:bg-card/40 backdrop-blur-md border-white/20 dark:border-white/5",
                "shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.1)]",
                "dark:hover:bg-card/60 dark:hover:border-primary/20",
                !isDragging && "hover:-translate-y-0.5",
                isDragging && "cursor-grabbing shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]"
            )}
        >
            {/* Drag Handle */}
            {isDraggable && (
                <button
                    aria-label={dragHandleLabel}
                    className="absolute left-1 top-3 z-20 rounded-lg p-2.5 text-muted-foreground/40 transition-colors touch-none hover:bg-primary/5 hover:text-primary cursor-grab active:cursor-grabbing md:top-1/2 md:-translate-y-1/2"
                    ref={dragHandleRef}
                    type="button"
                    {...dragHandleProps}
                >
                    <GripVertical className="h-5 w-5" />
                </button>
            )}

            {/* Left Side: Info */}
            <div className={cn("flex items-center md:items-start gap-3 md:gap-4 w-full md:w-auto overflow-hidden transition-all", isDraggable && "pl-8")}>
                <motion.div 
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base font-bold uppercase shadow-lg transition-all duration-500 md:h-10 md:w-10 md:rounded-xl md:text-lg",
                        isExpiring 
                            ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-red-500/20" 
                            : "bg-gradient-to-br from-primary to-blue-600 text-white shadow-primary/20"
                    )}
                >
                   {account.label.charAt(0)}
                </motion.div>

                <div className="flex flex-col min-w-0 pr-2">
                    <h3 className="truncate text-sm font-bold leading-tight tracking-tight text-foreground/90 md:text-base">{account.label}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {account.tags && account.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center rounded-md border border-border/50 bg-secondary/50 px-1.5 py-0.5 text-[8px] font-medium text-secondary-foreground md:text-[9px]">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Token & Actions */}
            <div className="flex w-full items-center justify-between gap-3 pl-1 md:w-auto md:justify-end md:gap-6 md:pl-0">
                {/* Token Display */}
                <button
                    aria-label={copyActionLabel}
                    className="relative group/token cursor-pointer rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    onClick={handleCopy}
                    title={copyActionLabel}
                    type="button"
                >
                    <div className={cn(
                        "select-none font-mono text-xl font-bold tracking-[0.12em] transition-all duration-300 sm:text-2xl md:text-3xl",
                        isExpiring ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "text-foreground group-hover/token:text-primary"
                    )}>
                        {displayToken}
                    </div>
                </button>
                 
                 {/* Circular Timer */}
                 <div className="relative flex h-9 w-9 shrink-0 items-center justify-center md:h-10 md:w-10">
                    <svg className="w-full h-full -rotate-90 scale-x-[-1]" viewBox="0 0 36 36">
                        <circle
                          className="text-muted/10"
                          cx="18" cy="18" r="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                        />
                        <circle
                          className={cn(
                              "transition-all duration-1000 ease-linear",
                              isExpiring ? "text-red-500" : "text-primary"
                          )}
                          cx="18" cy="18" r="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeDasharray="100, 100"
                          strokeDashoffset={100 - (progress * 100)}
                          strokeLinecap="round"
                        />
                    </svg>
                    <span className={cn(
                        "absolute text-[9px] font-bold tabular-nums transition-colors md:text-[10px]",
                        isExpiring ? "text-red-500" : "text-muted-foreground"
                    )}>
                    {Math.round(remaining)}s
                    </span>
                 </div>

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 z-20 flex gap-1 rounded-lg border border-border/50 bg-background/50 p-1 opacity-100 transition-opacity duration-200 backdrop-blur-sm md:static md:auto md:flex-col md:border-none md:bg-transparent md:p-0 md:opacity-0 md:backdrop-blur-none group-hover:opacity-100">
                    <Button 
                        aria-label={editActionLabel}
                        variant="ghost" size="icon" 
                        onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} 
                        className="h-7 w-7 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary"
                        title={editActionLabel}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                        aria-label={deleteActionLabel}
                        variant="ghost" size="icon" 
                        onClick={(e) => { e.stopPropagation(); setIsDeleting(true); }} 
                        className="h-7 w-7 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        title={deleteActionLabel}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
            
            {/* Copied Overlay Feedback */}
            <AnimatePresence>
                {justCopied && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-2xl pointer-events-none"
                    >
                        <div className="flex flex-col items-center gap-2 text-green-500">
                            <CheckCircle2 className="h-8 w-8" />
                            <span className="font-bold text-sm">{t('account_row.copied_short')}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>

        {/* Edit Dialog */}
        <EditAccountDialog 
            key={`${account.id}-${currentWorkspaceId}-${isEditing ? "open" : "closed"}`}
            account={account}
            currentWorkspaceId={currentWorkspaceId}
            open={isEditing}
            onOpenChange={setIsEditing}
            onUpdate={onUpdate}
            availableTags={availableTags}
            workspaces={workspaces}
        />

        {/* Delete Confirmation */}
        <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
            <AlertDialogContent className="bg-background/95 backdrop-blur-md border-border/50">
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('account_row.delete_title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Trans i18nKey="account_row.delete_desc" values={{ label: account.label }}>
                            Are you sure you want to remove <span className="font-bold text-foreground">{account.label}</span>? This action cannot be undone.
                        </Trans>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="border-border/50 hover:bg-muted/50">{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onRemove(account.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
