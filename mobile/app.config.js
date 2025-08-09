export default {
  expo: {
    name: "Endurance Vault",
    slug: "endurance-vault",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.endurancevault.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.endurancevault.app"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    scheme: "endurancevault",
    extra: {
      stravaClientId: process.env.STRAVA_CLIENT_ID,
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3000"
    }
  }
};