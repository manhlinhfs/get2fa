export interface TwoFactorAccount {
  id: string;
  secret: string;
  issuer: string;
  label: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  accounts: TwoFactorAccount[];
}

export interface AppData {
  version: 1;
  currentWorkspaceId: string;
  workspaces: Workspace[];
}

export interface LegacyAccount {
  id?: string;
  secret: string;
  issuer?: string;
  label?: string;
  tags?: string[];
}

export interface AccountInput {
  secret: string;
  issuer: string;
  label: string;
  tags: string[];
}

function nowIso() {
  return new Date().toISOString();
}

function updateWorkspace(appData: AppData, workspaceId: string, updater: (workspace: Workspace) => Workspace): AppData {
  return {
    ...appData,
    workspaces: appData.workspaces.map((workspace) =>
      workspace.id === workspaceId ? updater(workspace) : workspace,
    ),
  };
}

export function createWorkspace(appData: AppData, name: string): AppData {
  const now = nowIso();
  const workspace: Workspace = {
    id: crypto.randomUUID(),
    name,
    createdAt: now,
    updatedAt: now,
    accounts: [],
  };

  return {
    ...appData,
    currentWorkspaceId: workspace.id,
    workspaces: [...appData.workspaces, workspace],
  };
}

export function renameWorkspace(appData: AppData, workspaceId: string, nextName: string): AppData {
  return updateWorkspace(appData, workspaceId, (workspace) => ({
    ...workspace,
    name: nextName,
    updatedAt: nowIso(),
  }));
}

export function deleteWorkspace(appData: AppData, workspaceId: string): AppData {
  if (appData.workspaces.length <= 1) {
    return appData;
  }

  const workspaces = appData.workspaces.filter((workspace) => workspace.id !== workspaceId);
  const fallbackWorkspace = workspaces.find((workspace) => workspace.name === "Default") ?? workspaces[0];

  return {
    ...appData,
    currentWorkspaceId:
      appData.currentWorkspaceId === workspaceId ? fallbackWorkspace.id : appData.currentWorkspaceId,
    workspaces,
  };
}

export function addAccount(appData: AppData, workspaceId: string, accountInput: AccountInput): AppData {
  const now = nowIso();

  return updateWorkspace(appData, workspaceId, (workspace) => ({
    ...workspace,
    updatedAt: now,
    accounts: [
      {
        id: crypto.randomUUID(),
        ...accountInput,
        createdAt: now,
        updatedAt: now,
      },
      ...workspace.accounts,
    ],
  }));
}

export function updateAccount(appData: AppData, workspaceId: string, account: TwoFactorAccount): AppData {
  return updateWorkspace(appData, workspaceId, (workspace) => ({
    ...workspace,
    updatedAt: nowIso(),
    accounts: workspace.accounts.map((currentAccount) =>
      currentAccount.id === account.id ? account : currentAccount,
    ),
  }));
}

export function moveAccountToWorkspace(
  appData: AppData,
  sourceWorkspaceId: string,
  destinationWorkspaceId: string,
  account: TwoFactorAccount,
): AppData {
  if (sourceWorkspaceId === destinationWorkspaceId) {
    return updateAccount(appData, sourceWorkspaceId, account);
  }

  const nextUpdatedAt = nowIso();
  const destinationWorkspace = appData.workspaces.find(
    (workspace) => workspace.id === destinationWorkspaceId,
  );

  if (!destinationWorkspace) {
    return appData;
  }

  return {
    ...appData,
    workspaces: appData.workspaces.map((workspace) => {
      if (workspace.id === sourceWorkspaceId) {
        return {
          ...workspace,
          updatedAt: nextUpdatedAt,
          accounts: workspace.accounts.filter((currentAccount) => currentAccount.id !== account.id),
        };
      }

      if (workspace.id === destinationWorkspaceId) {
        return {
          ...workspace,
          updatedAt: nextUpdatedAt,
          accounts: [account, ...workspace.accounts],
        };
      }

      return workspace;
    }),
  };
}

export function removeAccount(appData: AppData, workspaceId: string, accountId: string): AppData {
  return updateWorkspace(appData, workspaceId, (workspace) => ({
    ...workspace,
    updatedAt: nowIso(),
    accounts: workspace.accounts.filter((account) => account.id !== accountId),
  }));
}

export function deleteWorkspaceTag(appData: AppData, workspaceId: string, tag: string): AppData {
  const updatedAt = nowIso();

  return updateWorkspace(appData, workspaceId, (workspace) => ({
    ...workspace,
    updatedAt,
    accounts: workspace.accounts.map((account) => ({
      ...account,
      tags: account.tags.filter((currentTag) => currentTag !== tag),
      updatedAt,
    })),
  }));
}

export function reorderWorkspaceAccounts(appData: AppData, workspaceId: string, orderedIds: string[]): AppData {
  return updateWorkspace(appData, workspaceId, (workspace) => {
    const accountMap = new Map(workspace.accounts.map((account) => [account.id, account]));
    const reorderedAccounts = orderedIds
      .map((accountId) => accountMap.get(accountId))
      .filter((account): account is TwoFactorAccount => Boolean(account));

    return {
      ...workspace,
      updatedAt: nowIso(),
      accounts: reorderedAccounts,
    };
  });
}
