import React, { Component } from "react";
import DM from "./DM";
import Messages from "./Messages";
import Name from "./Name";

class ChatItem extends Component {
  render() {
    return (
      <React.Fragment>
        <Name match={this.props.match} />
        <Messages match={this.props.match} />
        <hr />
        <DM match={this.props.match} />
        <a href="/friends" className="btn btn-secondary">
          Back
        </a>
      </React.Fragment>
    );
  }
}

export default ChatItem;
