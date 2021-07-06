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

async function grabUnreads(args) {
  try {
    // fetch data from a url endpoint
    const myto = args.to;
    const myfrom = args.from;
    const response = await axios.get("http://localhost:3000/unreads");
    //return response;
    const unreads = response.data;
    console.log(unreads);
    console.log(unreads[0]);
    console.log("myfrom " + myfrom);
    let obj = null;
    for (let i = 0; i < unreads.length; i++) {
      console.log(i);
      console.log("unreads to " + unreads[i].to);
      console.log("myto " + myto);
      if (unreads[i].to === myto && unreads[i].from === myfrom) {
        obj = unreads[i];
        break;
      }
    }
    return obj;
  } catch (error) {
    console.log(error.message); // catches both errors
  }
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
    password: { type: GraphQLString },
    friends: { type: new GraphQLList(GraphQLString) },
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

//Request Type
const RequestType = new GraphQLObjectType({
  name: "Request",
  fields: () => ({
    id: { type: GraphQLInt },
    to: { type: GraphQLString },
    from: { type: GraphQLString },
  }),
});

//Unread Message Type
const UnreadType = new GraphQLObjectType({
  name: "Unread",
  fields: () => ({
    id: { type: GraphQLInt },
    to: { type: GraphQLString },
    from: { type: GraphQLString },
    count: { type: GraphQLInt },
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
    requests: {
      type: new GraphQLList(RequestType),
      resolve(parentValue, args) {
        return axios
          .get("http://localhost:3000/requests")
          .then((res) => res.data);
      },
    },
    myRequestsCount: {
      type: GraphQLInt,
      args: {
        to: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios
          .get("http://localhost:3000/requests")
          .then(
            (res) => res.data.filter((chat) => request.to === args.to).length
          );
      },
    },
    mySentRequests: {
      type: new GraphQLList(RequestType),
      args: {
        from: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios
          .get("http://localhost:3000/requests")
          .then((res) =>
            res.data.filter((request) => request.from === args.from)
          );
      },
    },
    myReceivedRequests: {
      type: new GraphQLList(RequestType),
      args: {
        to: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios
          .get("http://localhost:3000/requests")
          .then((res) => res.data.filter((request) => request.to === args.to));
      },
    },
    ourRequests: {
      type: RequestType,
      args: {
        a: { type: GraphQLString },
        b: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios
          .get("http://localhost:3000/requests")
          .then(
            (res) =>
              res.data.filter(
                (request) =>
                  (request.from === args.a && request.to === args.b) ||
                  (request.from === args.b && request.to === args.a)
              )[0]
          );
      },
    },
    unreads: {
      type: new GraphQLList(UnreadType),
      resolve(parentValue, args) {
        return axios
          .get("http://localhost:3000/unreads")
          .then((res) => res.data);
      },
    },
    myUnreads: {
      type: UnreadType,
      args: {
        to: { type: GraphQLString },
        from: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios
          .get("http://localhost:3000/unreads")
          .then(
            (res) =>
              res.data.filter(
                (unread) => unread.to === args.to && unread.from === args.from
              )[0]
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
        password: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parentValue, args) {
        return axios
          .post("http://localhost:3000/customers", {
            // so we make this a return because otherwise we wouldn't be able to get back the id/email etc. of the thing we just created
            name: args.name,
            email: args.email,
            password: args.password,
            age: args.age,
            friends: [],
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
        password: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt },
        friends: { type: new GraphQLList(GraphQLString) },
      },
      resolve(parentValue, args) {
        return axios
          .patch("http://localhost:3000/customers/" + args.id, args)
          .then((res) => res.data);
      },
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
    addFriendship: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        friends: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
      },
      resolve(parentValue, args) {
        return axios
          .patch("http://localhost:3000/customers/" + args.id, {
            friends: args.friends,
          })
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
    },
    addRequest: {
      type: RequestType,
      args: {
        to: { type: new GraphQLNonNull(GraphQLString) },
        from: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        return axios
          .post("http://localhost:3000/requests", {
            to: args.to,
            from: args.from,
          })
          .then((res) => res.data);
      },
    },
    deleteRequest: {
      type: RequestType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parentValue, args) {
        return axios
          .delete("http://localhost:3000/requests/" + args.id)
          .then((res) => res.data);
      },
    },
    deleteUnread: {
      type: UnreadType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parentValue, args) {
        return axios
          .delete("http://localhost:3000/unreads/" + args.id)
          .then((res) => res.data);
      },
    },
    addUnread: {
      type: UnreadType,
      args: {
        to: { type: new GraphQLNonNull(GraphQLString) },
        from: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        // const myto = args.to;
        // const myfrom = args.from;
        // console.log("myto " + myto);
        grabUnreads(args)
          .then((obj) => {
            if (obj === null) {
              return axios
                .post("http://localhost:3000/unreads", {
                  to: args.to,
                  from: args.from,
                  count: 1,
                })
                .then((res) => res.data);
            } else {
              const id = obj.id;
              let count = obj.count + 1;
              return axios
                .patch("http://localhost:3000/unreads/" + id, {
                  id,
                  to: args.to,
                  from: args.from,
                  count,
                })
                .then((res) => res.data);
            }
          })
          .catch((err) => console.log("AYOOOOOOOOOOOO " + err.message));
        // for (let i = 0; i < unreads.length; i++) {
        //   if (unreads[i].to === args.to && unreads[i].from === args.from) {
        //     index = i;
        //     break;
        //   }
        // }
        // //index = 3;
        // if (index === -1) {
        //   return axios
        //     .post("http://localhost:3000/unreads", {
        //       to: args.to,
        //       from: args.from,
        //       count: 1,
        //     })
        //     .then((res) => res.data);
        // } else {
        //   const id = unreads[index].id;
        //   let count = unreads[index].count + 1;
        //   return axios
        //     .patch("http://localhost:3000/unreads/" + id, {
        //       id,
        //       to: args.to,
        //       from: args.from,
        //       count,
        //     })
        //     .then((res) => res.data);
        // }
      },
    },
  },
});
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
