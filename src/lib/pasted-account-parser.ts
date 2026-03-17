const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const USERNAME_PATTERN = /^(?=.{3,64}$)[A-Za-z0-9._@+-]+$/;
const BASE32_PATTERN = /^[A-Z2-7]+$/;

export type ParsedPastedAccountData =
  | {
      kind: "none";
      confidence: "none";
      raw: string;
      segments: string[];
      ignoredSegments: string[];
      label?: undefined;
      secret?: undefined;
    }
  | {
      kind: "secret-only";
      confidence: "medium";
      raw: string;
      segments: string[];
      ignoredSegments: string[];
      label?: undefined;
      secret: string;
    }
  | {
      kind: "account-and-secret";
      confidence: "high";
      raw: string;
      segments: string[];
      ignoredSegments: string[];
      label: string;
      secret: string;
    };

function normalizeSecret(segment: string) {
  return segment.replace(/[\s-]/g, "").toUpperCase();
}

function splitSegments(raw: string) {
  const line = raw
    .split(/\r?\n/)
    .map((segment) => segment.trim())
    .find(Boolean);

  if (!line) {
    return [];
  }

  if (line.includes("|")) {
    return line.split("|").map((segment) => segment.trim()).filter(Boolean);
  }

  if (line.includes("\t")) {
    return line.split(/\t+/).map((segment) => segment.trim()).filter(Boolean);
  }

  return line.split(/\s+/).map((segment) => segment.trim()).filter(Boolean);
}

function getSecretScore(segment: string) {
  const normalized = normalizeSecret(segment);
  if (normalized.length < 16 || !BASE32_PATTERN.test(normalized)) {
    return null;
  }

  const hasTotpDigit = /[2-7]/.test(normalized);
  if (!hasTotpDigit && normalized.length < 24) {
    return null;
  }

  return normalized.length + (hasTotpDigit ? 10 : 0);
}

function getLabelScore(segment: string, selectedSecret?: string) {
  if (!segment) {
    return null;
  }

  if (selectedSecret && normalizeSecret(segment) === selectedSecret) {
    return null;
  }

  if (EMAIL_PATTERN.test(segment)) {
    return 100;
  }

  if (USERNAME_PATTERN.test(segment) && /[A-Za-z]/.test(segment)) {
    return 50;
  }

  return null;
}

export function parsePastedAccountData(raw: string): ParsedPastedAccountData {
  const trimmed = raw.trim();
  const segments = splitSegments(trimmed);

  if (!trimmed || segments.length === 0) {
    return {
      kind: "none",
      confidence: "none",
      raw: trimmed,
      segments,
      ignoredSegments: [],
    };
  }

  let secret: string | undefined;
  let secretSegment: string | undefined;
  let bestSecretScore = -1;

  for (const segment of segments) {
    const score = getSecretScore(segment);
    if (score !== null && score > bestSecretScore) {
      bestSecretScore = score;
      secret = normalizeSecret(segment);
      secretSegment = segment;
    }
  }

  if (!secret) {
    return {
      kind: "none",
      confidence: "none",
      raw: trimmed,
      segments,
      ignoredSegments: [...segments],
    };
  }

  let label: string | undefined;
  let labelSegment: string | undefined;
  let bestLabelScore = -1;

  for (const segment of segments) {
    const score = getLabelScore(segment, secret);
    if (score !== null && score > bestLabelScore) {
      bestLabelScore = score;
      label = segment;
      labelSegment = segment;
    }
  }

  const ignoredSegments = segments.filter(
    (segment) => segment !== secretSegment && segment !== labelSegment,
  );

  if (label) {
    return {
      kind: "account-and-secret",
      confidence: "high",
      raw: trimmed,
      segments,
      ignoredSegments,
      label,
      secret,
    };
  }

  return {
    kind: "secret-only",
    confidence: "medium",
    raw: trimmed,
    segments,
    ignoredSegments,
    secret,
  };
}
