export default function (obj, args, context, graphql) {
	let party_db    = context.party_db;
	let new_address = args.new_address;
	return party_db.one('insert into contact_mechanism (end_point, directions, contact_mechanism_type_id) values( $1, $2, $3) returning id', [new_address.street_address, new_address.directions, context.contact_mechanism_types.get('Postal Address')]).then(result => {
		let city    = party_db.none("insert into contact_mechanism_geographic_boundary (contact_mechanism_id, geographic_boundary_id) values ($1, $2)", [result.id, new_address.city_id]);
		let state   = party_db.none("insert into contact_mechanism_geographic_boundary (contact_mechanism_id, geographic_boundary_id) values ($1, $2)", [result.id, new_address.state_id]);
		let zip     = party_db.none("insert into contact_mechanism_geographic_boundary (contact_mechanism_id, geographic_boundary_id) values ($1, $2)", [result.id, new_address.zip_code_id]);
		let country = party_db.none("insert into contact_mechanism_geographic_boundary (contact_mechanism_id, geographic_boundary_id) values ($1, $2)", [result.id, context.united_states.id]);
		return Promise.all([city, state, zip, country]).then(() => ({id: result.id}));
	});
}
