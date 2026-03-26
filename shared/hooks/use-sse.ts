import { useEffect, useRef, useState } from 'react';

/**
 * Hook for handling Server-Sent Events (SSE).
 * SSE is preferred over WebSockets/Socket.io for unidirectional data like 
 * status updates and progress tracking as it is more lightweight.
 */

interface UseSSEOptions<T> {
  /** Callback triggered when a new message is received. */
  onMessage?: (data: T) => void;
  /** Callback triggered when an error occurs. */
  onError?: (event: Event) => void;
  /** Callback triggered when the connection is opened. */
  onOpen?: (event: Event) => void;
  /** Whether the connection should be active. */
  enabled?: boolean;
}

export const useSSE = <T>(url: string | null, options: UseSSEOptions<T> = {}) => {
  const { onMessage, onError, onOpen, enabled = true } = options;
  const eventSourceRef = useRef<EventSource | null>(null);
  const [lastMessage, setLastMessage] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!url || !enabled) {
      return;
    }

    // Initialize EventSource
    // withCredentials is required to send cookies (like auth_token) to the server
    const eventSource = new EventSource(url, { withCredentials: true });
    eventSourceRef.current = eventSource;

    eventSource.onopen = (event) => {
      setIsConnected(true);
      onOpen?.(event);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
        onMessage?.(data);
      } catch (e) {
        console.error('[SSE] Failed to parse message:', e);
      }
    };

    eventSource.onerror = (event) => {
      console.error('[SSE] Connection error:', event);
      setIsConnected(false);
      onError?.(event);
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    };
  }, [url, enabled, onMessage, onError, onOpen]);

  return { 
    lastMessage, 
    isConnected
  };
};
