import type { AppData, LegacyAccount } from "./get2fa-data";

const APP_STORAGE_KEY = "get2fa_app_v1";
const LEGACY_STORAGE_KEY = "2fa_accounts_v2";

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

export function readAppData(): AppData | null {
  const stored = localStorage.getItem(APP_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as AppData;
  } catch {
    return null;
  }
}

export function writeAppData(appData: AppData) {
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(appData));
}

export function initializeAppData(): AppData {
  const existingAppData = readAppData();

  if (existingAppData) {
    return existingAppData;
  }

  const legacyStored = localStorage.getItem(LEGACY_STORAGE_KEY);

  if (legacyStored) {
    try {
      const migratedAppData = migrateLegacyAccounts(JSON.parse(legacyStored) as LegacyAccount[]);
      writeAppData(migratedAppData);
      return migratedAppData;
    } catch {
      // Fall through to empty initialization.
    }
  }

  const emptyAppData = migrateLegacyAccounts([]);
  writeAppData(emptyAppData);
  return emptyAppData;
}
