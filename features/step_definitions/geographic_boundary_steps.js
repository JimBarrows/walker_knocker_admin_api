// features/step_definitions/geographic_boundary_steps.js

var { defineSupportCode } = require( 'cucumber' );
import gql from 'graphql-tag';
import 'isomorphic-fetch';
import Promise from "bluebird";

defineSupportCode( function({ Given, When, Then }) {

	Given( 'Cities exist as geographic boundaries', function( callback ) {
		//The database should already have a list of cities in it.  If it doesn't use this step to put them in.
		callback( );
	});

	Given( 'States exist as geographic boundaries', function( callback ) {
    //The database should already have a list of states in it.  If it doesn't use this step to put them in.
		callback( );
	});

  Given( 'Zip Codes exist as geographic boundaries', function( callback ) {
    //The database should already have a list of states in it.  If it doesn't use this step to put them in.
		callback( );
	});

	When( 'I provide {stringInDoubleQuotes} as the beginning of a city name', function( city_name ) {
		return this.client.query({
			query: gql `query cities($name: String!) {
                    cities(name: $name) {
                      id
                      name
                      abbreviation
                    }
                  }
    `,
			variables: {
				name: city_name
			}
		}).then( results => this.result.data = results.data.cities );
	});

	When( 'I provide {stringInDoubleQuotes} as the beginning of a state name', function( name ) {
    return this.client.query({
			query: gql `query states($name: String!) {
                    states(name: $name) {
                      id
                      name
                      abbreviation
                    }
                  }
    `,
			variables: {
				name: name
			}
		}).then( results => this.result.data = results.data.states );
	});

  When( 'I provide {stringInDoubleQuotes} as the beginning of a zip code', function( name ) {
    return this.client.query({
			query: gql `query zip_codes($name: String!) {
                    zip_codes(name: $name) {
                      id
                      name
                      abbreviation
                    }
                  }
    `,
			variables: {
				name: name
			}
		}).then( results => this.result.data = results.data.zip_codes );
	});

	Then( 'I get a list of cities', function( callback ) {
		expect( this.result.data ).to.be.an( 'array' );
		callback( );

	});

  Then( 'I get a list of states', function( callback ) {
    expect( this.result.data ).to.be.an( 'array' );
		callback( );

	});

  Then( 'I get a list of zip codes', function( callback ) {
    expect( this.result.data ).to.be.an( 'array' );
		callback( );

	});

	Then( 'the list of states contains {stringInDoubleQuotes}', function( state, callback ) {
    expect(this.result.data.map( state => state.name )).to.include( state );
		callback( );
	});

	Then( 'the list of cities contains {stringInDoubleQuotes}', function( city, callback ) {
		expect(this.result.data.map( city => city.name )).to.include( city );
		callback( );
	});

  Then( 'the list of zip codes contains {stringInDoubleQuotes}', function( city, callback ) {
    expect(this.result.data.map( zip_code => zip_code.name )).to.include( zip_code );
    callback( );
  });

	Then( 'the list of cities is only {int} long', function( length, callback ) {
		expect( this.result.data.length ).to.be.equal( length );
		callback( );
	});

	Then( 'the list of states is only {int} long', function( length, callback ) {
    expect( this.result.data.length ).to.be.equal( length );
		callback( );
	});

  Then( 'the list of zip codes is only {int} long', function( length, callback ) {
    expect( this.result.data.length ).to.be.equal( length );
		callback( );
	});
});
