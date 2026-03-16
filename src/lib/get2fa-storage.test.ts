import { beforeEach, describe, expect, it } from "vitest";

import {
  addAccount,
  createWorkspace,
  deleteWorkspace,
  moveAccountToWorkspace,
  renameWorkspace,
  reorderWorkspaceAccounts,
} from "./get2fa-data";
import {
  initializeAppData,
  migrateLegacyAccounts,
  readAppData,
  writeAppData,
} from "./get2fa-storage";

beforeEach(() => {
  localStorage.clear();
});

describe("migrateLegacyAccounts", () => {
  it("creates a Default workspace from legacy flat accounts", () => {
    const result = migrateLegacyAccounts([
      {
        id: "a1",
        secret: "AAAA",
        issuer: "GitHub",
        label: "GitHub",
        tags: ["work"],
      },
    ]);

    expect(result.workspaces).toHaveLength(1);
    expect(result.workspaces[0].name).toBe("Default");
    expect(result.currentWorkspaceId).toBe(result.workspaces[0].id);
    expect(result.workspaces[0].accounts[0].label).toBe("GitHub");
  });
});

describe("workspace reducers", () => {
  it("creates a workspace", () => {
    const initial = migrateLegacyAccounts([]);

    const result = createWorkspace(initial, "Work");

    expect(result.workspaces).toHaveLength(2);
    expect(result.workspaces[1].name).toBe("Work");
    expect(result.currentWorkspaceId).toBe(result.workspaces[1].id);
  });

  it("renames a workspace", () => {
    const initial = createWorkspace(migrateLegacyAccounts([]), "Work");
    const workspaceId = initial.currentWorkspaceId;

    const result = renameWorkspace(initial, workspaceId, "Personal");

    expect(result.workspaces[1].name).toBe("Personal");
  });

  it("prevents deleting the last workspace", () => {
    const initial = migrateLegacyAccounts([]);

    const result = deleteWorkspace(initial, initial.currentWorkspaceId);

    expect(result).toEqual(initial);
  });

  it("adds an account to the active workspace", () => {
    const initial = migrateLegacyAccounts([]);
    const workspaceId = initial.currentWorkspaceId;

    const result = addAccount(initial, workspaceId, {
      secret: "AAAA",
      issuer: "GitHub",
      label: "GitHub",
      tags: ["work"],
    });

    expect(result.workspaces[0].accounts).toHaveLength(1);
    expect(result.workspaces[0].accounts[0].issuer).toBe("GitHub");
  });

  it("reorders accounts inside a workspace", () => {
    const initial = migrateLegacyAccounts([
      {
        id: "a1",
        secret: "AAAA",
        issuer: "GitHub",
        label: "GitHub",
        tags: ["work"],
      },
      {
        id: "a2",
        secret: "BBBB",
        issuer: "AWS",
        label: "AWS",
        tags: ["cloud"],
      },
    ]);

    const result = reorderWorkspaceAccounts(initial, initial.currentWorkspaceId, ["a2", "a1"]);

    expect(result.workspaces[0].accounts.map((account) => account.id)).toEqual(["a2", "a1"]);
  });

  it("moves an account to the top of another workspace", () => {
    const initial = {
      version: 1 as const,
      currentWorkspaceId: "default",
      workspaces: [
        {
          id: "default",
          name: "Default",
          createdAt: "2026-03-15T00:00:00.000Z",
          updatedAt: "2026-03-15T00:00:00.000Z",
          accounts: [
            {
              id: "github",
              secret: "AAAA",
              issuer: "GitHub",
              label: "GitHub",
              tags: ["work"],
              createdAt: "2026-03-15T00:00:00.000Z",
              updatedAt: "2026-03-15T00:00:00.000Z",
            },
          ],
        },
        {
          id: "work",
          name: "Work",
          createdAt: "2026-03-15T00:00:00.000Z",
          updatedAt: "2026-03-15T00:00:00.000Z",
          accounts: [
            {
              id: "aws",
              secret: "BBBB",
              issuer: "AWS",
              label: "AWS",
              tags: ["cloud"],
              createdAt: "2026-03-15T00:00:00.000Z",
              updatedAt: "2026-03-15T00:00:00.000Z",
            },
          ],
        },
      ],
    };

    const result = moveAccountToWorkspace(initial, "default", "work", {
      ...initial.workspaces[0].accounts[0],
      label: "GitHub Prod",
      updatedAt: "2026-03-16T00:00:00.000Z",
    });

    expect(result.workspaces[0].accounts).toHaveLength(0);
    expect(result.workspaces[1].accounts.map((account) => account.id)).toEqual(["github", "aws"]);
    expect(result.workspaces[1].accounts[0].label).toBe("GitHub Prod");
  });
});

describe("storage helpers", () => {
  it("loads existing app data from get2fa_app_v1", () => {
    const appData = migrateLegacyAccounts([]);

    writeAppData(appData);

    expect(readAppData()).toEqual(appData);
  });

  it("migrates from 2fa_accounts_v2 when the new key is absent", () => {
    localStorage.setItem(
      "2fa_accounts_v2",
      JSON.stringify([
        {
          id: "a1",
          secret: "AAAA",
          issuer: "GitHub",
          label: "GitHub",
          tags: ["work"],
        },
      ]),
    );

    const result = initializeAppData();

    expect(result.workspaces).toHaveLength(1);
    expect(result.workspaces[0].name).toBe("Default");
    expect(result.workspaces[0].accounts[0].secret).toBe("AAAA");
    expect(readAppData()).toEqual(result);
  });
});
