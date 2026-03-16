import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { toast } from "sonner";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import { AccountRow } from "@/components/account-row";
import type { AppData } from "@/lib/get2fa-data";

const translations: Record<string, string> = {
  "app.title": "get2fa",
  "filter.placeholder": "Filter by tag...",
  "filter.clear": "Clear filter",
  "workspace.switcher": "Workspace",
  "workspace.create": "New workspace",
  "workspace.rename": "Rename workspace",
  "workspace.delete": "Delete workspace",
  "workspace.dialog.create_title": "Create workspace",
  "workspace.dialog.rename_title": "Rename workspace",
  "workspace.dialog.name_label": "Workspace name",
  "workspace.dialog.create_action": "Create workspace",
  "workspace.dialog.rename_action": "Save workspace",
  "backup.title": "Data Management",
  "backup.export_current": "Export current workspace",
  "backup.center": "Backup Center",
  "backup.export_selected": "Export selected workspaces",
  "backup.import": "Import Backup",
  "backup.export_success": "Backup downloaded successfully",
  "account_row.edit": "Edit",
  "account_row.drag_handle": "Reorder {{label}}",
  "edit_dialog.title": "Edit Account",
  "edit_dialog.account_name": "Account Name",
  "edit_dialog.secret_key": "Secret Key",
  "edit_dialog.workspace": "Workspace",
  "edit_dialog.description": "Update the account details and choose which workspace should contain it.",
  "edit_dialog.move_success": "Moved {{label}} to {{workspace}}",
  "edit_dialog.save_changes": "Save Changes",
};

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, values?: Record<string, string>) =>
      Object.entries(values ?? {}).reduce(
        (text, [name, value]) => text.replaceAll(`{{${name}}}`, value),
        translations[key] ?? key,
      ),
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
  Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
    configurable: true,
    value() {
      const sortableContainer = this.closest("[data-sortable-index]");
      const sortableIndex = Number(sortableContainer?.getAttribute("data-sortable-index") ?? 0);
      const top = sortableIndex * 80;

      return {
        bottom: top + 64,
        height: 64,
        left: 0,
        right: 320,
        toJSON: () => ({}),
        top,
        width: 320,
        x: 0,
        y: top,
      };
    },
  });
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
  Object.defineProperty(URL, "createObjectURL", {
    writable: true,
    value: vi.fn(() => "blob:mock"),
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    writable: true,
    value: vi.fn(),
  });
  Object.defineProperty(HTMLAnchorElement.prototype, "click", {
    writable: true,
    value: vi.fn(),
  });
});

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

function seedAppData(appData: AppData) {
  localStorage.setItem("get2fa_app_v1", JSON.stringify(appData));
}

function readStoredAppData(): AppData {
  return JSON.parse(localStorage.getItem("get2fa_app_v1") ?? "null") as AppData;
}

async function dispatchKeyboardSort(handle: HTMLElement, direction: "ArrowDown" | "ArrowUp") {
  fireEvent.keyDown(handle, { code: "Space", key: " " });
  await new Promise((resolve) => setTimeout(resolve, 0));
  fireEvent.keyDown(handle, { code: direction, key: direction });
  fireEvent.keyDown(handle, { code: "Space", key: " " });
}

describe("workspace app ui", () => {
  it("shows Default as the initial workspace", () => {
    render(<App />);

    expect(screen.getByAltText("App Logo")).toHaveAttribute("src", "/icon.svg?v=20260317-3");
    expect(screen.getByText("get2fa")).toBeInTheDocument();
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

  it("exports the current workspace", async () => {
    const user = userEvent.setup();
    const capturedBlobs: Blob[] = [];
    const downloads: string[] = [];
    const expectedFilename = `get2fa-backup-${new Date().toISOString().split("T")[0]}.json`;

    vi.mocked(URL.createObjectURL).mockImplementation((blob) => {
      capturedBlobs.push(blob as Blob);
      return "blob:current-workspace";
    });
    vi.mocked(HTMLAnchorElement.prototype.click).mockImplementation(function click(this: HTMLAnchorElement) {
      downloads.push(this.download);
    });

    seedAppData({
      version: 1,
      currentWorkspaceId: "default",
      workspaces: [
        {
          id: "default",
          name: "Default",
          createdAt: "2026-03-15T00:00:00.000Z",
          updatedAt: "2026-03-15T00:00:00.000Z",
          accounts: [],
        },
        {
          id: "work",
          name: "Work",
          createdAt: "2026-03-15T00:00:00.000Z",
          updatedAt: "2026-03-15T00:00:00.000Z",
          accounts: [],
        },
      ],
    });

    render(<App />);

    await user.click(screen.getByRole("button", { name: /data management/i }));
    await user.click(screen.getByRole("menuitem", { name: /export current workspace/i }));

    expect(capturedBlobs).toHaveLength(1);
    expect(downloads).toEqual([expectedFilename]);
    const payload = JSON.parse(await capturedBlobs[0].text());
    expect(payload.workspaces).toHaveLength(1);
    expect(payload.workspaces[0].name).toBe("Default");
  });

  it("allows selecting multiple workspaces for backup", async () => {
    const user = userEvent.setup();
    const capturedBlobs: Blob[] = [];

    vi.mocked(URL.createObjectURL).mockImplementation((blob) => {
      capturedBlobs.push(blob as Blob);
      return "blob:selected-workspaces";
    });

    seedAppData({
      version: 1,
      currentWorkspaceId: "default",
      workspaces: [
        {
          id: "default",
          name: "Default",
          createdAt: "2026-03-15T00:00:00.000Z",
          updatedAt: "2026-03-15T00:00:00.000Z",
          accounts: [],
        },
        {
          id: "work",
          name: "Work",
          createdAt: "2026-03-15T00:00:00.000Z",
          updatedAt: "2026-03-15T00:00:00.000Z",
          accounts: [],
        },
      ],
    });

    render(<App />);

    await user.click(screen.getByRole("button", { name: /data management/i }));
    await user.click(screen.getByRole("menuitem", { name: /backup center/i }));
    await user.click(screen.getByRole("checkbox", { name: "Work" }));
    await user.click(screen.getByRole("button", { name: /export selected workspaces/i }));

    expect(capturedBlobs).toHaveLength(1);
    const payload = JSON.parse(await capturedBlobs[0].text());
    expect(payload.workspaces.map((workspace: { name: string }) => workspace.name)).toEqual([
      "Default",
      "Work",
    ]);
  });

  it("imports a legacy payload into the active workspace", async () => {
    const user = userEvent.setup();

    seedAppData({
      version: 1,
      currentWorkspaceId: "work",
      workspaces: [
        {
          id: "default",
          name: "Default",
          createdAt: "2026-03-15T00:00:00.000Z",
          updatedAt: "2026-03-15T00:00:00.000Z",
          accounts: [],
        },
        {
          id: "work",
          name: "Work",
          createdAt: "2026-03-15T00:00:00.000Z",
          updatedAt: "2026-03-15T00:00:00.000Z",
          accounts: [],
        },
      ],
    });

    const { container } = render(<App />);
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const legacyFile = new File(
      [
        JSON.stringify([
          {
            secret: "AAAA",
            issuer: "GitHub",
            label: "GitHub",
            tags: ["work"],
          },
        ]),
      ],
      "legacy-backup.json",
      { type: "application/json" },
    );

    await user.click(screen.getByRole("button", { name: /data management/i }));
    await user.click(screen.getByRole("menuitem", { name: /import backup/i }));
    await user.upload(fileInput, legacyFile);

    expect(await screen.findByText("GitHub")).toBeInTheDocument();
  });

  it("persists reordered accounts after drag end", async () => {
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

    const dragHandle = screen.getByRole("button", { name: /reorder github/i });
    dragHandle.focus();
    await dispatchKeyboardSort(dragHandle, "ArrowDown");

    await waitFor(() => {
      expect(readStoredAppData().workspaces[0].accounts.map((account) => account.id)).toEqual([
        "aws",
        "github",
      ]);
    });
  });

  it("reorders the filtered subset without losing hidden accounts", async () => {
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
            {
              id: "aws",
              secret: "BBBB",
              issuer: "AWS",
              label: "AWS",
              tags: ["cloud"],
              createdAt: "2026-03-15T00:00:00.000Z",
              updatedAt: "2026-03-15T00:00:00.000Z",
            },
            {
              id: "vercel",
              secret: "CCCC",
              issuer: "Vercel",
              label: "Vercel",
              tags: ["work"],
              createdAt: "2026-03-15T00:00:00.000Z",
              updatedAt: "2026-03-15T00:00:00.000Z",
            },
          ],
        },
      ],
    });

    render(<App />);

    const workFilterBadge = screen
      .getAllByText("work")
      .find((element) => element.getAttribute("data-slot") === "badge");
    expect(workFilterBadge).toBeDefined();

    await user.click(workFilterBadge!);

    const dragHandle = screen.getByRole("button", { name: /reorder vercel/i });
    dragHandle.focus();
    await dispatchKeyboardSort(dragHandle, "ArrowUp");

    await waitFor(() => {
      expect(readStoredAppData().workspaces[0].accounts.map((account) => account.id)).toEqual([
        "vercel",
        "aws",
        "github",
      ]);
    });
  });

  it("filters and clears tags without locking page scroll", async () => {
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
            {
              id: "aws",
              secret: "BBBB",
              issuer: "AWS",
              label: "AWS",
              tags: ["cloud"],
              createdAt: "2026-03-15T00:00:00.000Z",
              updatedAt: "2026-03-15T00:00:00.000Z",
            },
            {
              id: "vercel",
              secret: "CCCC",
              issuer: "Vercel",
              label: "Vercel",
              tags: ["project"],
              createdAt: "2026-03-15T00:00:00.000Z",
              updatedAt: "2026-03-15T00:00:00.000Z",
            },
          ],
        },
      ],
    });

    render(<App />);

    const filterSelect = screen.getByRole("combobox", { name: /filter by tag/i });

    await user.selectOptions(filterSelect, "work");

    expect(filterSelect).toHaveValue("work");
    expect(document.body.style.overflow).toBe("");

    await user.click(screen.getByRole("button", { name: /clear filter/i }));

    expect(filterSelect).toHaveValue("");
    expect(document.body.style.overflow).toBe("");
  });

  it("does not lock page scroll after filtering from a quick tag badge", async () => {
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
            {
              id: "aws",
              secret: "BBBB",
              issuer: "AWS",
              label: "AWS",
              tags: ["personal"],
              createdAt: "2026-03-15T00:00:00.000Z",
              updatedAt: "2026-03-15T00:00:00.000Z",
            },
          ],
        },
      ],
    });

    render(<App />);

    const quickFilterBadge = screen
      .getAllByText("work")
      .find((element) => element.getAttribute("data-slot") === "badge");

    expect(quickFilterBadge).toBeDefined();
    expect(document.body.style.overflow).toBe("");

    await user.click(quickFilterBadge!);

    expect(document.body.style.overflow).toBe("");
  });

  it("updates countdown state from a shared clock source", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15T00:00:29.000Z"));

    const setIntervalSpy = vi.spyOn(window, "setInterval");
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
      <>
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
        />
        <AccountRow
          account={{
            id: "aws",
            secret: "JBSWY3DPEHPK3PXP",
            issuer: "AWS",
            label: "AWS",
            tags: ["cloud"],
            createdAt: "2026-03-15T00:00:00.000Z",
            updatedAt: "2026-03-15T00:00:00.000Z",
          }}
          availableTags={["cloud"]}
          currentWorkspaceId="default"
          onRemove={vi.fn()}
          onUpdate={vi.fn()}
          workspaces={workspaces}
        />
      </>,
    );

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    expect(screen.getAllByText("1s")).toHaveLength(2);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(screen.getAllByText("30s")).toHaveLength(2);
  });

  it("moves an edited account into another workspace and shows a toast", async () => {
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

    await user.click(screen.getByRole("button", { name: /^edit$/i }));

    const dialog = screen.getByRole("dialog");
    const workspaceTrigger = within(dialog).getByRole("combobox", { name: /workspace/i });

    await user.click(workspaceTrigger);
    await user.click(screen.getByRole("option", { name: "Work" }));
    await user.click(within(dialog).getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
    });

    expect(readStoredAppData().workspaces[0].accounts).toHaveLength(0);
    expect(readStoredAppData().workspaces[1].accounts.map((account) => account.id)).toEqual([
      "github",
      "aws",
    ]);
    expect(vi.mocked(toast.success)).toHaveBeenCalledWith("Moved GitHub to Work");
  });
});
