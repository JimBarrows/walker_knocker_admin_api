import Promise from "bluebird";

var {defineSupportCode} = require('cucumber');

defineSupportCode(function({Before, After}) {

  Before(function(result, callback) {
    let world = this;
    let party_db = this.party_db;
    let city_query = party_db.any("select geographic_boundary.id, geo_code, name, abbreviation, geographic_boundary_type_id from geographic_boundary, geographic_boundary_type where geographic_boundary_type_id = geographic_boundary_type.id and geographic_boundary_type.description like 'City'");
    let state_query = party_db.any("select geographic_boundary.id, geo_code, name, abbreviation, geographic_boundary_type_id from geographic_boundary , geographic_boundary_type where geographic_boundary_type_id = geographic_boundary_type.id and geographic_boundary_type.description like 'State'");
    let zip_code_query = party_db.any("select geographic_boundary.id, geo_code, name, abbreviation, geographic_boundary_type_id from geographic_boundary, geographic_boundary_type where geographic_boundary_type_id = geographic_boundary_type.id and geographic_boundary_type.description like 'Postal Code'");
    let country_query = party_db.any("select geographic_boundary.id, geo_code, name, abbreviation, geographic_boundary_type_id from geographic_boundary, geographic_boundary_type where geographic_boundary_type_id = geographic_boundary_type.id and geographic_boundary_type.description like 'Country'");
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
                  ]).spread((cities, states, zip_codes, countries, postal_address, contact_mechanism_types) => {
                    world.cities = new Map();
                    world.states = new Map();
                    world.zip_codes = new Map();
                    world.countries = new Map();
                    world.postal_address = postal_address;
                    world.contact_mechanism_types = new Map();
                    cities.forEach( l => world.cities.set (l.name, l.id));
                    states.forEach( l => world.states.set (l.name, l.id));
                    zip_codes.forEach( l => world.zip_codes.set (l.name, l.id));
                    countries.forEach( l => world.countries.set (l.name, l.id));
                    contact_mechanism_types.forEach( l => world.contact_mechanism_types.set (l.description, l.id));
                    callback();
                  }))
      .catch(error => callback(error));
  });

  After(function() {});
});
