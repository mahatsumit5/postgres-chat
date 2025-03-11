import {
  AugmentedRequest,
  CacheOptions,
  RequestOptions,
  RESTDataSource,
} from "@apollo/datasource-rest";
import { FetcherResponse } from "@apollo/utils.fetcher";
import { KeyValueCache } from "@apollo/utils.keyvaluecache";
import { GraphQLError } from "graphql";

export class BaseAPI extends RESTDataSource {
  private token: string;
  constructor(options: { cache: KeyValueCache }, token?: string) {
    super(options); // this sends our server's `cache` through
    this.token = token || "";
  }

  override willSendRequest(_path: string, request: AugmentedRequest) {
    request.headers["authorization"] = `Bearer ${this.token}`;
  }

  protected didEncounterError(_error: Error): void {
    console.error("base api", _error);
  }
  // Catching errors globally for all the requests and responses
  protected handleError(error: any) {
    console.log("error", error);
    // You can log the error or send it to a monitoring service like Sentry, etc.
    // console.error("Error occurred:", error);

    // Throw a custom error or rethrow the caught error with more context
    //   throw new Error(error.message || "An unexpected error occurred.");
    return {
      status: false,
      message: error.extensions.response.body || "unexpected error occured",
    };
  }
}
