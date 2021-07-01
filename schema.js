const axios = require("axios"); // this is used for getting our json data
const {
  // this is object destructuring
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");

// // Hardcoded data
// const customers = [
//     { id:'1', name:'Jon Bellion', email:'jbellion@email.com', age:30  },
//     { id:'2', name:'John Mayer', email:'jcm@email.com', age:43  },
//     { id:'3', name:'Jonathon Ng', email:'eden@email.com', age:25  },
//     { id:'4', name:'Justin Bieber', email:'jb@email.com', age:27  }
// ]

//Customer Type
const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios
          .get("http://localhost:3000/customers/" + args.id)
          .then((res) => res.data);
        // for(let i = 0; i < customers.length;i++){ this was the original way with the hardcoded data
        //     if (customers[i].id === args.id){
        //         return customers[i];
        //     }
        // }
      },
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        return axios
          .get("http://localhost:3000/customers")
          .then((res) => res.data);
      },
    },
  },
});

//mutation
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parentValue, args) {
        return axios
          .post("http://localhost:3000/customers", {
            // so we make this a return because otherwise we wouldn't be able to get back the id/email etc. of the thing we just created
            name: args.name,
            email: args.email,
            age: args.age,
          })
          .then((res) => res.data);
      },
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        return axios
          .delete("http://localhost:3000/customers/" + args.id)
          .then((res) => res.data);
      },
    },
    editCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        return axios
          .patch("http://localhost:3000/customers/" + args.id, args)
          .then((res) => res.data);
      },
    },
  },
});
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
