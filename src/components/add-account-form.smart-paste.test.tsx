import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { AddAccountForm } from "@/components/add-account-form";
import { toast } from "sonner";

const translations: Record<string, string> = {
  "add_form.paste_secret_expanded": "Paste a secret key",
  "add_form.paste_secret_collapsed": "Paste a secret key",
  "add_form.paste_clipboard": "Pasted from clipboard",
  "add_form.paste_autofill": "Pasted and filled account details",
  "add_form.clipboard_error": "Clipboard access denied",
  "add_form.service_placeholder": "Account or service name",
  "add_form.add_tags_placeholder": "Add tags...",
  "add_form.save_authenticator": "Save account",
  "add_form.success": "Account added successfully",
  "common.cancel": "Cancel",
};

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => translations[key] ?? key,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

let readTextMock: ReturnType<typeof vi.fn>;

describe("AddAccountForm smart paste", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn();
    readTextMock = vi.fn();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        readText: readTextMock,
      },
    });
  });

  it("autofills account name and secret from the paste button clipboard payload", async () => {
    const onAdd = vi.fn();
    readTextMock.mockResolvedValue(
      "leekimsa69@outlook.com|51SUkzbLPpBx|CDGH7YO6SDJGD35PJOJL5H7NAPCX4PPE|Team|17/03|KR",
    );

    render(<AddAccountForm onAdd={onAdd} availableTags={[]} />);

    fireEvent.click(screen.getByTitle("Paste"));

    await waitFor(() => {
      expect(readTextMock).toHaveBeenCalledTimes(1);
      expect(screen.getByDisplayValue("leekimsa69@outlook.com")).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue("CDGH7YO6SDJGD35PJOJL5H7NAPCX4PPE")).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("Pasted and filled account details");
  });

  it("autofills account name and secret when users paste directly into the secret input", async () => {
    const onAdd = vi.fn();

    render(<AddAccountForm onAdd={onAdd} availableTags={[]} />);

    const secretInput = screen.getByPlaceholderText("Paste a secret key");
    fireEvent.focus(secretInput);
    fireEvent.paste(secretInput, {
      clipboardData: {
        getData: () =>
          "leekimsa69@outlook.com CDGH7YO6SDJGD35PJOJL5H7NAPCX4PPE",
      },
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("leekimsa69@outlook.com")).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue("CDGH7YO6SDJGD35PJOJL5H7NAPCX4PPE")).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("Pasted and filled account details");
  });

  it("preserves manual fallback when the pasted text does not contain a valid secret", async () => {
    const onAdd = vi.fn();

    render(<AddAccountForm onAdd={onAdd} availableTags={[]} />);

    const secretInput = screen.getByPlaceholderText("Paste a secret key");
    fireEvent.focus(secretInput);
    fireEvent.paste(secretInput, {
      clipboardData: {
        getData: () => "Team KR 17/03",
      },
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("Team KR 17/03")).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText("Account or service name")).toHaveValue("");
    expect(toast.success).toHaveBeenCalledWith("Pasted from clipboard");
  });
});
