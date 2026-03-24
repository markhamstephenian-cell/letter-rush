import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ianmarkham.sixinsixty",
  appName: "SixInSixty",
  webDir: "out",
  plugins: {
    StatusBar: {
      style: "DARK",
      backgroundColor: "#1a1f2e",
    },
  },
};

export default config;
