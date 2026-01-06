import { useState } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { AddAccountForm } from "@/components/add-account-form";
import { AccountRow } from "@/components/account-row";
import { DataBackup } from "@/components/data-backup";
import { HelpDialog } from "@/components/help-dialog";
import { use2FA } from "@/hooks/use-2fa";
import { ShieldCheck, FilterX, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function TwoFactorApp() {
  const { accounts, availableTags, addAccount, removeAccount, updateAccount, importAccounts } = use2FA();
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const filteredAccounts = filterTag 
    ? accounts.filter(a => a.tags?.includes(filterTag)) 
    : accounts;

  return (
    <div className="min-h-screen relative font-sans selection:bg-primary/30 overflow-hidden">
       {/* Background Patterns */}
       <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>
       <div className="fixed top-0 left-0 -z-10 h-[500px] w-[500px] bg-primary/10 rounded-full blur-[100px] opacity-50 pointer-events-none translate-x-[-50%] translate-y-[-50%]"></div>
       <div className="fixed bottom-0 right-0 -z-10 h-[500px] w-[500px] bg-blue-500/10 rounded-full blur-[100px] opacity-50 pointer-events-none translate-x-[50%] translate-y-[50%]"></div>

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between mx-auto px-4 max-w-5xl">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative flex items-center justify-center h-10 w-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl text-white shadow-[0_0_20px_-5px_rgba(var(--primary),0.5)] group-hover:shadow-primary/40 transition-shadow duration-300">
               <ShieldCheck className="h-6 w-6" />
               <motion.div 
                 className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                 initial={false}
                 animate={{ scale: [1, 1.2, 1], opacity: [0, 0.2, 0] }}
                 transition={{ repeat: Infinity, duration: 2 }}
               />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                Authenticator
            </span>
          </motion.div>
          
          <div className="flex items-center gap-2">
             <HelpDialog />
             <DataBackup accounts={accounts} onImport={importAccounts} />
             <ModeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        {/* Top Section: Add Form with Glass Effect */}
        <section className="relative z-10">
            <AddAccountForm onAdd={addAccount} availableTags={availableTags} />
        </section>

        {/* Filter Section */}
        {availableTags.length > 0 && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide py-2"
            >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 backdrop-blur-sm text-xs font-medium text-muted-foreground shrink-0">
                    <FilterX className="h-3.5 w-3.5" />
                    Filters
                </div>
                
                <Badge 
                    variant={filterTag === null ? "default" : "secondary"}
                    className={cn(
                        "cursor-pointer transition-all shrink-0 px-4 py-1.5 h-auto text-xs hover:shadow-md", 
                        filterTag === null ? "bg-primary text-primary-foreground shadow-primary/20" : "bg-card hover:bg-card/80 border border-border/50"
                    )}
                    onClick={() => setFilterTag(null)}
                >
                    All
                </Badge>
                {availableTags.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className={cn(
                            "cursor-pointer transition-all shrink-0 px-4 py-1.5 h-auto text-xs hover:shadow-md border border-transparent", 
                            filterTag === tag 
                                ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_-3px_var(--primary)]" 
                                : "bg-card hover:bg-card/80 border-border/50 text-muted-foreground"
                        )}
                        onClick={() => setFilterTag(tag === filterTag ? null : tag)}
                    >
                        {tag}
                    </Badge>
                ))}
            </motion.div>
        )}

        {/* List Section */}
        <div className="space-y-3 pb-20">
             {accounts.length === 0 ? (
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-center space-y-4 border-2 border-dashed border-muted-foreground/10 rounded-3xl bg-card/30"
                 >
                    <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground max-w-xs mx-auto font-medium">Ready to secure your digital life.</p>
                        <p className="text-xs text-muted-foreground/60">Enter a secret key above to generate your first 2FA code.</p>
                    </div>
                 </motion.div>
             ) : filteredAccounts.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                     <FilterX className="h-12 w-12 opacity-20" />
                     <p>No accounts match tag: <span className="font-semibold text-foreground">{filterTag}</span></p>
                     <button onClick={() => setFilterTag(null)} className="text-primary hover:underline text-sm font-medium">Clear filter</button>
                 </div>
             ) : (
                <AnimatePresence mode="popLayout">
                  {filteredAccounts.map((account) => (
                    <AccountRow 
                      key={account.id} 
                      account={account} 
                      onRemove={removeAccount}
                      onUpdate={updateAccount}
                      availableTags={availableTags}
                    />
                  ))}
                </AnimatePresence>
             )}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TwoFactorApp />
      <Toaster richColors position="top-center" theme="system" />
    </ThemeProvider>
  );
}