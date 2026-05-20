const RATES_PER_MILLION: Record<string, { input: number; output: number }> = {
  "claude-3-5-haiku-20241022": { input: 0.8, output: 4.0 },
  "claude-sonnet-4-20250514": { input: 3.0, output: 15.0 },
  default: { input: 3.0, output: 15.0 },
};

export function estimateCostUsd(
  model: string,
  inputTokens: number,
  outputTokens: number,
): number {
  const rates = RATES_PER_MILLION[model] ?? RATES_PER_MILLION.default;
  const cost =
    (inputTokens * rates.input + outputTokens * rates.output) / 1_000_000;
  return Math.round(cost * 1_000_000) / 1_000_000;
}
