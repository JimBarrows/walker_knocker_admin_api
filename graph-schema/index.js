import {
  buildSchema
} from 'graphql';

import moment from "moment";

import database from "../database";

var schema = buildSchema(`
  type Query {
  me: User
}

type User {
  id: ID
  name: String
}
`);

var root = {};
export {
  schema,
  root
};
