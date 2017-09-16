export default function (obj, args, context, graphql) {
	let party_db         = context.party_db;
	let modified_address = args.modified_address;
	return party_db.any('update contact_mechanism set end_point = $1, directions = $2 where id = $3', [modified_address.street_address, modified_address.directions, modified_address.id]).then(() => ({id: modified_address.id}));
}