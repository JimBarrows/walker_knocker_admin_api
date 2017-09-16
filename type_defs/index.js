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
}
`;

const Mutation = `
type Mutation {
	create_address( new_address: InputAddress!) : Address!
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
	// MutationError,
	ResultType,
	State,
	// unions,
	ZipCode
];