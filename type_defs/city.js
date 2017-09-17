export default `
type City implements GeographicBoundary {
    id: ID!,
    geo_code: String,
    name: String,
    abbreviation: String,
    geographic_boundary_type_id: String
  }
`;