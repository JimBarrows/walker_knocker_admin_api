export default `
union CreateAddressResult = CreateAddressSuccess | MutationError
union ChangeAddressResult = ChangeAddressSuccess | MutationError
union DeleteAddressResult = DeleteAddressSuccess | MutationError
`;