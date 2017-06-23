// graph-schema/resolvers/index.js

import Promise from 'bluebird';

export function addresses(args, context, graphql) {
  let party_db = context.party_db;
  return party_db.any("select id, end_point as street_address, directions from contact_mechanism where contact_mechanism_type_id = $1",context.contact_mechanism_types.get('Postal Address'))
    .then(address_list => address_list.map( address => {
      let city_query = party_db.any(`select geographic_boundary.id, geo_code, name, abbreviation
                                from geographic_boundary, geographic_boundary_type, contact_mechanism_geographic_boundary
                                where geographic_boundary_type.description like 'City'
 	                              and geographic_boundary.geographic_boundary_type_id = geographic_boundary_type.id
                                and contact_mechanism_geographic_boundary.contact_mechanism_id = $1
                                and contact_mechanism_geographic_boundary.geographic_boundary_id = geographic_boundary.id`,address.id);
      let state_query = party_db.any(`select geographic_boundary.id, geo_code, name, abbreviation
                                from geographic_boundary, geographic_boundary_type, contact_mechanism_geographic_boundary
                                where geographic_boundary_type.description like 'State'
 	                              and geographic_boundary.geographic_boundary_type_id = geographic_boundary_type.id
                                and contact_mechanism_geographic_boundary.contact_mechanism_id = $1
                                and contact_mechanism_geographic_boundary.geographic_boundary_id = geographic_boundary.id`,address.id);
      let zip_code_query = party_db.any(`select geographic_boundary.id, geo_code, name, abbreviation
                                from geographic_boundary, geographic_boundary_type, contact_mechanism_geographic_boundary
                                where geographic_boundary_type.description like 'Postal Code'
 	                              and geographic_boundary.geographic_boundary_type_id = geographic_boundary_type.id
                                and contact_mechanism_geographic_boundary.contact_mechanism_id = $1
                                and contact_mechanism_geographic_boundary.geographic_boundary_id = geographic_boundary.id`,address.id);
      let country_query = party_db.any(`select geographic_boundary.id, geo_code, name, abbreviation
                                from geographic_boundary, geographic_boundary_type, contact_mechanism_geographic_boundary
                                where geographic_boundary_type.description like 'Country'
                                and geographic_boundary.geographic_boundary_type_id = geographic_boundary_type.id
                                and contact_mechanism_geographic_boundary.contact_mechanism_id = $1
                                and contact_mechanism_geographic_boundary.geographic_boundary_id = geographic_boundary.id`,address.id);
      return Promise.all([city_query, state_query,zip_code_query, country_query])
                          .spread((city, state, zip_code, country)=>{
                            address.city = city[0];
                            address.state = state[0];
                            address.zip_code = zip_code[0];
                            address.country = country[0];
                            return address;
                          });
  }));
};
