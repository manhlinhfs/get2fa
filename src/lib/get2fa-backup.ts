import type { AppData, LegacyAccount, TwoFactorAccount, Workspace } from "./get2fa-data";

export interface WorkspaceBundle {
  version: 2;
  format: "workspace-bundle";
  exportedAt: string;
  workspaces: Workspace[];
}

export type ParsedBackup =
  | { kind: "bundle"; bundle: WorkspaceBundle }
  | { kind: "legacy"; accounts: LegacyAccount[] };

function nowIso() {
  return new Date().toISOString();
}

function materializeLegacyAccount(account: LegacyAccount): TwoFactorAccount | null {
  if (!account.secret || !account.label) {
    return null;
  }

  const now = nowIso();

  return {
    id: account.id ?? crypto.randomUUID(),
    secret: account.secret,
    issuer: account.issuer ?? "Imported",
    label: account.label,
    tags: account.tags ?? [],
    createdAt: now,
    updatedAt: now,
  };
}

function nextImportedWorkspaceName(existingNames: Set<string>, name: string) {
  if (!existingNames.has(name)) {
    return name;
  }

  let suffix = 0;
  let nextName = `${name} (Imported)`;

  while (existingNames.has(nextName)) {
    suffix += 1;
    nextName = `${name} (Imported ${suffix + 1})`;
  }

  return nextName;
}

export function exportWorkspaceBundle(appData: AppData, workspaceIds: string[]): WorkspaceBundle {
  return {
    version: 2,
    format: "workspace-bundle",
    exportedAt: nowIso(),
    workspaces: appData.workspaces.filter((workspace) => workspaceIds.includes(workspace.id)),
  };
}

export function parseImportedBackup(payload: unknown): ParsedBackup {
  if (Array.isArray(payload)) {
    return { kind: "legacy", accounts: payload as LegacyAccount[] };
  }

  if (
    payload &&
    typeof payload === "object" &&
    "format" in payload &&
    payload.format === "workspace-bundle" &&
    "workspaces" in payload &&
    Array.isArray(payload.workspaces)
  ) {
    return { kind: "bundle", bundle: payload as WorkspaceBundle };
  }

  if (payload && typeof payload === "object" && "data" in payload && Array.isArray(payload.data)) {
    return { kind: "legacy", accounts: payload.data as LegacyAccount[] };
  }

  throw new Error("Unsupported backup payload");
}

export function importLegacyAccountsIntoWorkspace(
  appData: AppData,
  workspaceId: string,
  payload: LegacyAccount[],
): AppData {
  const importedAccounts = payload
    .map(materializeLegacyAccount)
    .filter((account): account is TwoFactorAccount => Boolean(account));

  return {
    ...appData,
    workspaces: appData.workspaces.map((workspace) =>
      workspace.id === workspaceId
        ? {
            ...workspace,
            updatedAt: nowIso(),
            accounts: [...workspace.accounts, ...importedAccounts],
          }
        : workspace,
    ),
  };
}

export function importWorkspaceBundle(appData: AppData, payload: WorkspaceBundle): AppData {
  const existingNames = new Set(appData.workspaces.map((workspace) => workspace.name));
  const importedWorkspaces = payload.workspaces.map((workspace) => {
    const nextName = nextImportedWorkspaceName(existingNames, workspace.name);
    existingNames.add(nextName);

    return {
      ...workspace,
      id: crypto.randomUUID(),
      name: nextName,
      accounts: workspace.accounts.map((account) => ({
        ...account,
        id: crypto.randomUUID(),
      })),
    };
  });

  return {
    ...appData,
    workspaces: [...appData.workspaces, ...importedWorkspaces],
  };
}
