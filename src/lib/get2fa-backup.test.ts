import { describe, expect, it } from "vitest";

import { addAccount, createWorkspace } from "./get2fa-data";
import {
  exportWorkspaceBundle,
  importLegacyAccountsIntoWorkspace,
  importWorkspaceBundle,
} from "./get2fa-backup";
import { migrateLegacyAccounts } from "./get2fa-storage";

describe("get2fa backup helpers", () => {
  it("exports the current workspace as a workspace bundle", () => {
    const initial = migrateLegacyAccounts([
      {
        id: "a1",
        secret: "AAAA",
        issuer: "GitHub",
        label: "GitHub",
        tags: ["work"],
      },
    ]);

    const bundle = exportWorkspaceBundle(initial, [initial.currentWorkspaceId]);

    expect(bundle.version).toBe(2);
    expect(bundle.format).toBe("workspace-bundle");
    expect(bundle.workspaces).toHaveLength(1);
    expect(bundle.workspaces[0].name).toBe("Default");
  });

  it("exports multiple selected workspaces", () => {
    const initial = createWorkspace(migrateLegacyAccounts([]), "Work");
    const result = addAccount(initial, initial.currentWorkspaceId, {
      secret: "BBBB",
      issuer: "AWS",
      label: "AWS",
      tags: ["cloud"],
    });

    const bundle = exportWorkspaceBundle(result, result.workspaces.map((workspace) => workspace.id));

    expect(bundle.workspaces).toHaveLength(2);
    expect(bundle.workspaces.map((workspace) => workspace.name)).toEqual(["Default", "Work"]);
  });

  it("imports legacy array payloads into a destination workspace", () => {
    const initial = migrateLegacyAccounts([]);

    const result = importLegacyAccountsIntoWorkspace(initial, initial.currentWorkspaceId, [
      {
        secret: "AAAA",
        issuer: "GitHub",
        label: "GitHub",
        tags: ["work"],
      },
    ]);

    expect(result.workspaces[0].accounts).toHaveLength(1);
    expect(result.workspaces[0].accounts[0].label).toBe("GitHub");
  });

  it("renames imported workspaces when names conflict", () => {
    const initial = createWorkspace(migrateLegacyAccounts([]), "Work");

    const result = importWorkspaceBundle(initial, {
      version: 2,
      format: "workspace-bundle",
      exportedAt: "2026-03-15T00:00:00.000Z",
      workspaces: [
        {
          id: "imported-work",
          name: "Work",
          createdAt: "2026-03-15T00:00:00.000Z",
          updatedAt: "2026-03-15T00:00:00.000Z",
          accounts: [],
        },
      ],
    });

    expect(result.workspaces).toHaveLength(3);
    expect(result.workspaces[2].name).toBe("Work (Imported)");
  });
});
