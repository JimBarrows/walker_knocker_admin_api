// resolvers/index.js

import addresses from "./addresses";
import city from "./city";
import state from "./state";
import zip_code from "./zip_code";

const resolver_map = {
	Query: {
		addresses
	},
	Address: {
		city,
		state,
		zip_code
	}
}

export default resolver_map;
