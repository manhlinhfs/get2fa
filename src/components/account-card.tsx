import { motion } from "framer-motion";
import { MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { TwoFactorAccount } from "@/hooks/use-2fa";
import { colorTagMap } from "@/lib/colors";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AccountCardProps {
  account: TwoFactorAccount;
  onRemove: (id: string) => void;
}

export function AccountCard({ account, onRemove }: AccountCardProps) {
  const styles = colorTagMap[account.colorTag] || colorTagMap.default;
  const progress = (account.remaining || 0) / (account.period || 30);
  
  // Format token: 123456 -> 123 456
  const formattedToken = account.token 
    ? `${account.token.slice(0, 3)} ${account.token.slice(3)}`
    : "--- ---";

  const handleCopy = () => {
    if (account.token) {
      navigator.clipboard.writeText(account.token);
      toast.success("Copied to clipboard", {
        description: `${account.token} copied`,
      });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={cn(
          "relative overflow-hidden transition-all hover:shadow-lg group cursor-pointer",
          styles.border,
          styles.bg
        )}
        onClick={handleCopy}
      >
        {/* Progress Background */}
        <div 
          className="absolute bottom-0 left-0 h-1 bg-primary/20 transition-all duration-1000 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />

        <div className="p-5 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 min-w-0">
              <h3 className="font-semibold text-sm text-muted-foreground truncate" title={account.issuer}>
                {account.issuer}
              </h3>
              <p className="text-lg font-medium truncate" title={account.label}>
                {account.label}
              </p>
            </div>
            
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
               <div className={cn("text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider opacity-80", styles.badge)}>
                  {account.colorTag}
               </div>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                    onClick={() => onRemove(account.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex justify-between items-end">
             <div className="font-mono text-4xl font-bold tracking-wider text-primary group-hover:scale-105 transition-transform origin-left">
                {formattedToken}
             </div>
             <div className="relative">
                {/* Circular Progress Indicator (Small) */}
                 <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-muted/20"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className={cn("transition-all duration-1000 ease-linear", styles.text)}
                      strokeDasharray={`${progress * 100}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono opacity-50">
                    {Math.round(account.remaining || 0)}
                  </div>
             </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
