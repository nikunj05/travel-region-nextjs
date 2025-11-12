export const buildHotelSlug = (
  name: string | null | undefined,
  code: string | number | null | undefined
): string => {
  if (code === null || code === undefined) {
    return "";
  }

  const codeString = code.toString();
  if (!name || !name.trim()) {
    return codeString;
  }

  const normalizedName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalizedName ? `${normalizedName}-${codeString}` : codeString;
};

