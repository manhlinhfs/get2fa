import { useMemo, useState } from "react";

export interface TwoFactorAccount {
  id: string;
  secret: string;
  issuer: string;
  label: string;
  tags: string[];
}

const STORAGE_KEY = "2fa_accounts_v2";

function loadStoredAccounts(): TwoFactorAccount[] {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as TwoFactorAccount[];
  } catch (error) {
    console.error("Failed to parse 2FA accounts", error);
    return [];
  }
}

function extractAvailableTags(accounts: TwoFactorAccount[]) {
  const tags = new Set<string>();

  accounts.forEach((account) => account.tags?.forEach((tag) => tags.add(tag)));

  return Array.from(tags);
}

export function use2FA() {
  const [accounts, setAccounts] = useState<TwoFactorAccount[]>(() => loadStoredAccounts());
  const availableTags = useMemo(() => extractAvailableTags(accounts), [accounts]);

  // 2. Helper to save
  const persist = (newAccounts: TwoFactorAccount[]) => {
    // Clean up data before saving (remove any dynamic props if they exist)
    const dataToSave = newAccounts.map(({ id, secret, issuer, label, tags }) => ({
      id,
      secret,
      issuer,
      label,
      tags: tags || [],
    }));
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    setAccounts(dataToSave);
  };

  const addAccount = (account: Omit<TwoFactorAccount, "id">) => {
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
      .filter(a => a.secret && a.label)
      .map(a => ({
        id: crypto.randomUUID(),
        secret: a.secret || "",
        issuer: a.issuer || "Imported",
        label: a.label || "Imported Account",
        tags: a.tags || [],
      })) as TwoFactorAccount[];

    const existingSecrets = new Set(accounts.map(a => a.secret));
    const uniqueNewAccounts = validAccounts.filter(a => !existingSecrets.has(a.secret));

    if (uniqueNewAccounts.length > 0) {
        const merged = [...accounts, ...uniqueNewAccounts];
        persist(merged);
        return uniqueNewAccounts.length;
    }
    return 0;
  };

  const reorderAccounts = (newOrder: TwoFactorAccount[]) => {
    // Optimistic update
    setAccounts(newOrder);
    // Debounce save if needed, but for now direct persist is fine as long as we don't re-render parent too much
    persist(newOrder);
  };

  return {
    accounts,
    availableTags,
    addAccount,
    removeAccount,
    updateAccount,
    importAccounts,
    reorderAccounts,
  };
}
