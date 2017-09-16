// graph-schema/index.js

import {
	buildSchema
} from 'graphql';

import {addresses, change_address, city, cities, create_address, delete_address, state, states, zip_code, zip_codes} from '../resolvers';

const schema = buildSchema(`

  type Mutation{
    create_address( new_address: InputAddress!) : CreateAddressResult!
    change_address( modified_address: InputAddress!) : ChangeAddressResult!
    delete_address( id: ID!) : DeleteAddressResult!
  }

  type Query {
    addresses: [Address]
    cities(name: String!): [GeographicBoundary],
    states(name: String!): [GeographicBoundary],
    zip_codes(name: String!): [GeographicBoundary]
  }

`);

const root = {

		addresses,

	Address: {
		city,
		state,
		zip_code
	},
	change_address,
	cities,
	create_address,
	delete_address,
	states,
	zip_codes
};

export {
	schema,
	root
};
