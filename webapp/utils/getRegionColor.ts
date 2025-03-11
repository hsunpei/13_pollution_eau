export function getRegionColor(
  sampleResult: string,
  isHovered: boolean,
): [number, number, number, number] {
  switch (sampleResult) {
    case "N":
      return isHovered ? [254, 110, 115, 230] : [254, 110, 115, 150];
    case "C":
      return isHovered ? [103, 163, 83, 230] : [103, 163, 83, 150];
    default:
      return [0, 0, 0, 0];
  }
}
