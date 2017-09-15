// graph-schema/resolvers/index.js

import Promise from 'bluebird';

export function addresses(args, context, graphql) {
	let party_db = context.party_db;
	return party_db.any("select id, end_point as street_address, directions from contact_mechanism where contact_mechanism_type_id = $1 order by end_point", context.contact_mechanism_types.get('Postal Address')).then(address_list => address_list.map(address => {
		let city_query     = party_db.any(`select geographic_boundary.id, geo_code, name, abbreviation
                                from geographic_boundary, geographic_boundary_type, contact_mechanism_geographic_boundary
                                where geographic_boundary_type.description like 'City'
 	                              and geographic_boundary.geographic_boundary_type_id = geographic_boundary_type.id
                                and contact_mechanism_geographic_boundary.contact_mechanism_id = $1
                                and contact_mechanism_geographic_boundary.geographic_boundary_id = geographic_boundary.id`, address.id);
		let state_query    = party_db.any(`select geographic_boundary.id, geo_code, name, abbreviation
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
		let country_query  = party_db.any(`select geographic_boundary.id, geo_code, name, abbreviation
                                from geographic_boundary, geographic_boundary_type, contact_mechanism_geographic_boundary
                                where geographic_boundary_type.description like 'Country'
                                and geographic_boundary.geographic_boundary_type_id = geographic_boundary_type.id
                                and contact_mechanism_geographic_boundary.contact_mechanism_id = $1
                                and contact_mechanism_geographic_boundary.geographic_boundary_id = geographic_boundary.id`, address.id);
		return Promise.all([city_query, state_query, zip_code_query, country_query]).spread((city, state, zip_code, country) => {
			address.city     = city[0];
			address.state    = state[0];
			address.zip_code = zip_code[0];
			address.country  = country[0];
			return address;
		});
	}));
};

export function change_address(args, context, graphql) {
	let party_db         = context.party_db;
	let modified_address = args.modified_address;
	return party_db.any('update contact_mechanism set end_point = $1, directions = $2 where id = $3', [modified_address.street_address, modified_address.directions, modified_address.id]).then(() => ({id: modified_address.id}));
}

export function cities(args, context, graphql) {
	let party_db  = context.party_db;
	let city_name = args.name;
	return party_db.any("select geographic_boundary.id, geographic_boundary.name, geographic_boundary.abbreviation from geographic_boundary, geographic_boundary_type where geographic_boundary_type.description ='City' and geographic_boundary_type_id = geographic_boundary_type.id and geographic_boundary.name like $1 order by geographic_boundary.name ", [city_name + '%']);
}

export function create_address(args, context, graphql) {
	let party_db    = context.party_db;
	let new_address = args.new_address;
	console.log("new_address: ", new_address);
	return party_db.one('insert into contact_mechanism (end_point, directions, contact_mechanism_type_id) values( $1, $2, $3) returning id', [new_address.street_address, new_address.directions, context.contact_mechanism_types.get('Postal Address')]).then(result => {
		console.log("result: ", result);
		console.log("context: ", context);
		let city    = party_db.none("insert into contact_mechanism_geographic_boundary (contact_mechanism_id, geographic_boundary_id) values ($1, $2)", [result.id, new_address.city_id]);
		let state   = party_db.none("insert into contact_mechanism_geographic_boundary (contact_mechanism_id, geographic_boundary_id) values ($1, $2)", [result.id, new_address.state_id]);
		let zip     = party_db.none("insert into contact_mechanism_geographic_boundary (contact_mechanism_id, geographic_boundary_id) values ($1, $2)", [result.id, new_address.zip_code_id]);
		let country = party_db.none("insert into contact_mechanism_geographic_boundary (contact_mechanism_id, geographic_boundary_id) values ($1, $2)", [result.id, context.united_states.id]);
		return Promise.all([city, state, zip, country]).then(() => ({id: result.id}));
	});
}

export function delete_address(args, context, graphql) {
	let party_db = context.party_db;
	return party_db.none("delete from contact_mechanism_geographic_boundary where contact_mechanism_id = $1", args.id).then(() => party_db.none("delete from contact_mechanism where id = $1", args.id)).then(() => ({result: "success"}));
}

export function states(args, context, graphql) {
	let party_db = context.party_db;
	let name     = args.name;
	return party_db.any("select geographic_boundary.id, geographic_boundary.name, geographic_boundary.abbreviation from geographic_boundary, geographic_boundary_type where geographic_boundary_type.description ='State' and geographic_boundary_type_id = geographic_boundary_type.id and geographic_boundary.name like $1 order by geographic_boundary.name ", [name + '%']);
}

export function zip_codes(args, context, graphql) {
	let party_db = context.party_db;
	let name     = args.name;
	return party_db.any("select geographic_boundary.id, geographic_boundary.name, geographic_boundary.abbreviation from geographic_boundary, geographic_boundary_type where geographic_boundary_type.description ='Postal Code' and geographic_boundary_type_id = geographic_boundary_type.id and geographic_boundary.name like $1 order by geographic_boundary.name ", [name + '%']);
}
