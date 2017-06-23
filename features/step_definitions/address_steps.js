// features/step_definitions/address_steps.js

var {defineSupportCode} = require('cucumber');
import gql from 'graphql-tag';
import 'isomorphic-fetch';
import Promise from "bluebird";

defineSupportCode(function({Given, When, Then}) {

  Given('there are {int} street addresses in the database', function(no_of_addresses) {
    this.number_of_street_addresses = no_of_addresses;
    let party_db = this.party_db;
    let promises = [];
    for (let i = 0; i < no_of_addresses; i++) {
      promises.push(party_db.one("insert into contact_mechanism (end_point, directions, contact_mechanism_type_id) values ($1, $2, $3) returning id", [
        "end_point " + i,
        "directions " + i,
        this.postal_address.id
      ]).then(address => {
        let city = this.party_db.none("insert into contact_mechanism_geographic_boundary (contact_mechanism_id, geographic_boundary_id) values ($1, $2)", [address.id, this.city.id]);
        let state = this.party_db.none("insert into contact_mechanism_geographic_boundary (contact_mechanism_id, geographic_boundary_id) values ($1, $2)", [address.id, this.state.id]);
        let zip = this.party_db.none("insert into contact_mechanism_geographic_boundary (contact_mechanism_id, geographic_boundary_id) values ($1, $2)", [address.id, this.zip_code.id]);
        let country = this.party_db.none("insert into contact_mechanism_geographic_boundary (contact_mechanism_id, geographic_boundary_id) values ($1, $2)", [address.id, this.country.id]);
        return Promise.all([city, state, zip, country]);
      }));
    }
    return Promise.all(promises);
  });

  Given('an address of {stringInDoubleQuotes}', function(street_address, callback) {
    this.address.street_address = street_address;
    callback();
  });

  Given('a city of {stringInDoubleQuotes}', function(city, callback) {
    this.address.city = this.city.id;
    callback();
  });

  Given('a state of {stringInDoubleQuotes}', function(state, callback) {
    this.address.state = this.state.id;
    callback();
  });

  Given('a zip code of {stringInDoubleQuotes}', function(zip_code, callback) {
    this.address.zip_code = this.zip_code.id;
    callback();
  });

  Given('a country of {stringInDoubleQuotes}', function(country, callback) {
    this.address.country = this.country.id;
    callback();
  });

  When('I save the address', function() {
    return this.client.mutate({
      mutation: gql `mutation create_address($newAddress: NewAddress!) {
                      create_address(new_address: $newAddress) {
                        id
                      }
                    }`,
      variables: {
        "newAddress": {
          "street_address": this.address.street_address,
          "directions": this.address.directions,
          "city_id": this.address.city,
          "state_id": this.address.state,
          "zip_code_id": this.address.zip_code,
          "country_id": this.address.country
        }
      }
    });
  });

  When('I retrieve a list of addressess', function() {
    let client = this.client;
    return client.query({query: gql `{addresses {
        id street_address directions city {
          id
          name
          abbreviation
        }
        state {
          id
          name
          abbreviation
        }
        zip_code {
          id
          name
          abbreviation
        }
        country {
          id
          name
          abbreviation
        }
      }}
    `}).then(results => this.result.data = results);
  });

  Then('there must be {int} street addresses in the response', function(int, callback) {
    expect(this.result.error).to.be.empty;
    expect(this.result.data).to.be.ok;
    expect(this.result.data.data.addresses.length).to.be.equal(this.number_of_street_addresses);
    callback();
  });

  Then('the {int} street addresses must be correct', function(int, callback) {
    let addresses = this.result.data.data.addresses;
    let count = 0;
    addresses.forEach(address => {
      expect(address.id).to.be.ok;
      expect(address.street_address).to.be.equal("end_point " + count);
      expect(address.directions).to.be.equal("directions " + count);
      expect(address.city.id).to.be.ok;
      expect(address.city.name).to.be.equal("Phoenix");
      expect(address.city.abbreviation).to.be.equal('PHX');
      expect(address.state.id).to.be.ok;
      expect(address.state.name).to.be.equal("Arizona");
      expect(address.state.abbreviation).to.be.equal('AZ');
      expect(address.zip_code.id).to.be.ok;
      expect(address.zip_code.name).to.be.equal("85037");
      expect(address.zip_code.abbreviation).to.be.equal('PHX');
      count++;
    })
    callback();
  });

  Then('the address should be in the database', function() {
    let party_db = this.party_db;
    return party_db.any("select id, end_point as street_address, directions from contact_mechanism where contact_mechanism_type_id = $1 order by end_point", this.contact_mechanism_types.get('Postal Address')).then(address_list => address_list.map(address => {
      let city_query = party_db.any(`select geographic_boundary.id, geo_code, name, abbreviation
                                  from geographic_boundary, geographic_boundary_type, contact_mechanism_geographic_boundary
                                  where geographic_boundary_type.description like 'City'
                                  and geographic_boundary.geographic_boundary_type_id = geographic_boundary_type.id
                                  and contact_mechanism_geographic_boundary.contact_mechanism_id = $1
                                  and contact_mechanism_geographic_boundary.geographic_boundary_id = geographic_boundary.id`, address.id);
      let state_query = party_db.any(`select geographic_boundary.id, geo_code, name, abbreviation
                                  from geographic_boundary, geographic_boundary_type, contact_mechanism_geographic_boundary
                                  where geographic_boundary_type.description like 'State'
                                  and geographic_boundary.geographic_boundary_type_id = geographic_boundary_type.id
                                  and contact_mechanism_geographic_boundary.contact_mechanism_id = $1
                                  and contact_mechanism_geographic_boundary.geographic_boundary_id = geographic_boundary.id`, address.id);
      let zip_code_query = party_db.any(`select geographic_boundary.id, geo_code, name, abbreviation
                                  from geographic_boundary, geographic_boundary_type, contact_mechanism_geographic_boundary
                                  where geographic_boundary_type.description like 'Postal Code'
                                  and geographic_boundary.geographic_boundary_type_id = geographic_boundary_type.id
                                  and contact_mechanism_geographic_boundary.contact_mechanism_id = $1
                                  and contact_mechanism_geographic_boundary.geographic_boundary_id = geographic_boundary.id`, address.id);
      let country_query = party_db.any(`select geographic_boundary.id, geo_code, name, abbreviation
                                  from geographic_boundary, geographic_boundary_type, contact_mechanism_geographic_boundary
                                  where geographic_boundary_type.description like 'Country'
                                  and geographic_boundary.geographic_boundary_type_id = geographic_boundary_type.id
                                  and contact_mechanism_geographic_boundary.contact_mechanism_id = $1
                                  and contact_mechanism_geographic_boundary.geographic_boundary_id = geographic_boundary.id`, address.id);
      return Promise.all([city_query, state_query, zip_code_query, country_query]).spread((city, state, zip_code, country) => {
        address.city = city[0];
        address.state = state[0];
        address.zip_code = zip_code[0];
        address.country = country[0];
        expect(address.street_address).to.be.equal(this.address.street_address);
        expect(address.directions).to.be.equal(this.address.directions);
        expect(address.city.id).to.be.ok;
        expect(address.city.name).to.be.equal("Phoenix");
        expect(address.city.abbreviation).to.be.equal('PHX');
        expect(address.state.id).to.be.ok;
        expect(address.state.name).to.be.equal("Arizona");
        expect(address.state.abbreviation).to.be.equal('AZ');
        expect(address.zip_code.id).to.be.ok;
        expect(address.zip_code.name).to.be.equal("85037");
        expect(address.zip_code.abbreviation).to.be.equal('PHX');

        return address;
      });
    }));
  });
});
