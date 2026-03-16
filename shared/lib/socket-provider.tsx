'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getCookie } from '../lib/cookies';
import { useQueryClient } from '@tanstack/react-query';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const isMock = process.env.NEXT_PUBLIC_MOCK_API === 'true';
    const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || '';
    const token = getCookie('auth_token');

    if (isMock) {
      console.log('📡 [Socket] Running in MOCK mode');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsConnected(true);
      return;
    }

    if (!baseUrl) return;

    const socketInstance = io(baseUrl, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
    });

    socketInstance.on('connect', () => {
      console.log('📡 [Socket] Connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('📡 [Socket] Disconnected');
      setIsConnected(false);
    });

    // Example of global listeners that update React Query cache
    socketInstance.on('file.updated', (data) => {
      queryClient.setQueryData(['source-files', data.id], (oldData: unknown) => {
        if (!oldData) return oldData;
        const typedOldData = oldData as { data: Record<string, unknown> };
        return {
          ...typedOldData,
          data: { ...typedOldData.data, ...data }
        };
      });
      
      // Also update lists if necessary
      queryClient.invalidateQueries({ queryKey: ['source-files'] });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [queryClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
