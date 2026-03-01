export const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

export const scoreMatch = (label: string, target: string) => {
  if (!label || !target) return 0;
  const normalizedLabel = normalizeText(label);
  const normalizedTarget = normalizeText(target);
  if (!normalizedLabel || !normalizedTarget) return 0;
  if (normalizedLabel === normalizedTarget) return 100;

  let score = 0;
  if (normalizedLabel.includes(normalizedTarget)) score += 40;
  if (normalizedTarget.includes(normalizedLabel)) score += 30;

  const labelTokens = new Set(normalizedLabel.split(" "));
  const targetTokens = new Set(normalizedTarget.split(" "));
  let overlap = 0;
  targetTokens.forEach((token) => {
    if (labelTokens.has(token)) overlap += 1;
  });
  score += overlap * 8;

  return score;
};

export const findBestMatchIndex = <T>(
  target: string,
  items: T[],
  getLabel: (item: T) => string
) => {
  let bestIndex = -1;
  let bestScore = 0;

  items.forEach((item, index) => {
    const score = scoreMatch(getLabel(item), target);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  return bestIndex;
};
