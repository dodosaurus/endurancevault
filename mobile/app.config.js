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
      stravaClientId: "112442",
      apiBaseUrl: "http://192.168.0.109:3000",
      eas: {
        projectId: "26bd3ea3-202a-4cd7-8d32-5e2339328414"
      }
    }
  }
};