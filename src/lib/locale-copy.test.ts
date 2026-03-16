import { describe, expect, it } from "vitest";
import de from "../../public/locales/de/translation.json";
import en from "../../public/locales/en/translation.json";
import es from "../../public/locales/es/translation.json";
import fr from "../../public/locales/fr/translation.json";
import ja from "../../public/locales/ja/translation.json";
import vi from "../../public/locales/vi/translation.json";
import zh from "../../public/locales/zh/translation.json";

type LocaleShape = {
  app: {
    ready: string;
    enter_key: string;
  };
  help_dialog: {
    rec_desc: string;
  };
  workspace?: {
    create?: string;
    rename?: string;
    delete?: string;
  };
};

const locales: Record<string, LocaleShape> = { de, en, es, fr, ja, vi, zh };

describe("locale copy", () => {
  it("defines workspace labels in every shipped locale", () => {
    for (const locale of ["de", "en", "es", "fr", "ja", "vi", "zh"]) {
      const messages = locales[locale];

      expect(messages.workspace?.create).toBeTruthy();
      expect(messages.workspace?.rename).toBeTruthy();
      expect(messages.workspace?.delete).toBeTruthy();
    }
  });

  it("does not leave icon interpolation placeholders inside help copy", () => {
    for (const locale of ["de", "en", "es", "fr", "ja", "vi", "zh"]) {
      const messages = locales[locale];

      expect(messages.help_dialog.rec_desc).not.toContain("{{icon}}");
    }
  });

  it("uses plain onboarding copy in English and Vietnamese", () => {
    expect(en.app.ready).toBe("No accounts yet.");
    expect(en.app.enter_key).toBe("Paste a secret key above to add your first account.");
    expect(vi.app.ready).toBe("Chưa có tài khoản nào.");
    expect(vi.app.enter_key).toBe("Dán khóa bí mật ở trên để thêm tài khoản đầu tiên.");
  });
});
