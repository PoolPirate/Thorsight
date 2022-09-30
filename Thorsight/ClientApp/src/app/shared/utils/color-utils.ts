export class ColorUtils {
  public static getAssetColor(asset: string) {
    switch (asset) {
      case "THOR.RUNE":
        return "#12DEDA";
    }

    if (asset.startsWith("BTC.")) {
      return "#dda356";
    }
    if (asset.startsWith("ETH.")) {
      return "#9382e1";
    }
    if (asset.startsWith("BNB.")) {
      return "#bdb357";
    }
    if (asset.startsWith("LTC.")) {
      return "#5F93CE"
    }
    if (asset.startsWith("BCH.")) {
      return "#8FC473";
    }
    if (asset.startsWith("DOGE.")) {
      return "#C6A555";
    }
    if (asset.startsWith("GAIA.")) {
      return "#2e3148";
    }

    return "#FFFD5A";
  }

  public static getEarningsCategoryColor(category: "blockrewards" | "liquidityfees") {
    switch (category) {
      case "blockrewards":
        return "red";
      case "liquidityfees":
        return "green";
    }
  }

  public static getSwapVolumeCategoryColor(category: "actual" | "offset") {
    switch (category) {
      case "actual":
        return "blue";
      case "offset":
        return "yellow";
    }
  }
}
