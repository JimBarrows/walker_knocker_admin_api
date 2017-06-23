import {
  buildSchema
} from 'graphql';

import {addresses} from './resolvers';

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
    country: GeographicBoundary!
  }

  type Query {
    addresses: [Address]
  }

`);

var root = {
  addresses
};
export {
  schema,
  root
};
