
export const pad = (n: number) => n.toString().padStart(2, '0');

export const fmtDate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fmtTime = (d: Date) =>
  `${pad(d.getHours())}:${pad(d.getMinutes())}`;

export const parseDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};
