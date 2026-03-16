import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AccountRow } from "@/components/account-row";

const translations: Record<string, string> = {
  "account_row.copied": "Copied code",
  "account_row.copied_short": "Copied",
  "account_row.copy_code": "Copy code",
  "account_row.drag_handle": "Reorder {{label}}",
  "account_row.edit": "Edit",
  "account_row.delete_action": "Delete",
  "account_row.delete_title": "Delete account",
  "account_row.delete_desc": "Remove <1>{{label}}</1>?",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
};

function translate(key: string, values?: Record<string, string>) {
  const template = translations[key] ?? key;

  return Object.entries(values ?? {}).reduce(
    (text, [name, value]) => text.replaceAll(`{{${name}}}`, value),
    template,
  );
}

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, values?: Record<string, string>) => translate(key, values),
  }),
  Trans: ({ children }: { children?: React.ReactNode }) => children,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe("AccountRow accessibility", () => {
  it("exposes accessible copy, edit, and delete actions", async () => {
    const user = userEvent.setup({ writeToClipboard: false });
    const workspaces = [
      {
        id: "default",
        name: "Default",
        createdAt: "2026-03-15T00:00:00.000Z",
        updatedAt: "2026-03-15T00:00:00.000Z",
        accounts: [],
      },
    ];

    render(
      <AccountRow
        account={{
          id: "github",
          secret: "JBSWY3DPEHPK3PXP",
          issuer: "GitHub",
          label: "GitHub",
          tags: ["work"],
          createdAt: "2026-03-15T00:00:00.000Z",
          updatedAt: "2026-03-15T00:00:00.000Z",
        }}
        availableTags={["work"]}
        currentWorkspaceId="default"
        onRemove={vi.fn()}
        onUpdate={vi.fn()}
        workspaces={workspaces}
      />,
    );

    await user.click(screen.getByRole("button", { name: /copy code/i }));

    expect(await screen.findByText("Copied")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^edit$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^delete$/i })).toBeInTheDocument();
  });
});
