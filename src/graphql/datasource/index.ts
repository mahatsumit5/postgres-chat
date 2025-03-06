import { AugmentedRequest, RESTDataSource } from "@apollo/datasource-rest";
import { KeyValueCache } from "@apollo/utils.keyvaluecache";

export class BaseAPI extends RESTDataSource {
  private token: string;
  constructor(options: { token: string; cache: KeyValueCache }) {
    super(options); // this sends our server's `cache` through
    this.token = options.token;
  }

  override willSendRequest(_path: string, request: AugmentedRequest) {
    request.headers["authorization"] = `Bearer ${this.token}`;
  }
}
