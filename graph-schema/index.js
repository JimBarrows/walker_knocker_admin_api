import {
  buildSchema
} from 'graphql';

import moment from "moment";

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
    addresses: [Address]
  }

`);

var root = {
  addresses: (args, context, graphql) => context.party_db.any("select id, end_point as street_address, directions from contact_mechanism where contact_mechanism_type_id = $1",context.contact_mechanism_types.get('Postal Address'))
};
export {
  schema,
  root
};
