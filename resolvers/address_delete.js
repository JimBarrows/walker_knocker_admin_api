export default function (obj, args, context, graphql) {
	let party_db = context.party_db;
	return party_db
			.none("delete from contact_mechanism_geographic_boundary where contact_mechanism_id = $1", args.id)
			.then(() => party_db.none("delete from contact_mechanism where id = $1", args.id))
			.then(() => ( "success"));
}
