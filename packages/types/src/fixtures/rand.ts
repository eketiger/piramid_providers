export function seededRandom(i: number): number {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function pick<T>(arr: readonly T[], i: number): T {
  return arr[Math.floor(seededRandom(i) * arr.length) % arr.length];
}
