// features/step_definitions/address_steps.js

var {defineSupportCode} = require('cucumber');
import gql from 'graphql-tag';
import 'isomorphic-fetch';

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
    let count =0;
    addresses.forEach( address => {
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
});
