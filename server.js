import express from 'express';
import bodyParser from 'body-parser';
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express';
import {makeExecutableSchema} from 'graphql-tools';
import Promise from "bluebird";

import config from "./config";
import {party_db, e_commerce_db} from "./database";

import typeDefs from "./type_defs";
import resolvers from "./resolvers";


const schema = makeExecutableSchema({typeDefs, resolvers});

const app = express();

let contact_mechansim_query = party_db.any("select id, description from contact_mechanism_type");
let united_states_query     = party_db.one("select id, name, abbreviation from Geographic_Boundary where name='United States'");

Promise.all([contact_mechansim_query, united_states_query]).spread(function (contact_mechanism_result, united_states_result) {
	app.use(bodyParser.json());
	let contact_mechanism_types = new Map();
	contact_mechanism_result.forEach(l => contact_mechanism_types.set(l.description, l.id));
	app.use('/graphql', graphqlExpress({
		schema,
		context: {
			party_db,
			e_commerce_db,
			contact_mechanism_types,
			united_states: united_states_result
		}
	}));

	if (config.graphql.graphiql) {
		app.use("/graphiql", graphiqlExpress({endpointURL: config.graphql.endpointURL}));
	}

	app.listen(config.server.port, () => console.log('%s listening at %s', config.server.name, config.server.url));
});
