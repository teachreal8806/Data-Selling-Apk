export function formatTimeAmPm(date: Date = new Date()): string {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const strHours = hours.toString().padStart(2, '0');
  return `${strHours}:${minutes}:${seconds} ${ampm}`;
}

export function formatDateTime(date: Date = new Date()): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const timeStr = formatTimeAmPm(date);
  return `${day}/${month}/${year}, ${timeStr}`;
}

export function generateOrderNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'DH';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function calculateTier(mb: number): 'BRONZE' | 'SILVER' | 'GOLD' {
  if (mb >= 5000) return 'GOLD';
  if (mb >= 1000) return 'SILVER';
  return 'BRONZE';
}
