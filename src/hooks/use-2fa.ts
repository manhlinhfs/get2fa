import { useState, useEffect } from "react";
import * as OTPAuth from "otpauth";

export interface TwoFactorAccount {
  id: string;
  secret: string;
  issuer: string;
  label: string;
  tags: string[]; // Changed from colorTag to string array
  token?: string;
  period?: number;
  remaining?: number;
}

const STORAGE_KEY = "2fa_accounts_v2"; // Bump version for migration

export function use2FA() {
  const [accounts, setAccounts] = useState<TwoFactorAccount[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // 1. Load data
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAccounts(parsed);
        // Extract all unique tags
        const tags = new Set<string>();
        parsed.forEach((acc: TwoFactorAccount) => acc.tags?.forEach(t => tags.add(t)));
        setAvailableTags(Array.from(tags));
      } catch (e) {
        console.error("Failed to parse 2FA accounts", e);
      }
    } else {
        // Migration attempt from v1 (optional, but good for DX)
        const oldStored = localStorage.getItem("2fa_accounts_v1");
        if (oldStored) {
            try {
                const oldData = JSON.parse(oldStored);
                // Map old colorTag to a tag if needed, or just empty
                const migrated = oldData.map((d: any) => ({
                    ...d,
                    tags: d.colorTag && d.colorTag !== 'default' ? [d.colorTag] : []
                }));
                setAccounts(migrated);
                persist(migrated);
            } catch(e) {}
        }
    }
  }, []);

  // 2. Helper to save
  const persist = (newAccounts: TwoFactorAccount[]) => {
    const dataToSave = newAccounts.map(({ id, secret, issuer, label, tags }) => ({
      id,
      secret,
      issuer,
      label,
      tags,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    setAccounts(newAccounts);
    
    // Update available tags
    const tags = new Set<string>();
    newAccounts.forEach(acc => acc.tags?.forEach(t => tags.add(t)));
    setAvailableTags(Array.from(tags));
  };

  // 3. Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setAccounts((prev) => [...prev]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 4. Compute tokens
  const accountsWithTokens = accounts.map((account) => {
    try {
      const totp = new OTPAuth.TOTP({
        issuer: account.issuer,
        label: account.label,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(account.secret),
      });

      const token = totp.generate();
      const period = 30;
      const remaining = period - (Math.floor(Date.now() / 1000) % period);

      return { ...account, token, period, remaining };
    } catch (e) {
      return { ...account, token: "ERROR", period: 30, remaining: 0 };
    }
  });

  const addAccount = (account: Omit<TwoFactorAccount, "id" | "token" | "period" | "remaining">) => {
    const newAccount = {
      ...account,
      id: crypto.randomUUID(),
    };
    const updatedAccounts = [newAccount, ...accounts];
    persist(updatedAccounts);
  };

  const removeAccount = (id: string) => {
    const updatedAccounts = accounts.filter((a) => a.id !== id);
    persist(updatedAccounts);
  };

  const updateAccount = (updatedAccount: TwoFactorAccount) => {
    const updatedAccounts = accounts.map((a) => 
      a.id === updatedAccount.id ? updatedAccount : a
    );
    persist(updatedAccounts);
  };

  const importAccounts = (newAccounts: Partial<TwoFactorAccount>[]) => {
    const validAccounts = newAccounts
      .filter(a => a.secret && a.label) // Basic validation
      .map(a => ({
        id: crypto.randomUUID(),
        secret: a.secret || "",
        issuer: a.issuer || "Imported",
        label: a.label || "Imported Account",
        tags: a.tags || [],
      })) as TwoFactorAccount[];

    // Avoid duplicates based on Secret Key
    const existingSecrets = new Set(accounts.map(a => a.secret));
    const uniqueNewAccounts = validAccounts.filter(a => !existingSecrets.has(a.secret));

    if (uniqueNewAccounts.length > 0) {
        const merged = [...accounts, ...uniqueNewAccounts];
        persist(merged);
        return uniqueNewAccounts.length;
    }
    return 0;
  };

  return {
    accounts: accountsWithTokens,
    availableTags,
    addAccount,
    removeAccount,
    updateAccount,
    importAccounts,
  };
}
