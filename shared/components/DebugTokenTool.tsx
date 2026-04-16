'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';
import { setCookie, deleteCookie, getCookie } from '@/shared/lib/cookies';
import { apiClient } from '@/shared/api/axios';
import { ShieldAlert, RefreshCcw, Trash2, Bug } from 'lucide-react';

export const DebugTokenTool = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development or if a specific localStorage key is set
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && !localStorage.getItem('DEBUG_TOKEN')) {
      return null;
  }

  const forceExpire = () => {
    setCookie('auth_token', 'expired-or-invalid-token');
    toast.warning("Auth token has been sabotaged (made invalid)");
  };

  const corruptRefreshToken = () => {
    setCookie('refresh_token', 'invalid-refresh-token');
    toast.error("Refresh token has been sabotaged");
  };

  const clearAllTokens = () => {
    deleteCookie('auth_token');
    deleteCookie('refresh_token');
    toast.info("All tokens cleared");
  };

  const trigger401 = async () => {
    try {
      toast.info("Triggering a request that should return 401...");
      // Using an endpoint we know exists
      await apiClient.get('/source-files', { params: { limit: 1 } }); 
      toast.success("Request succeeded! (Interceptor should have refreshed it)");
    } catch (err: any) {
      console.log('Final request error in debug tool:', err);
      toast.error(`Final Error: ${err.message || 'Check console'}`);
    }
  };

  const manualRefreshToken = async () => {
    const refreshToken = getCookie('refresh_token');
    if (!refreshToken) {
      toast.error("No refresh token found in cookies");
      return;
    }

    try {
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
      toast.info("Manually hitting /auth/refresh (PUT)...");
      
      const response = await axios.put(`${baseUrl}/auth/refresh`, {
        refreshToken: refreshToken
      });
      
      console.log('Manual Refresh Response:', response.data);
      toast.success("Refresh API Succeeded!", {
        description: "Check console for data. Current tokens in cookies are NOT updated by this manual button."
      });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
      console.error('Manual Refresh Error:', err.response?.data || err);
      toast.error("Refresh API Failed", {
        description: `Error: ${errorMsg}`
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {!isVisible ? (
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => setIsVisible(true)}
          className="rounded-full h-10 w-10 p-0 shadow-lg"
        >
          <Bug className="h-5 w-5" />
        </Button>
      ) : (
        <div className="bg-card border border-border p-4 rounded-2xl shadow-2xl w-64 space-y-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <Bug className="h-4 w-4 text-destructive" />
              Token Debugger
            </h4>
            <button onClick={() => setIsVisible(false)} className="text-muted-foreground hover:text-foreground">
              &times;
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                onClick={forceExpire}
                className="justify-start text-xs h-8"
            >
              <ShieldAlert className="h-3 w-3 mr-2" /> Force Access Expire
            </Button>
            
            <Button 
                variant="outline" 
                size="sm" 
                onClick={corruptRefreshToken}
                className="justify-start text-xs h-8"
            >
              <Trash2 className="h-3 w-3 mr-2" /> Corrupt Refresh Token
            </Button>

            <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllTokens}
                className="justify-start text-xs h-8 text-destructive"
            >
              <Trash2 className="h-3 w-3 mr-2" /> Logout (Clear Cookies)
            </Button>
            
            <hr className="border-border/50" />
            
            <Button 
                variant="default" 
                size="sm" 
                onClick={trigger401}
                className="w-full text-xs h-9 bg-primary"
            >
              <RefreshCcw className="h-3 w-3 mr-2" /> Trigger Interceptor
            </Button>

            <Button 
                variant="secondary" 
                size="sm" 
                onClick={manualRefreshToken}
                className="w-full text-xs h-9"
            >
              <RefreshCcw className="h-3 w-3 mr-2" /> Manual Refresh Call
            </Button>
          </div>
          
          <div className="text-[10px] text-muted-foreground bg-muted/50 p-2 rounded">
            <strong>Current:</strong> {getCookie('auth_token') ? 'Has Token' : 'No Token'}
          </div>
        </div>
      )}
    </div>
  );
};
