export const RESTAURANT_OPENING_TIME = 18;
export const RESTAURANT_CLOSING_TIME = 23;
export const INTERVAL = 20;

export function buildTimeSlots(dateStr: string, bookedTimes: string[]) {
  if (!dateStr) return [] as string[];
  const start = new Date(`${dateStr}T${String(RESTAURANT_OPENING_TIME).padStart(2, "0")}:00:00`);
  const end = new Date(`${dateStr}T${String(RESTAURANT_CLOSING_TIME).padStart(2, "0")}:00:00`);
  const taken = new Set(bookedTimes.map(t => t.slice(0, 5)));

  const out: string[] = [];
  for (let t = new Date(start); t < end; t = new Date(t.getTime() + INTERVAL * 60 * 1000)) {
    const hh = String(t.getHours()).padStart(2, "0");
    const mm = String(t.getMinutes()).padStart(2, "0");
    const val = `${hh}:${mm}`;
    if (!taken.has(val)) out.push(val);
  }
  return out;
};
export function isValidSlot(value: string) {
  if (!/^\d{2}:\d{2}$/.test(value)) return false;
  const [h, m] = value.split(":").map(Number);
  const total = h * 60 + m;
  const open = RESTAURANT_OPENING_TIME * 60;
  const close = RESTAURANT_CLOSING_TIME * 60;
  return total >= open && total < close && ((total - open) % INTERVAL === 0);
}
