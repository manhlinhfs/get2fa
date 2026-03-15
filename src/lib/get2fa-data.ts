export interface TwoFactorAccount {
  id: string;
  secret: string;
  issuer: string;
  label: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  accounts: TwoFactorAccount[];
}

export interface AppData {
  version: 1;
  currentWorkspaceId: string;
  workspaces: Workspace[];
}

export interface LegacyAccount {
  id?: string;
  secret: string;
  issuer?: string;
  label?: string;
  tags?: string[];
}
