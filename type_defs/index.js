// type_defs/index.js

import Address from "./address";
import City from "./city";
import GeographicBoundary from "./geographic_boundary";
import InputAddress from "./input_address";
import ResultType from "./result_type";
import State from "./state";
import ZipCode from "./zip_code";

const Query = `
type Query {
  addresses: [Address!]!
  cities : [City!]!
  cities(name: String): [City!]!
  states : [State!]!
  states(name: String) : [State!]!
  zip_codes : [ZipCode!]! 
  zip_codes(name: String) : [ZipCode!]!
}
`;

const Mutation = `
type Mutation {
	address_create( new_address: InputAddress!) : Address!
	address_delete( id: ID!) : ResultType!
	address_update( modified_address: InputAddress!) : Address!
}
`;

const SchemaDefinition = `
schema {
  query: Query
  mutation: Mutation
}
`;

export default [
	SchemaDefinition,
	Mutation,
	Query,
	Address,
	City,
	GeographicBoundary,
	InputAddress,
	ResultType,
	State,
	ZipCode
];