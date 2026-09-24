export type ClassValue = string | false | null | undefined | 0

/**
 * Joins truthy class names. Deliberately tiny, with no tailwind-merge: when overriding a
 * utility, make sure the component doesn't already set a conflicting one.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
