import type { AppData, LegacyAccount } from "./get2fa-data";

export function migrateLegacyAccounts(legacyAccounts: LegacyAccount[]): AppData {
  const now = new Date().toISOString();
  const workspaceId = crypto.randomUUID();

  return {
    version: 1,
    currentWorkspaceId: workspaceId,
    workspaces: [
      {
        id: workspaceId,
        name: "Default",
        createdAt: now,
        updatedAt: now,
        accounts: legacyAccounts.map((account) => ({
          id: account.id ?? crypto.randomUUID(),
          secret: account.secret,
          issuer: account.issuer ?? "Imported",
          label: account.label ?? "Imported Account",
          tags: account.tags ?? [],
          createdAt: now,
          updatedAt: now,
        })),
      },
    ],
  };
}
