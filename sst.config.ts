import { SSTConfig } from "sst";
import { API } from "./stacks/Api";

export default {
  config(_input) {
    return {
      name: "lksh-fun",
      region: "us-east-2",
    };
  },
  stacks(app) {
    app.stack(API);
  },
} satisfies SSTConfig;
