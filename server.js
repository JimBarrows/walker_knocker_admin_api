import Promise from 'bluebird';
import express from 'express';
import jwt from "jsonwebtoken";
import graphqlHttp from "express-graphql";

import config from "./config";
import {party_db, e_commerce_db} from "./database";
import {
    schema,
    root
} from "./graph-schema";

const app = express();

let contact_mechansim_query = party_db.any("select id, description from contact_mechanism_type");
let united_states_query = party_db.one("select id, name, abbreviation from Geographic_Boundary where name='United States'");

Promise.all([contact_mechansim_query,united_states_query] ).spread( function(contact_mechanism_result, united_states_result) {
  let contact_mechanism_types = new Map();
  contact_mechanism_result.forEach( l => contact_mechanism_types.set (l.description, l.id));
  app.use('/', graphqlHttp((req) => ({
    schema: schema,
    rootValue: root,
    graphiql: config.graphql.graphiql,
    context:{
      req,
      party_db,
      e_commerce_db,
      contact_mechanism_types,
      united_states: united_states_result
    }
  })));
  app.listen(config.server.port, () => console.log('%s listening at %s', config.server.name, config.server.url));
});
