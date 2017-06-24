// graph-schema/index.js

import {
  buildSchema
} from 'graphql';

import {addresses, change_address, create_address} from './resolvers';

const schema = buildSchema(`

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

  input InputAddress {
    id: String,
    street_address: String!,
    directions: String,
    city_id: String!,
    state_id: String!,
    zip_code_id: String!,
    country_id: String!
  }

  type CreateAddressResult {
    id: String!
  }

  type UpdateAddressResult {
    id: String!
  }

  type Mutation{
    create_address( new_address: InputAddress!) : CreateAddressResult!
    change_address( modified_address: InputAddress!) : UpdateAddressResult!
  }

  type Query {
    addresses: [Address]
  }

`);

const root = {
  addresses,
  change_address,
  create_address
};

export {
  schema,
  root
};
