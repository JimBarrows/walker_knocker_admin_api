// resolvers/index.js

import address_create from "./address_create";
import address_delete from "./address_delete";
import address_update from "./address_update";
import addresses from "./addresses";
import cities from "./cities";
import city from "./city";
import state from "./state";
import states from "./states";
import zip_code from "./zip_code";
import zip_codes from "./zip_codes";

export default {
	Mutation: {
		address_create,
		address_delete,
		address_update
	},
	Query   : {
		addresses,
		cities,
		states,
		zip_codes
	},
	Address : {
		city,
		state,
		zip_code
	}
};

