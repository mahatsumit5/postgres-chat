import { FriendRequestAPI } from "../datasource/friendRequest.api";
import { PostAPI } from "../datasource/post.api";
import { UserAPI } from "../datasource/user.api";

export type DataSourceContext = {
  dataSources: {
    userAPI: UserAPI;
    friendReqAPI: FriendRequestAPI;
    postAPI: PostAPI;
  };
};
