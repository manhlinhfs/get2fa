import { useState } from "react";
import { DataBackup } from "@/components/data-backup";
import { HelpDialog } from "@/components/help-dialog";
import { use2FA } from "@/hooks/use-2fa";
import { FilterX, Sparkles } from "lucide-react";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { AddAccountForm } from "@/components/add-account-form";
import { AccountRow } from "@/components/account-row";
import { Toaster } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

function TwoFactorApp() {
  const { t } = useTranslation();
  const { accounts, availableTags, addAccount, removeAccount, updateAccount, importAccounts, reorderAccounts } = use2FA();
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [tagSearch, setTagSearch] = useState("");

  // Calculate popular tags (top 3)
  const popularTags = accounts.reduce((acc, account) => {
    account.tags?.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topTags = Object.entries(popularTags)
    .sort(([, a], [, b]) => b - a) // Sort by count descending
    .slice(0, 3) // Take top 3
    .map(([tag]) => tag);

  const filteredAccounts = filterTag 
    ? accounts.filter(a => a.tags?.includes(filterTag)) 
    : accounts;

  const filteredTagsForSearch = availableTags.filter(tag => 
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen relative font-sans selection:bg-primary/30 overflow-hidden">
       {/* Background Patterns */}
       <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>
       <div className="fixed top-0 left-0 -z-10 h-[500px] w-[500px] bg-primary/10 rounded-full blur-[100px] opacity-50 pointer-events-none translate-x-[-50%] translate-y-[-50%]"></div>
       <div className="fixed bottom-0 right-0 -z-10 h-[500px] w-[500px] bg-blue-500/10 rounded-full blur-[100px] opacity-50 pointer-events-none translate-x-[50%] translate-y-[50%]"></div>

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container flex h-14 md:h-16 items-center justify-between mx-auto px-4 max-w-5xl">
          <motion.div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative flex items-center justify-center h-8 w-8 md:h-10 md:w-10 bg-background/50 border border-border/50 rounded-lg md:rounded-xl shadow-sm group-hover:shadow-primary/20 transition-all duration-300">
               <img src="/icon.png" alt="App Logo" className="h-5 w-5 md:h-6 md:w-6 object-contain" />
               <motion.div 
                 className="absolute inset-0 rounded-lg md:rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
                 initial={false}
                 animate={{ scale: [1, 1.2, 1], opacity: [0, 0.2, 0] }}
                 transition={{ repeat: Infinity, duration: 2 }}
               />
            </div>
            <span className="font-bold text-lg md:text-xl tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                {t('app.title')}
            </span>
          </motion.div>
          
          <div className="flex items-center gap-1 md:gap-2">
             <LanguageToggle />
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
            className="flex items-center gap-3 py-2 flex-wrap"
          >
            <Combobox
              value={filterTag}
              onValueChange={(val) => {
                setFilterTag(val);
                setTagSearch(""); // Reset search on select
              }}
              inputValue={tagSearch}
              onInputValueChange={setTagSearch}
            >
              <ComboboxInput
                placeholder={t('filter.placeholder')}
                className="w-full sm:w-[250px]"
                showClear={!!filterTag}
              />
              <ComboboxContent>
                <ComboboxList>
                  <ComboboxEmpty>{t('filter.no_tags')}</ComboboxEmpty>
                  {filteredTagsForSearch.map((tag) => (
                    <ComboboxItem key={tag} value={tag}>
                      {tag}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            {/* Popular Tags Quick Access */}
            {topTags.length > 0 && (
              <div className="flex items-center gap-2 border-l border-border/40 pl-3 ml-1 overflow-x-auto scrollbar-hide">
                <span className="text-xs text-muted-foreground font-medium hidden sm:inline-block whitespace-nowrap">{t('filter.popular')}</span>
                {topTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-sm whitespace-nowrap",
                      filterTag === tag 
                        ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_-3px_var(--primary)]" 
                        : "bg-background hover:bg-muted border border-border/50 text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setFilterTag(tag === filterTag ? null : tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
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
                        <p className="text-muted-foreground max-w-xs mx-auto font-medium">{t('app.ready')}</p>
                        <p className="text-xs text-muted-foreground/60">{t('app.enter_key')}</p>
                    </div>
                 </motion.div>
             ) : filteredAccounts.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                     <FilterX className="h-12 w-12 opacity-20" />
                     <p>{t('filter.no_match')} <span className="font-semibold text-foreground">{filterTag}</span></p>
                     <button onClick={() => setFilterTag(null)} className="text-primary hover:underline text-sm font-medium">{t('filter.clear')}</button>
                 </div>
             ) : (
                <>
                {/* Use Reorder.Group ONLY when showing all accounts (no filter) */}
                {filterTag === null ? (
                    <Reorder.Group axis="y" values={accounts} onReorder={reorderAccounts} className="space-y-3">
                        {accounts.map((account) => (
                            <AccountRow 
                                key={account.id} 
                                account={account} 
                                onRemove={removeAccount}
                                onUpdate={updateAccount}
                                availableTags={availableTags}
                                isDraggable={true}
                            />
                        ))}
                    </Reorder.Group>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredAccounts.map((account) => (
                            <AccountRow 
                                key={account.id} 
                                account={account} 
                                onRemove={removeAccount}
                                onUpdate={updateAccount}
                                availableTags={availableTags}
                                isDraggable={false}
                            />
                        ))}
                    </AnimatePresence>
                )}
                </>
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