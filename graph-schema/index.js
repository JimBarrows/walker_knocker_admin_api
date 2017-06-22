import {
  buildSchema
} from 'graphql';

import moment from "moment";

import database from "../database";

var schema = buildSchema(`

  type GeographicBoundary {
    id: ID!,
    geo_code: String,
    name: String!,
    abbreviation: String,
    geographic_boundary_type_id: String!
  }

  type Address {
    id: ID!
    street_address: String!,
    directions: String,
    city: GeographicBoundary!,
    state: GeographicBoundary!,
    zip_code: GeographicBoundary!,
  }

  type Query {
    address: Address
  }

`);

var root = {};
export {
  schema,
  root
};
