import Promise from "bluebird";
import config from "./config";
import {party_db, e_commerce_db} from "./database";
import ApolloClient, {createNetworkInterface} from 'apollo-client';

var {defineSupportCode} = require('cucumber');

function CustomWorld() {
  this.config = config;
  this.party_db = party_db;
  this.e_commerce_db = e_commerce_db;

  this.client = new ApolloClient({
    networkInterface: createNetworkInterface({uri: config.server.url})
  });

  this.address = {
    street_address: '',
    directions: '',
    city:{},
    state: {},
    zip_code: {},
    country: {}
  };

  this.result = {
    error: {},
    data: {}
  };
}

defineSupportCode(function({setWorldConstructor}) {
  setWorldConstructor(CustomWorld)
});
