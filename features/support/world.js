import Promise from "bluebird";
import config from "./config";
import {party_db, e_commerce_db} from "./database";
import ApolloClient, {createNetworkInterface} from 'apollo-client';

var {defineSupportCode} = require('cucumber');

console.log("world");

function CustomWorld() {
  console.log("Customer World");
  this.config = config;
  this.party_db = party_db;
  this.e_commerce_db = e_commerce_db;

  this.client = new ApolloClient({
    networkInterface: createNetworkInterface({uri: config.server.url})
  });

  this.result = {
    error: {},
    data: {}
  };
}

defineSupportCode(function({setWorldConstructor}) {
  setWorldConstructor(CustomWorld)
});
