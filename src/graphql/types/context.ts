import { UserAPI } from "../datasource/user.api";

export type DataSourceContext = {
  dataSources: {
    userAPI: UserAPI;
  };
};
