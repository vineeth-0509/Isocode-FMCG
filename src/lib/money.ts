

export function assertPaise(value: number, label = "amount"): void {
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`${label} must be an integer number of paise`);
  }
}


export function applyBp(amountPaise: number, bp: number): number {
  assertPaise(amountPaise, "amountPaise");
  assertPaise(bp, "bp");
  if (amountPaise < 0 || bp < 0 || bp > 10000) {
    throw new RangeError("amountPaise must be >= 0 and bp must be 0..10000");
  }
  return Math.floor((amountPaise * bp + 5000) / 10000);
}


export function formatINR(paise: number): string {
  assertPaise(paise);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(paise / 100);
}


export function rupees(paise: number): string {
  assertPaise(paise);
  const sign = paise < 0 ? "-" : "";
  const abs = Math.abs(paise);
  return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}
