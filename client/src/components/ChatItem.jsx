import React, { Component } from "react";
import DM from "./DM";
import Messages from "./Messages";
import Name from "./Name";

class ChatItem extends Component {
  state = { chats: [] };

  handlePost = ({ data }) => {
    const extra = data.addChat;
    this.setState((prevState) => ({
      chats: [...prevState.chats, extra],
    }));
  };

  render() {
    return (
      <React.Fragment>
        <Name match={this.props.match} />
        <Messages match={this.props.match} />
        {this.state.chats.length ? (
          this.state.chats.map((chat) => (
            <div
              key={chat.id}
              className={
                chat.from === this.props.match.params.id
                  ? "theirchat"
                  : "mychat"
              }
            >
              <h3>{chat.content}</h3>
              <h4>{chat.createdAt}</h4>
            </div>
          ))
        ) : (
          <h1 className="noMessages">Send a message!</h1>
        )}
        <hr />
        <DM match={this.props.match} post={this.handlePost} />
        <a href="/" className="btn btn-secondary">
          Back
        </a>
      </React.Fragment>
    );
  }
}

export default ChatItem;
