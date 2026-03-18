import { useEffect, useMemo, useRef, useState } from "react";
import { DataBackup } from "@/components/data-backup";
import { HelpDialog } from "@/components/help-dialog";
import { useGet2FAApp } from "@/hooks/use-get2fa-app";
import { ArrowDownAZ, Download, FilterX, Search, Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { AddAccountForm } from "@/components/add-account-form";
import { AccountSortableList } from "@/components/account-sortable-list";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { WorkspaceDialog } from "@/components/workspace-dialog";
import { toast, Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { parseImportedBackup } from "@/lib/get2fa-backup";
import { createBackupFilename, downloadBackup } from "@/lib/backup-download";

const APP_LOGO_SRC = "/icon.svg?v=20260317-3";
type SortMode = "manual" | "label-asc" | "label-desc" | "created-desc" | "created-asc";

function TwoFactorApp() {
  const { t } = useTranslation();
  const {
    activeWorkspace,
    accounts,
    availableTags,
    topTags,
    workspaces,
    addAccount,
    deleteWorkspace,
    exportSelectedWorkspaces,
    filterTag,
    importBackup,
    removeAccount,
    renameWorkspace,
    reorderAccounts,
    searchQuery,
    selectWorkspace,
    setSearchQuery,
    setFilterTag,
    createWorkspace,
    deleteWorkspaceTag,
    updateAccount,
  } = useGet2FAApp();
  const [workspaceDialogMode, setWorkspaceDialogMode] = useState<"create" | "rename">("create");
  const [workspaceDialogOpen, setWorkspaceDialogOpen] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("manual");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const applyTagFilter = (nextTag: string | null) => {
    setFilterTag(nextTag);
    window.setTimeout(() => {
      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement) {
        activeElement.blur();
      }
    }, 0);
  };

  const filteredAccounts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return accounts.filter((account) => {
      const matchesTag = filterTag ? account.tags?.includes(filterTag) : true;
      const matchesSearch = normalizedQuery
        ? account.label.toLowerCase().includes(normalizedQuery)
        : true;

      return matchesTag && matchesSearch;
    });
  }, [accounts, filterTag, searchQuery]);
  const sortedAccounts = useMemo(() => {
    if (sortMode === "manual") {
      return filteredAccounts;
    }

    const nextAccounts = [...filteredAccounts];

    switch (sortMode) {
      case "label-asc":
        return nextAccounts.sort((left, right) => left.label.localeCompare(right.label));
      case "label-desc":
        return nextAccounts.sort((left, right) => right.label.localeCompare(left.label));
      case "created-desc":
        return nextAccounts.sort(
          (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
        );
      case "created-asc":
        return nextAccounts.sort(
          (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
        );
      default:
        return nextAccounts;
    }
  }, [filteredAccounts, sortMode]);
  const orderedTags = useMemo(
    () => [...topTags, ...availableTags.filter((tag) => !topTags.includes(tag))],
    [availableTags, topTags],
  );
  const isManualSort = sortMode === "manual";

  useEffect(() => {
    const handleSearchShortcut = (event: KeyboardEvent) => {
      const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f";
      if (!isShortcut) {
        return;
      }

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      event.preventDefault();
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    };

    window.addEventListener("keydown", handleSearchShortcut);
    return () => window.removeEventListener("keydown", handleSearchShortcut);
  }, []);

  const handleImport = (payload: unknown) => {
    const parsedBackup = parseImportedBackup(payload);

    if (parsedBackup.kind === "legacy") {
      const previousCount = activeWorkspace.accounts.length;
      const nextAppData = importBackup(payload);
      const nextWorkspace =
        nextAppData.workspaces.find((workspace) => workspace.id === activeWorkspace.id) ??
        nextAppData.workspaces[0];

      return {
        kind: "legacy" as const,
        count: Math.max(nextWorkspace.accounts.length - previousCount, 0),
      };
    }

    const previousCount = workspaces.length;
    const nextAppData = importBackup(payload);

    return {
      kind: "bundle" as const,
      count: Math.max(nextAppData.workspaces.length - previousCount, 0),
    };
  };

  const handleQuickBackup = () => {
    try {
      downloadBackup(
        exportSelectedWorkspaces([activeWorkspace.id]),
        createBackupFilename("get2fa-backup"),
      );
      toast.success(t("backup.export_success"));
    } catch {
      toast.error(t("backup.export_error"));
    }
  };

  return (
    <div className="min-h-screen relative font-sans selection:bg-primary/30 overflow-hidden">
       {/* Background Patterns */}
       <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>
       <div className="fixed top-0 left-0 -z-10 h-[500px] w-[500px] bg-primary/10 rounded-full blur-[100px] opacity-50 pointer-events-none translate-x-[-50%] translate-y-[-50%]"></div>
       <div className="fixed bottom-0 right-0 -z-10 h-[500px] w-[500px] bg-blue-500/10 rounded-full blur-[100px] opacity-50 pointer-events-none translate-x-[50%] translate-y-[50%]"></div>

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex max-w-5xl flex-wrap items-center gap-x-3 gap-y-3 px-4 py-3 md:h-16 md:flex-nowrap md:justify-between md:py-0">
          <div
            className="order-1 flex min-w-0 items-center gap-2 md:flex-1 md:gap-3"
            data-testid="app-header-brand"
          >
            <motion.div
              className="flex min-w-0 items-center gap-2 md:gap-3 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative flex items-center justify-center h-8 w-8 md:h-10 md:w-10 bg-background/50 border border-border/50 rounded-lg md:rounded-xl shadow-sm group-hover:shadow-primary/20 transition-all duration-300">
                 <img src={APP_LOGO_SRC} alt="App Logo" className="h-5 w-5 md:h-6 md:w-6 object-contain" />
                 <motion.div
                   className="absolute inset-0 rounded-lg md:rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
                   initial={false}
                   animate={{ scale: [1, 1.2, 1], opacity: [0, 0.2, 0] }}
                   transition={{ repeat: Infinity, duration: 2 }}
                 />
              </div>
              <span className="truncate font-bold text-lg md:text-xl tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                  {t('app.title')}
              </span>
            </motion.div>
          </div>

          <div
            className="order-2 ml-auto flex items-center gap-1 md:order-3 md:ml-0 md:gap-2"
            data-testid="app-header-actions"
          >
             <LanguageToggle />
             <HelpDialog />
             <DataBackup
               activeWorkspaceId={activeWorkspace.id}
               onExportCurrentWorkspace={() => exportSelectedWorkspaces([activeWorkspace.id])}
               onExportSelectedWorkspaces={exportSelectedWorkspaces}
               onImport={handleImport}
               workspaces={workspaces}
             />
             <ModeToggle />
          </div>

          <div
            className="order-3 w-full md:order-2 md:w-auto md:flex-shrink-0"
            data-testid="app-header-workspace"
          >
            <WorkspaceSwitcher
              activeWorkspaceId={activeWorkspace.id}
              onCreateWorkspace={() => {
                setWorkspaceDialogMode("create");
                setWorkspaceDialogOpen(true);
              }}
              onDeleteWorkspace={() => deleteWorkspace(activeWorkspace.id)}
              onRenameWorkspace={() => {
                setWorkspaceDialogMode("rename");
                setWorkspaceDialogOpen(true);
              }}
              onSelectWorkspace={selectWorkspace}
              workspaces={workspaces}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        {/* Top Section: Add Form with Glass Effect */}
        <section className="relative z-10">
            <AddAccountForm onAdd={addAccount} availableTags={availableTags} />
        </section>

        {/* Filter Section */}
        {(accounts.length > 0 || availableTags.length > 0) && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3 py-2"
            initial={{ opacity: 0, y: 10 }}
          >
            <div className="grid w-full gap-2 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_auto] lg:items-center">
              {accounts.length > 0 && (
                <div className="relative w-full min-w-0">
                  <label className="sr-only" htmlFor="account-search">
                    {t("app.search_placeholder")}
                  </label>
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    aria-label={t("app.search_placeholder")}
                    className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-10 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    id="account-search"
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={t("app.search_placeholder")}
                    ref={searchInputRef}
                    role="searchbox"
                    type="search"
                    value={searchQuery}
                  />
                  {searchQuery && (
                    <button
                      aria-label={t("filter.clear")}
                      className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => setSearchQuery("")}
                      type="button"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              )}

              {availableTags.length > 0 && (
                <div className="flex w-full min-w-0 items-center gap-2">
                  <label className="sr-only" htmlFor="tag-filter">
                    {t("filter.placeholder")}
                  </label>
                  <select
                    aria-label={t("filter.placeholder")}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:w-[220px] lg:w-full"
                    id="tag-filter"
                    onChange={(event) => applyTagFilter(event.target.value || null)}
                    value={filterTag ?? ""}
                  >
                    <option value="">{t("filter.placeholder")}</option>
                    {availableTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                  {filterTag && (
                    <button
                      className="shrink-0 rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      onClick={() => applyTagFilter(null)}
                      type="button"
                    >
                      {t("filter.clear")}
                    </button>
                  )}
                </div>
              )}

              {accounts.length > 0 && (
                <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:justify-end">
                  <label className="sr-only" htmlFor="account-sort">
                    {t("sort.label")}
                  </label>
                  <div className="relative min-w-0 flex-1 lg:w-[180px] lg:flex-none">
                    <ArrowDownAZ className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <select
                      aria-label={t("sort.label")}
                      className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      id="account-sort"
                      onChange={(event) => setSortMode(event.target.value as SortMode)}
                      value={sortMode}
                    >
                      <option value="manual">{t("sort.manual")}</option>
                      <option value="label-asc">{t("sort.name_asc")}</option>
                      <option value="label-desc">{t("sort.name_desc")}</option>
                      <option value="created-desc">{t("sort.newest")}</option>
                      <option value="created-asc">{t("sort.oldest")}</option>
                    </select>
                  </div>
                  <button
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-muted"
                    onClick={handleQuickBackup}
                    type="button"
                  >
                    <Download className="size-4" />
                    <span>{t("app.quick_backup")}</span>
                  </button>
                </div>
              )}
            </div>

            {availableTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {orderedTags.map((tag) => (
                  <div
                    key={tag}
                    className={cn(
                      "inline-flex items-center overflow-hidden rounded-full border text-xs shadow-sm transition-colors",
                      filterTag === tag
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border/60 bg-background text-muted-foreground",
                    )}
                  >
                    <button
                      className={cn(
                        "px-3 py-1.5 hover:bg-muted/60",
                        filterTag === tag && "hover:bg-primary/5",
                      )}
                      onClick={() => applyTagFilter(tag === filterTag ? null : tag)}
                      type="button"
                    >
                      {tag}
                    </button>
                    <button
                      aria-label={t("filter.delete_tag", { tag })}
                      className="border-l border-border/50 px-2 py-1.5 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => {
                        if (window.confirm(t("filter.delete_tag_confirm", { tag }))) {
                          deleteWorkspaceTag(tag);
                        }
                      }}
                      type="button"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* List Section */}
        <div className="space-y-2.5 pb-20">
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
                     {searchQuery ? (
                       <p>
                         {t("app.search_placeholder")}:{" "}
                         <span className="font-semibold text-foreground">{searchQuery}</span>
                       </p>
                     ) : (
                       <p>
                         {t('filter.no_match')}{" "}
                         <span className="font-semibold text-foreground">{filterTag}</span>
                       </p>
                     )}
                     <div className="flex gap-3">
                       {filterTag && (
                         <button onClick={() => applyTagFilter(null)} className="text-primary hover:underline text-sm font-medium">
                           {t('filter.clear')}
                         </button>
                       )}
                       {searchQuery && (
                         <button onClick={() => setSearchQuery("")} className="text-primary hover:underline text-sm font-medium">
                           {t('filter.clear')}
                         </button>
                       )}
                     </div>
                 </div>
             ) : (
                <AccountSortableList
                  accounts={accounts}
                  availableTags={availableTags}
                  currentWorkspaceId={activeWorkspace.id}
                  isSortable={isManualSort}
                  onRemove={removeAccount}
                  onReorder={reorderAccounts}
                  onUpdate={updateAccount}
                  visibleAccounts={sortedAccounts}
                  workspaces={workspaces}
                />
             )}
        </div>
      </main>
      <WorkspaceDialog
        key={`${workspaceDialogMode}-${activeWorkspace.id}`}
        initialName={workspaceDialogMode === "rename" ? activeWorkspace.name : ""}
        mode={workspaceDialogMode}
        onOpenChange={setWorkspaceDialogOpen}
        onSubmit={(name) => {
          if (workspaceDialogMode === "create") {
            createWorkspace(name);
            return;
          }

          renameWorkspace(activeWorkspace.id, name);
        }}
        open={workspaceDialogOpen}
      />
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
