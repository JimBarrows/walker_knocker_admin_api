export default `
union CreateAddressResult = Address | MutationError
union ChangeAddressResult = Address | MutationError
union DeleteAddressResult = ResultType | MutationError
`;