import Address from "./address";
import ChangeAddressSuccess from "./change_address_success";
import City from "./city";
import CreateAddressSuccess from "./create_address_success";
import DeleteAddressSuccess from "./delete_address_success";
import GeographicBoundary from "./geographic_boundary";
import InputAddress from "./input_address";
import MutationError from "./mutation_error";
import ResultType from "./result_type";
import State from "./state";
import unions from "./unions";
import ZipCode from "./zip_code";

const Query = `
  type Query {
    addresses: [Address!]!
  }
`;

const SchemaDefinition = `
  schema {
    query: Query
  }
`;

export default [
	SchemaDefinition,
	Query,
	Address,
	ChangeAddressSuccess,
	City,
	CreateAddressSuccess,
	DeleteAddressSuccess,
	GeographicBoundary,
	InputAddress,
	MutationError,
	ResultType,
	State,
	unions,
	ZipCode
];