import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Pencil, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { TwoFactorAccount } from "@/hooks/use-2fa";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

interface AccountRowProps {
  account: TwoFactorAccount;
  onRemove: (id: string) => void;
  onUpdate: (account: TwoFactorAccount) => void;
  availableTags: string[];
}

export function AccountRow({ account, onRemove, onUpdate, availableTags }: AccountRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [justCopied, setJustCopied] = useState(false);
  
  const progress = (account.remaining || 0) / (account.period || 30);
  const isExpiring = (account.remaining || 0) < 5;
  
  const formattedToken = account.token 
    ? `${account.token.slice(0, 3)} ${account.token.slice(3)}`
    : "--- ---";

  const handleCopy = () => {
    if (account.token) {
      navigator.clipboard.writeText(account.token);
      toast.success("Copied code to clipboard");
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
        whileHover={{ scale: 1.01, y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="group relative flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-card/40 backdrop-blur-md border border-border/50 shadow-sm hover:shadow-xl hover:bg-card/60 transition-all duration-300"
        >
            {/* Left Side: Info */}
            <div className="flex items-start gap-4 mb-4 md:mb-0 w-full md:w-auto overflow-hidden">
                <motion.div 
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center text-xl font-bold uppercase shrink-0 shadow-lg transition-all duration-500",
                        isExpiring 
                            ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-red-500/20" 
                            : "bg-gradient-to-br from-primary to-blue-600 text-white shadow-primary/20"
                    )}
                >
                   {account.label.charAt(0)}
                </motion.div>

                <div className="flex flex-col min-w-0 pr-4">
                    <h3 className="font-bold text-lg truncate leading-tight tracking-tight text-foreground/90">{account.label}</h3>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {account.tags && account.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-secondary/50 text-secondary-foreground border border-border/50">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Token & Actions */}
            <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 md:gap-8">
                {/* Token Display */}
                <div 
                    className="relative group/token cursor-pointer"
                    onClick={handleCopy}
                >
                    <div className={cn(
                        "font-mono text-3xl md:text-4xl font-bold tracking-[0.15em] transition-all duration-300 select-none",
                        isExpiring ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "text-foreground group-hover/token:text-primary"
                    )}>
                        {formattedToken}
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground opacity-0 group-hover/token:opacity-100 transition-opacity whitespace-nowrap">
                        Click to copy
                    </div>
                </div>
                 
                                 {/* Circular Timer */}
                                  <div className="relative h-12 w-12 flex items-center justify-center shrink-0">
                                     <svg className="w-full h-full -rotate-90 scale-x-[-1]" viewBox="0 0 36 36">
                                         <circle
                                           className="text-muted/10"                                              cx="18" cy="18" r="16"
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
                                        </svg>                      <span className={cn(
                          "absolute text-xs font-bold tabular-nums transition-colors", 
                          isExpiring ? "text-red-500" : "text-muted-foreground"
                        )}>
                        {Math.round(account.remaining || 0)}s
                      </span>
                 </div>

                {/* Quick Actions (Floating on Desktop, Static on Mobile) */}
                <div className="flex md:flex-col gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background/50 md:bg-transparent rounded-lg p-1 md:p-0 backdrop-blur-sm md:backdrop-blur-none border md:border-none border-border/50 absolute md:static top-4 right-4 md:auto">
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
                        className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-2xl"
                    >
                        <div className="flex flex-col items-center gap-2 text-green-500">
                            <CheckCircle2 className="h-8 w-8" />
                            <span className="font-bold text-sm">Copied!</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>

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
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to remove <span className="font-bold text-foreground">{account.label}</span>? 
                        <br/>This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="border-border/50 hover:bg-muted/50">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onRemove(account.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
