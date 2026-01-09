import { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder, useDragControls } from "framer-motion";
import { Trash2, Pencil, CheckCircle2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import type { TwoFactorAccount } from "@/hooks/use-2fa";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  onRemove: (id: string) => void;
  onUpdate: (account: TwoFactorAccount) => void;
  availableTags: string[];
  isDraggable?: boolean;
}

export function AccountRow({ account, onRemove, onUpdate, availableTags, isDraggable = false }: AccountRowProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [justCopied, setJustCopied] = useState(false);
  
  // Local state for TOTP to prevent global re-renders
  const [token, setToken] = useState("--- ---");
  const [remaining, setRemaining] = useState(30);
  const [period, setPeriod] = useState(30);

  const controls = useDragControls();

  // Timer Logic Isolated to this Component
  useEffect(() => {
    let totp: OTPAuth.TOTP;
    try {
        totp = new OTPAuth.TOTP({
            issuer: account.issuer || "2FA",
            label: account.label,
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            secret: OTPAuth.Secret.fromBase32(account.secret),
        });
    } catch (e) {
        setToken("ERROR");
        return;
    }

    const update = () => {
        try {
            const newToken = totp.generate();
            const newPeriod = 30;
            const newRemaining = newPeriod - (Math.floor(Date.now() / 1000) % newPeriod);
            
            setToken(`${newToken.slice(0, 3)} ${newToken.slice(3)}`);
            setRemaining(newRemaining);
            setPeriod(newPeriod);
        } catch (e) {
            setToken("ERROR");
        }
    };

    update(); // Initial run
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [account.secret, account.label, account.issuer]); // Only re-init if account details change

  const progress = remaining / period;
  const isExpiring = remaining < 5;
  
  const handleCopy = () => {
    const rawToken = token.replace(/\s/g, "");
    if (rawToken && rawToken !== "ERROR") {
      navigator.clipboard.writeText(rawToken);
      toast.success(t('account_row.copied'));
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
    }
  };

  const Component = isDraggable ? Reorder.Item : motion.div;

  return (
    <>
        <Component
            value={account}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileDrag={{ 
                scale: 1.03, 
                boxShadow: "0 20px 50px -15px rgba(0,0,0,0.5)", 
                zIndex: 100,
                cursor: "grabbing"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
                "group relative flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 rounded-2xl border transition-all duration-200 gap-4 md:gap-0",
                "bg-white/70 dark:bg-card/40 backdrop-blur-md border-white/20 dark:border-white/5",
                "shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.1)]",
                "dark:hover:bg-card/60 dark:hover:border-primary/20",
                !isDraggable && "hover:-translate-y-0.5"
            )}
            dragListener={false}
            dragControls={controls}
        >
            {/* Drag Handle */}
            {isDraggable && (
                <div 
                    className="absolute left-1 top-4 md:top-1/2 md:-translate-y-1/2 p-3 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-primary hover:bg-primary/5 rounded-xl z-20 touch-none transition-colors"
                    onPointerDown={(e) => controls.start(e)}
                    title="Drag to reorder"
                >
                    <GripVertical className="h-6 w-6" />
                </div>
            )}

            {/* Left Side: Info */}
            <div className={cn("flex items-center md:items-start gap-3 md:gap-4 w-full md:w-auto overflow-hidden transition-all", isDraggable && "pl-8")}>
                <motion.div 
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className={cn(
                        "h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl font-bold uppercase shrink-0 shadow-lg transition-all duration-500",
                        isExpiring 
                            ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-red-500/20" 
                            : "bg-gradient-to-br from-primary to-blue-600 text-white shadow-primary/20"
                    )}
                >
                   {account.label.charAt(0)}
                </motion.div>

                <div className="flex flex-col min-w-0 pr-2">
                    <h3 className="font-bold text-base md:text-lg truncate leading-tight tracking-tight text-foreground/90">{account.label}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {account.tags && account.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] md:text-[10px] font-medium bg-secondary/50 text-secondary-foreground border border-border/50">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Token & Actions */}
            <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 md:gap-8 pl-2 md:pl-0">
                {/* Token Display */}
                <div 
                    className="relative group/token cursor-pointer"
                    onClick={handleCopy}
                >
                    <div className={cn(
                        "font-mono text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.15em] transition-all duration-300 select-none",
                        isExpiring ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "text-foreground group-hover/token:text-primary"
                    )}>
                        {token}
                    </div>
                </div>
                 
                 {/* Circular Timer */}
                 <div className="relative h-10 w-10 md:h-12 md:w-12 flex items-center justify-center shrink-0">
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
                        "absolute text-[10px] md:text-xs font-bold tabular-nums transition-colors", 
                        isExpiring ? "text-red-500" : "text-muted-foreground"
                    )}>
                    {Math.round(remaining)}s
                    </span>
                 </div>

                {/* Quick Actions */}
                <div className="flex md:flex-col gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background/50 md:bg-transparent rounded-lg p-1 md:p-0 backdrop-blur-sm md:backdrop-blur-none border md:border-none border-border/50 absolute md:static top-4 right-4 md:auto z-20">
                    <Button 
                        variant="ghost" size="icon" 
                        onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} 
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant="ghost" size="icon" 
                        onClick={(e) => { e.stopPropagation(); setIsDeleting(true); }} 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                    >
                        <Trash2 className="h-4 w-4" />
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
        </Component>

        {/* Edit Dialog */}
        <EditAccountDialog 
            account={account}
            open={isEditing}
            onOpenChange={setIsEditing}
            onUpdate={onUpdate}
            availableTags={availableTags}
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
