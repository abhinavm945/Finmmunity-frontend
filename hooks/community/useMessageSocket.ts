import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/utils/socket";

export function useMessageSocket({
  conversationId,
  onNewMessage,
  onTyping,
  onStopTyping,
}: {
  conversationId: string | null;
  onNewMessage: (msg: any) => void;
  onTyping?: (data: any) => void;
  onStopTyping?: (data: any) => void;
}) {
  const { user, token } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    if (user && token) {
      socket.connect(user.id, token);
      // Only join room after socket is connected
      const s = socket.getSocket();
      if (s) {
        s.on('connect', () => {
          socket.joinUserRoom(user.id);
        });
      }
      if (onNewMessage) socket.onNewMessage(onNewMessage);
      if (onTyping) socket.onUserTyping(onTyping);
      if (onStopTyping) socket.onUserStopTyping(onStopTyping);
      return () => {
        socket.offAll();
        socket.disconnect();
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, token, conversationId]);
} 