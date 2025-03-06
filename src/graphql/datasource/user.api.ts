import { RESTDataSource } from "@apollo/datasource-rest";

export class UserAPI extends RESTDataSource {
  baseURL = "http://localhost:8080/ap1/v1/user/";
}
