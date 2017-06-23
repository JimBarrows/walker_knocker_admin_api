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
    let postal_address_type_query = party_db.one("select id, description from contact_mechanism_type where description like 'Postal Address'");
    let contact_mechanism_type_query = party_db.any("select id, description from contact_mechanism_type");
    party_db.none("delete from contact_mechanism_geographic_boundary")
      .then(() => party_db.none("delete from contact_mechanism"))
      .then(() => Promise.all([
                    city_query,
                    state_query,
                    zip_code_query,
                    country_query,
                    postal_address_type_query,
                    contact_mechanism_type_query
                  ]).spread((city, state, zip_code, country, postal_address, contact_mechanism_types) => {
                    world.city = city;
                    world.state = state;
                    world.zip_code = zip_code;
                    world.country = country;
                    world.postal_address = postal_address;
                    world.contact_mechanism_types = new Map();
                    contact_mechanism_types.forEach( l => world.contact_mechanism_types.set (l.description, l.id));
                    callback();
                  }))
      .catch(error => callback(error));
  });

  After(function() {});
});
