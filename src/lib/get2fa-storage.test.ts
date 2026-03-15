import { describe, expect, it } from "vitest";

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
