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

//Customer Type
function order(chats) {
  return chats.sort((a, b) => {
    const lista = getList(a.createdAt);
    const listb = getList(b.createdAt);
    for (let i = 0; i < listb.length; i++) {
      if (i === listb.length - 1) {
        return lista[i] - listb[i];
      } else {
        if (lista[i] - listb[i] !== 0) {
          return lista[i] - listb[i];
        }
      }
    }
  });
}

function getList(chats) {
  chats = chats.split("/");
  const times = chats[3].split(":");
  return [
    parseInt(chats[2]),
    parseInt(chats[0]),
    parseInt(chats[1]),
    parseInt(times[0]),
    parseInt(times[1]),
  ];
}
const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

//Chat Type
const ChatType = new GraphQLObjectType({
  name: "Chat",
  fields: () => ({
    id: { type: GraphQLString },
    to: { type: GraphQLString },
    from: { type: GraphQLString },
    content: { type: GraphQLString },
    createdAt: { type: GraphQLString },
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
    chat: {
      type: ChatType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios
          .get("http://localhost:3000/chats/" + args.id)
          .then((res) => res.data);
      },
    },
    chats: {
      type: new GraphQLList(ChatType),
      resolve(parentValue, args) {
        return axios.get("http://localhost:3000/chats").then((res) => res.data);
      },
    },
    myChats: {
      type: new GraphQLList(ChatType),
      args: {
        to: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios
          .get("http://localhost:3000/chats")
          .then((res) => res.data.filter((chat) => chat.to === args.to));
      },
    },
    mySentChats: {
      type: new GraphQLList(ChatType),
      args: {
        from: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios
          .get("http://localhost:3000/chats")
          .then((res) => res.data.filter((chat) => chat.from === args.from));
      },
    },
    myDMs: {
      type: new GraphQLList(ChatType),
      args: {
        to: { type: GraphQLString },
        from: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios
          .get("http://localhost:3000/chats")
          .then((res) =>
            order(
              res.data.filter(
                (chat) => chat.from === args.from && chat.to === args.to
              )
            )
          );
      },
    },
    myConvos: {
      type: new GraphQLList(ChatType),
      args: {
        a: { type: GraphQLString },
        b: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios
          .get("http://localhost:3000/chats")
          .then((res) =>
            order(
              res.data.filter(
                (chat) =>
                  (chat.from === args.a && chat.to === args.b) ||
                  (chat.from === args.b && chat.to === args.a)
              )
            )
          );
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
    addChat: {
      type: ChatType,
      args: {
        to: { type: new GraphQLNonNull(GraphQLString) },
        from: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        var hours = String(today.getHours()).padStart(2, "0");
        var minutes = String(today.getMinutes()).padStart(2, "0");

        today = mm + "/" + dd + "/" + yyyy + "/" + hours + ":" + minutes;
        return axios
          .post("http://localhost:3000/chats", {
            // so we make this a return because otherwise we wouldn't be able to get back the id/email etc. of the thing we just created
            to: args.to,
            from: args.from,
            content: args.content,
            createdAt: today,
          })
          .then((res) => res.data);
      },
      deleteChat: {
        type: ChatType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(parentValue, args) {
          return axios
            .delete("http://localhost:3000/chats/" + args.id)
            .then((res) => res.data);
        },
      },
    },
  },
});
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
