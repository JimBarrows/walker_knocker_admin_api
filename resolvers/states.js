export default function (obj, args, context, graphql) {
	let party_db = context.party_db;
	let name     = args.name;
	return party_db.any("select geographic_boundary.id, geographic_boundary.name, geographic_boundary.abbreviation from geographic_boundary, geographic_boundary_type where geographic_boundary_type.description ='State' and geographic_boundary_type_id = geographic_boundary_type.id and geographic_boundary.name like $1 order by geographic_boundary.name ", [name + '%']);
}
