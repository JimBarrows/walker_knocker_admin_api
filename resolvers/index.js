// resolvers/index.js

import addresses from "./addresses";
import create_address from "./create_address";
import city from "./city";
import state from "./state";
import zip_code from "./zip_code";

export default {
	Mutation: {
		create_address
	},
	Query   : {
		addresses
	},
	Address : {
		city,
		state,
		zip_code
	}
};

