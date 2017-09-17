export default function (obj, args, context, graphql) {
	return context.party_db.one(`select geographic_boundary.id, geo_code, name, abbreviation
                                from geographic_boundary, geographic_boundary_type, contact_mechanism_geographic_boundary
                                where geographic_boundary_type.description like 'City'
 	                              and geographic_boundary.geographic_boundary_type_id = geographic_boundary_type.id
                                and contact_mechanism_geographic_boundary.contact_mechanism_id = $1
                                and contact_mechanism_geographic_boundary.geographic_boundary_id = geographic_boundary.id`, obj.id);
};