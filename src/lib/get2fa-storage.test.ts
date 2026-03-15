import { describe, expect, it } from "vitest";

import {
  addAccount,
  createWorkspace,
  deleteWorkspace,
  renameWorkspace,
  reorderWorkspaceAccounts,
} from "./get2fa-data";
import { migrateLegacyAccounts } from "./get2fa-storage";

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
});
