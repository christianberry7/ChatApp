import React, { Component } from "react";
import DM from "./DM";
import Messages from "./Messages";
import Name from "./Name";

class ChatItem extends Component {
  render() {
    return (
      <React.Fragment>
        {sessionStorage
          .getItem("friends")
          .includes(this.props.match.params.id) ? (
          <div>
            <Name match={this.props.match} />
            <Messages match={this.props.match} />
            <hr />
            <DM match={this.props.match} />
            <a href="/friends" className="btn btn-secondary">
              Back
            </a>
          </div>
        ) : (
          <div>
            <h1>404: page not found :(</h1>
            <hr />
            <a href="/friends" className="btn btn-secondary">
              Back
            </a>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default ChatItem;
