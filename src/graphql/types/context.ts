import { FriendRequestAPI } from "../datasource/friendRequest.api";
import { UserAPI } from "../datasource/user.api";

export type DataSourceContext = {
  dataSources: {
    userAPI: UserAPI;
    friendReqAPI: FriendRequestAPI;
  };
};
