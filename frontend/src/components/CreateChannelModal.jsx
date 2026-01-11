import React, { useState } from "react";
import { useChatContext } from "stream-chat-react";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const CreateChannelModal = ({ onClose }) => {
  const [channelName, setChannelName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { client } = useChatContext();
  const { user } = useUser();

  const handleCreateChannel = async (e) => {
    e.preventDefault();

    if (!channelName.trim()) {
      toast.error("Channel name is required");
      return;
    }

    setIsLoading(true);

    try {
      const channel = client.channel("messaging", {
        name: channelName,
        members: [user?.id],
      });

      await channel.create();
      toast.success(`Channel "${channelName}" created successfully!`);
      setChannelName("");
      onClose();
    } catch (error) {
      console.error("Error creating channel:", error);
      toast.error("Failed to create channel");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "400px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: "0 0 20px 0", fontSize: "20px" }}>
          Create Channel
        </h2>

        <form onSubmit={handleCreateChannel}>
          <input
            type="text"
            placeholder="Channel name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "#4a5568",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "#e2e8f0",
                color: "#333",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChannelModal;
