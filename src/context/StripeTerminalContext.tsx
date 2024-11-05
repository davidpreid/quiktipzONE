import * as React from 'react';
import { StripeTerminalService } from '../services/StripeTerminalService';

interface StripeTerminalContextType {
    isConnected: boolean;
    isInitialized: boolean;
    connect: (apiKey: string) => Promise<boolean>;
    disconnect: () => Promise<void>;
    processPayment: (amount: number) => Promise<boolean>;
}

export const StripeTerminalContext = React.createContext<StripeTerminalContextType>({
    isConnected: false,
    isInitialized: false,
    connect: async () => false,
    disconnect: async () => {},
    processPayment: async () => false,
});

export function StripeTerminalProvider({ children }: { children: React.ReactNode }) {
    const [isConnected, setIsConnected] = React.useState(false);
    const [isInitialized, setIsInitialized] = React.useState(false);
    const terminalService = StripeTerminalService.getInstance();

    const connect = async (apiKey: string): Promise<boolean> => {
        const initialized = await terminalService.initialize(apiKey);
        setIsInitialized(initialized);
        
        if (initialized) {
            const connected = await terminalService.discoverReaders();
            setIsConnected(connected);
            return connected;
        }
        return false;
    };

    const disconnect = async () => {
        await terminalService.disconnect();
        setIsConnected(false);
    };

    const processPayment = async (amount: number): Promise<boolean> => {
        if (!isConnected) return false;
        return await terminalService.processPayment(amount);
    };

    return (
        <StripeTerminalContext.Provider
            value={{
                isConnected,
                isInitialized,
                connect,
                disconnect,
                processPayment,
            }}
        >
            {children}
        </StripeTerminalContext.Provider>
    );
}