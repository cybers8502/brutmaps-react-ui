interface InitialsSource {
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  title?: string | null;
}

export function getInitials({firstName, lastName, fullName, title}: InitialsSource): string {
  const first = firstName?.trim().charAt(0) ?? '';
  const last = lastName?.trim().charAt(0) ?? '';

  if (first || last) {
    return (first + last).toUpperCase();
  }

  const words = (fullName || title || '').trim().split(/\s+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
}
