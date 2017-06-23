import Promise from "bluebird";

var {defineSupportCode} = require('cucumber');

defineSupportCode(function({Before, After}) {

  Before(function(result, callback) {
    let world = this;
    let party_db = this.party_db;
    let city_query = party_db.one("select id, geo_code, name, abbreviation, geographic_boundary_type_id from geographic_boundary where name like 'Phoenix'");
    let state_query = party_db.one("select id, geo_code, name, abbreviation, geographic_boundary_type_id from geographic_boundary where name like 'Arizona'");
    let zip_code_query = party_db.one("select id, geo_code, name, abbreviation, geographic_boundary_type_id from geographic_boundary where name like '85037'");
    let country_query = party_db.one("select id, geo_code, name, abbreviation, geographic_boundary_type_id from geographic_boundary where name like 'United States'");
    let postal_address_type = party_db.one("select id, description from contact_mechanism_type where description like 'Postal Address'");
    let clean_contact_mechanism_geographic_boundary = party_db.none("delete from contact_mechanism_geographic_boundary");
    let clean_contact_mechanism = party_db.none("delete from contact_mechanism");
    Promise.all([city_query, state_query, zip_code_query, country_query, postal_address_type, clean_contact_mechanism, clean_contact_mechanism_geographic_boundary]).spread((city, state, zip_code, country, postal_address) => {
      world.city = city;
      world.state = state;
      world.zip_code = zip_code;
      world.country = country;
      world.postal_address = postal_address;
      callback();
    }).catch(error => callback(error));
  });

  After(function() {});
});
