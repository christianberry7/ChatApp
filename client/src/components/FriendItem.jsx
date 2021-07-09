import React from "react";
import { useMutation, useQuery, gql } from "@apollo/client";

const UNREAD_QUERY = gql`
  query UnreadListQuery($to: String!) {
    myUnreadList(to: $to) {
      id
      from
      count
    }
  }
`;

const REMOVE_UNREAD = gql`
  mutation DeleteUnread($id: Int!) {
    deleteUnread(id: $id) {
      id
    }
  }
`;

var arraysMatch = function (arr1, arr2) {
  // don't need to check length
  // Check if all items exist and are in the same order
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  // Otherwise, return true
  return true;
};

// function getFriends(customers, friends) {
//   // console.log("get friends");
//   const orderedFriends = [];
//   for (let i = 0; i < friends.length; i++) {
//     for (let j = 0; j < customers.length; j++) {
//       if (friends[i] === customers[j].id) {
//         orderedFriends.push(customers[j]);
//         break;
//       }
//     }
//   }
//   //setFriends(orderedFriends);
//   return orderedFriends;
// }

async function changeOrder(id, friends, index, reorderfriends) {
  // console.log("Notifs changed so changning the order");
  const myid = sessionStorage.getItem("id");
  //const myfriends = sessionStorage.getItem("friends").split(",");
  const new_friends = [...friends];
  const friendIndex = friends.indexOf(id);
  // console.log(friendIndex);
  new_friends.unshift(new_friends.splice(friendIndex, 1)[0]);
  // console.log(myfriends);
  // console.log("old friends");
  // console.log(sessionStorage.getItem("friends"));
  // console.log("new friends");
  // console.log(new_friends);
  if (!arraysMatch(sessionStorage.getItem("friends").split(","), new_friends))
    sessionStorage.setItem("friends", new_friends);
  reorderfriends({
    variables: {
      id: myid,
      friends: new_friends,
    },
  })
    // .then((res) => console.log(getFriends(customers, new_friends)))
    .catch((err) => console.log(err.message));
}

function FriendItem({
  friend: { id, email, name, age },
  friends,
  customers,
  index,
  reorderfriends,
}) {
  const [removeunread] = useMutation(REMOVE_UNREAD);
  const myid = sessionStorage.getItem("id");
  const { loading, error, data } = useQuery(UNREAD_QUERY, {
    variables: { to: myid, from: id },
    pollInterval: 5000,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message} Error :(</p>;
  let unreadId = null;
  let unreads = 0;
  //console.log(data.myUnreadList);
  if (data.myUnreadList.length !== 0) {
    const { myUnreadList } = data;
    const unreadPositions = [];
    for (let i = myUnreadList.length - 1; i >= 0; i--) {
      unreadPositions.push(myUnreadList[i].from);
    }
    // if (data.myUnreads !== null) {
    // console.log(sessionStorage.getItem("unreads"));
    //unreads = data.myUnreads.count;
    // console.log("not empty");
    // console.log(other_id);
    // console.log(typeof other_id);
    for (let i = 0; i < myUnreadList.length; i++) {
      if (myUnreadList[i].from === id) {
        unreadId = myUnreadList[i].id;
        unreads = myUnreadList[i].count;
        break;
      }
    }
    //console.log(unreadPositions);
    //console.log(unreads);
    //if(id)
    console.log(unreadPositions);
    console.log(index);
    console.log(id);
    for (let i = 0; i < unreadPositions.length; i++) {
      if (unreadPositions[i] === id && i !== index) {
        console.log(`we should move ${id} to position ${i}`);
        changeOrder(id, friends, customers, reorderfriends)
          .then((res) => console.log("res " + res))
          .catch((err) => console.log(err.message));
      }
    }
    //console.log(index);

    // //console.log(unreadIds.from);
    // console.log(unreadIds.from);
    // console.log("from " + id);
    // console.log(friends.indexOf(id));
    // console.log(unreadIds);
    // if (unreadIds.from !== id) {
    //   changeOrder(unreadIds.from, friends, customers, reorderfriends)
    //     // .then((res) => console.log("res " + res))
    //     .catch((err) => console.log(err.message));
    //   console.log("update me");
    // }
  }

  return (
    <div className="card card-body mb-3">
      <div className="row">
        <div className="col-md-6">
          <h4>Name: {name}</h4>
          <p>Email:{email}</p>
          <p>Age:{age}</p>
        </div>
        {unreads === 0 ? (
          <div className="col-md-3"></div>
        ) : (
          <div className="col-md-3">
            <br></br>
            <span
              className="btn btn-danger btn-circle btn-sm"
              style={{ pointerEvents: "none" }}
            >
              <h3 style={{ color: "white" }}>{unreads}</h3>
            </span>
          </div>
        )}
        <div className="col-md-3">
          <br></br>
          <a
            href={`/friends/${id}`}
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              if (unreadId !== null) {
                removeunread({
                  variables: {
                    id: unreadId,
                  },
                });
              }
              window.location.replace(`/friends/${id}`);
            }}
          >
            Chat with friend!
          </a>
        </div>
      </div>
    </div>
  );
}

export default FriendItem;
