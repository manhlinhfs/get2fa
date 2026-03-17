import { describe, expect, it } from "vitest";

import { parsePastedAccountData } from "@/lib/pasted-account-parser";

describe("parsePastedAccountData", () => {
  it("extracts an account label and secret from pipe-delimited input with extra segments", () => {
    const result = parsePastedAccountData(
      "leekimsa69@outlook.com|51SUkzbLPpBx|CDGH7YO6SDJGD35PJOJL5H7NAPCX4PPE|Team|17/03|KR",
    );

    expect(result).toMatchObject({
      kind: "account-and-secret",
      label: "leekimsa69@outlook.com",
      secret: "CDGH7YO6SDJGD35PJOJL5H7NAPCX4PPE",
    });
    expect(result.ignoredSegments).toEqual(["51SUkzbLPpBx", "Team", "17/03", "KR"]);
  });

  it("extracts an account label and secret from a two-part pipe-delimited payload", () => {
    const result = parsePastedAccountData("leekimsa69@outlook.com|CDGH7YO6SDJGD35PJOJL5H7NAPCX4PPE");

    expect(result).toMatchObject({
      kind: "account-and-secret",
      label: "leekimsa69@outlook.com",
      secret: "CDGH7YO6SDJGD35PJOJL5H7NAPCX4PPE",
    });
    expect(result.ignoredSegments).toEqual([]);
  });

  it("extracts an account label and secret from a space-delimited payload", () => {
    const result = parsePastedAccountData("leekimsa69@outlook.com CDGH7YO6SDJGD35PJOJL5H7NAPCX4PPE");

    expect(result).toMatchObject({
      kind: "account-and-secret",
      label: "leekimsa69@outlook.com",
      secret: "CDGH7YO6SDJGD35PJOJL5H7NAPCX4PPE",
    });
  });

  it("treats a base32 secret as a secret-only paste", () => {
    const result = parsePastedAccountData("JBSWY3DPEHPK3PXP");

    expect(result).toMatchObject({
      kind: "secret-only",
      secret: "JBSWY3DPEHPK3PXP",
    });
  });

  it("falls back when it cannot find a trustworthy secret", () => {
    const result = parsePastedAccountData("Team KR 17/03");

    expect(result).toMatchObject({
      kind: "none",
    });
  });
});
