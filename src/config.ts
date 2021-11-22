import { MiraiApiHttpSetting, MiraiOptions } from ".";

export const defaultMahSetting: MiraiApiHttpSetting = {
  adapters: ["http", "ws"],
  enableVerify: true,
  verifyKey: "el-psy-congroo",
  debug: true,
  singleMode: false,
  cacheSize: 4096,
  adapterSettings: {
    http: {
      host: "localhost",
      port: 4859,
    },
    ws: {
      host: "localhost",
      port: 4859,
    },
  },
};

export const defaultMiraiOptions: MiraiOptions = {
  ws: {
    heartbeatInterval: 60000,
  },
};
