import { useState } from "react";

import {
  addAccount as addWorkspaceAccount,
  createWorkspace as createWorkspaceData,
  deleteWorkspace as deleteWorkspaceData,
  deleteWorkspaceTag as deleteWorkspaceTagData,
  moveAccountToWorkspace,
  removeAccount as removeWorkspaceAccount,
  renameWorkspace as renameWorkspaceData,
  reorderWorkspaceAccounts,
  updateAccount as updateWorkspaceAccount,
  type AccountInput,
  type AppData,
  type TwoFactorAccount,
} from "@/lib/get2fa-data";
import {
  exportWorkspaceBundle,
  importLegacyAccountsIntoWorkspace,
  importWorkspaceBundle,
  parseImportedBackup,
} from "@/lib/get2fa-backup";
import { initializeAppData, writeAppData } from "@/lib/get2fa-storage";

function getActiveWorkspace(appData: AppData) {
  return appData.workspaces.find((workspace) => workspace.id === appData.currentWorkspaceId) ?? appData.workspaces[0];
}

export function useGet2FAApp() {
  const [appData, setAppData] = useState<AppData>(() => initializeAppData());
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const activeWorkspace = getActiveWorkspace(appData);
  const accounts = activeWorkspace.accounts;
  const availableTags = Array.from(new Set(accounts.flatMap((account) => account.tags))).sort();
  const topTags = Object.entries(
    accounts.reduce<Record<string, number>>((accumulator, account) => {
      account.tags.forEach((tag) => {
        accumulator[tag] = (accumulator[tag] ?? 0) + 1;
      });
      return accumulator;
    }, {}),
  )
    .sort(([, left], [, right]) => right - left)
    .slice(0, 3)
    .map(([tag]) => tag);

  const persist = (nextAppData: AppData) => {
    writeAppData(nextAppData);
    setAppData(nextAppData);
  };

  return {
    appData,
    workspaces: appData.workspaces,
    activeWorkspace,
    accounts,
    availableTags,
    topTags,
    filterTag,
    searchQuery,
    setFilterTag,
    setSearchQuery,
    createWorkspace(name: string) {
      setSearchQuery("");
      persist(createWorkspaceData(appData, name));
    },
    renameWorkspace(workspaceId: string, nextName: string) {
      persist(renameWorkspaceData(appData, workspaceId, nextName));
    },
    deleteWorkspace(workspaceId: string) {
      setFilterTag(null);
      setSearchQuery("");
      persist(deleteWorkspaceData(appData, workspaceId));
    },
    selectWorkspace(workspaceId: string) {
      setFilterTag(null);
      setSearchQuery("");
      persist({
        ...appData,
        currentWorkspaceId: workspaceId,
      });
    },
    addAccount(accountInput: AccountInput) {
      persist(addWorkspaceAccount(appData, activeWorkspace.id, accountInput));
    },
    updateAccount(account: TwoFactorAccount, destinationWorkspaceId = activeWorkspace.id) {
      const nextAppData =
        destinationWorkspaceId === activeWorkspace.id
          ? updateWorkspaceAccount(appData, activeWorkspace.id, account)
          : moveAccountToWorkspace(appData, activeWorkspace.id, destinationWorkspaceId, account);

      persist(nextAppData);
    },
    removeAccount(accountId: string) {
      persist(removeWorkspaceAccount(appData, activeWorkspace.id, accountId));
    },
    deleteWorkspaceTag(tag: string) {
      if (filterTag === tag) {
        setFilterTag(null);
      }
      persist(deleteWorkspaceTagData(appData, activeWorkspace.id, tag));
    },
    reorderAccounts(orderedIds: string[]) {
      persist(reorderWorkspaceAccounts(appData, activeWorkspace.id, orderedIds));
    },
    exportSelectedWorkspaces(workspaceIds: string[]) {
      return exportWorkspaceBundle(appData, workspaceIds);
    },
    importBackup(payload: unknown) {
      const parsedBackup = parseImportedBackup(payload);

      if (parsedBackup.kind === "legacy") {
        const nextAppData = importLegacyAccountsIntoWorkspace(appData, activeWorkspace.id, parsedBackup.accounts);
        persist(nextAppData);
        return nextAppData;
      }

      const nextAppData = importWorkspaceBundle(appData, parsedBackup.bundle);
      persist(nextAppData);
      return nextAppData;
    },
  };
}
