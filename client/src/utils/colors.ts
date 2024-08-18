export function hexToRgb(hex: string, opacity = 1) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r},${g},${b}, ${opacity})`; // return 23,14,45 -> reformat if needed
  }
  return null;
}

// Array of color names
const colorNames = [
  "dark",
  "gray",
  "red",
  "pink",
  "grape",
  "violet",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "green",
  "lime",
  "yellow",
  "orange",
];

// Array of shade numbers
const shades = [4, 5, 6, 7, 8, 9];

// Function to hash a string into a number
function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

// Function to get a deterministic color-shade combination based on name
export function getColorShade(name: string) {
  const hash = hashString(name);

  // Determine the index for the color name and shade
  const colorIndex = Math.abs(hash) % colorNames.length;
  const shadeIndex = Math.abs(hash) % shades.length;

  return `${colorNames[colorIndex]}.${shades[shadeIndex]}`;
}

export default {
  getColorShade,
};
