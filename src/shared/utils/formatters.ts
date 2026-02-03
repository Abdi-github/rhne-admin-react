import dayjs from 'dayjs';

export function formatDate(date: string | Date, format = 'DD.MM.YYYY'): string {
  return dayjs(date).format(format);
}

export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('DD.MM.YYYY HH:mm');
}

export function formatRelativeDate(date: string | Date): string {
  const d = dayjs(date);
  const now = dayjs();
  const diffDays = now.diff(d, 'day');

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return d.format('DD.MM.YYYY');
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '…';
}

export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

export function nullifyEmptyTranslatedField(
  field: { fr: string; en: string; de: string; it: string } | null | undefined,
): { fr: string; en: string; de: string; it: string } | null {
  if (!field) return null;
  if (!field.fr && !field.en && !field.de && !field.it) return null;
  return field;
}
