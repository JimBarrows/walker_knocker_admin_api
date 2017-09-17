export default `
type Address {
    id: ID!
    street_address: String,
    directions: String,
    city: City!,
    state: State!,
    zip_code: ZipCode!
  }
`;