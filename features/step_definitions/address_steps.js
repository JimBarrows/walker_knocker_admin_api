// features/step_definitions/address_steps.js

var {defineSupportCode} = require('cucumber');

defineSupportCode(function({Given, When, Then}) {

  Given('there are {int} street addresses in the database', function(no_of_addresses) {
    let party_db = this.party_db;
    let promises = [];
    for( let i=0; i< no_of_addresses; i++) {
      promises.push(party_db.one("insert into contact_mechanism (end_point, directions, contact_mechanism_type_id) values ($1, $2, $3) returning id", ["end_point " + i, "directions " +i, this.postal_address.id])
      .then( address => {
        let city = this.party_db.none("insert into contact_mechanism_geographic_boundary (contact_mechanism_id, geographic_boundary_id) values ($1, $2)", [address.id, this.city.id]);
        let state = this.party_db.none("insert into contact_mechanism_geographic_boundary (contact_mechanism_id, geographic_boundary_id) values ($1, $2)", [address.id, this.state.id]);
        let zip = this.party_db.none("insert into contact_mechanism_geographic_boundary (contact_mechanism_id, geographic_boundary_id) values ($1, $2)", [address.id, this.state.id]);
        let country =  this.party_db.none("insert into contact_mechanism_geographic_boundary (contact_mechanism_id, geographic_boundary_id) values ($1, $2)", [address.id, this.country.id]);
        return Promise.all([city,state,zip, country]);
      })
    );
    }
    return Promise.all(promises);
  });

  When('I retrieve a list of addressess', function(callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending');
  });

  Then('there must be {int} street addresses in the response', function(int, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending');
  });

  Then('the {int} street addresses must be correct', function(int, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending');
  });
});
