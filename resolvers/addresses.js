export default function (obj, args, context, graphql) {
	console.log("Addresses function");
	console.log("obj: " , obj);
	console.log("args: ", args);
	console.log("context: ", context);
	console.log("graphql: ", graphql);
	return context.party_db.any("select id, end_point as street_address, directions from contact_mechanism where contact_mechanism_type_id = $1 order by end_point", context.contact_mechanism_types.get('Postal Address'));
};
