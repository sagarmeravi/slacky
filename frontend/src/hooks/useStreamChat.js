import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import * as Sentry from "@sentry/react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
export const useStreamChat = () => {
  const { user, isLoaded } = useUser();
  const [chatClient, setChatClient] = useState(null);

  const {
    data: tokenData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["streamToken", user?.id],
    queryFn: getStreamToken,
    enabled: isLoaded && !!user?.id,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (
      !isLoaded ||
      !user?.id ||
      !tokenData?.token ||
      !STREAM_API_KEY ||
      chatClient // 🔑 prevents double connect
    ) {
      return;
    }

    const client = StreamChat.getInstance(STREAM_API_KEY);
    let cancelled = false;

    const connect = async () => {
      try {
        await client.connectUser(
          {
            id: user.id,
            name:
              user.fullName ??
              user.username ??
              user.primaryEmailAddress?.emailAddress ??
              user.id,
            image: user.imageUrl,
          },
          tokenData.token
        );

        if (!cancelled) {
          setChatClient(client);
        }
      } catch (err) {
        console.error("Stream connect error", err);
      }
    };

    connect();

    return () => {
      cancelled = true;
      // 🚫 no disconnect here
    };
  }, [isLoaded, user?.id, tokenData?.token, chatClient]);

  return { chatClient, isLoading, error };
};
