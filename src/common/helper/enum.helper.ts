// src/common/utils/enum.helper.ts

type EnumMemberType = 'keys' | 'values';

/**
 * A generic and reusable helper function to extract the members of a TypeScript enum.
 * It intelligently handles both numeric and string enums.
 *
 * @param enumObject The enum object itself (e.g., KycStatusEnum).
 * @param memberType Specifies whether to extract 'keys' (string names) or 'values'.
 * @returns An array of the enum's string keys or an array of its numeric/string values.
 */
export function getEnumMembers<T extends object>(
  enumObject: T,
  memberType: EnumMemberType,
): (string | number)[] {
  // For numeric enums, Object.keys() returns both string keys and numeric values as strings.
  // e.g.,
  // We filter out the numeric strings to get only the keys.
  const keys = Object.keys(enumObject).filter(key => isNaN(Number(key)));

  if (memberType === 'keys') {
    return keys;
  }

  // For 'values', we map the filtered keys back to their corresponding enum values.
  // This works correctly for both numeric and string enums.
  return keys.map(key => enumObject[key]);
}