import loadable from "@loadable/component";

import { RouteConfigProperties } from "@/routes/RouteConfig";

const component = loadable(() =>
  import(/* webpackChunkName: "views" */ "./Topic")
);

const Topic: typeof component & RouteConfigProperties = component;

Topic.serverFetch = function () {
  return Promise.resolve();
};

export default Topic;
