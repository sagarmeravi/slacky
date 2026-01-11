import React from "react";
import { useChatContext } from "stream-chat-react";

const CustomChannelPreview = ({ channel, activeChannel, setActiveChannel }) => {
  const { channel: streamChannel } = useChatContext();

  const isActive = activeChannel?.id === channel.id;

  return (
    <div
      onClick={() => setActiveChannel(channel)}
      className={`channel-preview ${isActive ? "active" : ""}`}
      style={{
        padding: "10px 15px",
        cursor: "pointer",
        borderRadius: "8px",
        marginBottom: "8px",
        backgroundColor: isActive ? "#f0f0f0" : "transparent",
        transition: "background-color 0.2s",
      }}
    >
      <div style={{ fontSize: "14px", fontWeight: "500" }}>
        # {channel.data?.name || channel.id}
      </div>
    </div>
  );
};

export default CustomChannelPreview;
