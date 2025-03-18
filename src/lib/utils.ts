/**
 * Function to determine if text should be black or white based on background color
 * @param hexColor - The hex color to determine the contrast for
 * @returns
 */
export function getContrastColor(hexColor: string | null): string {
  // Default to black if no color is provided
  if (!hexColor) return "#000000";

  // Remove the hash if it exists
  const hex = hexColor.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance - using the formula for relative luminance in the sRGB color space
  // See: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light colors and white for dark colors
  return luminance > 0.5 ? "#000000" : "#ffffff";
}
