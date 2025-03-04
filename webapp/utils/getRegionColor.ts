export function getRegionColor(sampleResult: string) {
    switch (sampleResult) {
        case "N":
            return "#fe6e73";
        case "C":
            return "#67a353";
        default:
            return "rgba(0, 0, 0, 0)";
    }
}
