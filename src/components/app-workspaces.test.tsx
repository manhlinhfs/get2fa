import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import type { AppData } from "@/lib/get2fa-data";

const translations: Record<string, string> = {
  "app.title": "Authenticator",
  "workspace.switcher": "Workspace",
  "workspace.create": "New workspace",
  "workspace.rename": "Rename workspace",
  "workspace.delete": "Delete workspace",
  "workspace.dialog.create_title": "Create workspace",
  "workspace.dialog.rename_title": "Rename workspace",
  "workspace.dialog.name_label": "Workspace name",
  "workspace.dialog.create_action": "Create workspace",
  "workspace.dialog.rename_action": "Save workspace",
};

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => translations[key] ?? key,
    i18n: {
      language: "en",
      changeLanguage: vi.fn(),
    },
  }),
  Trans: ({ children }: { children?: React.ReactNode }) => children,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
  Toaster: () => null,
}));

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("dark"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

beforeEach(() => {
  localStorage.clear();
});

function seedAppData(appData: AppData) {
  localStorage.setItem("get2fa_app_v1", JSON.stringify(appData));
}

describe("workspace app ui", () => {
  it("shows Default as the initial workspace", () => {
    render(<App />);

    expect(screen.getByRole("button", { name: /default/i })).toBeInTheDocument();
  });

  it("switches visible accounts when the workspace changes", async () => {
    const user = userEvent.setup();

    seedAppData({
      version: 1,
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
    });

    render(<App />);

    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.queryByText("AWS")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /default/i }));
    await user.click(screen.getByRole("menuitemradio", { name: "Work" }));

    expect(screen.getByText("AWS")).toBeInTheDocument();
    expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
  });

  it("creates a new workspace from the workspace dialog", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: /default/i }));
    await user.click(screen.getByRole("menuitem", { name: /new workspace/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/workspace name/i), "Project A");
    await user.click(screen.getByRole("button", { name: /create workspace/i }));

    expect(screen.getByRole("button", { name: /project a/i })).toBeInTheDocument();
  });
});
