export function getRegionColor(sampleResult: string): [number, number, number, number] {
    switch (sampleResult) {
      case "N":
        return [254, 110, 115, 200];
          case "C":
        return [103, 163, 83, 200];
      default:
        return [0, 0, 0, 0];
    }
  }
