import { ApplicationSettings } from '@nativescript/core';
import { StripeTerminal } from '@stripe/stripe-terminal-react-native';

export class StripeTerminalService {
    private static instance: StripeTerminalService;
    private terminal: StripeTerminal | null = null;

    private constructor() {}

    static getInstance(): StripeTerminalService {
        if (!StripeTerminalService.instance) {
            StripeTerminalService.instance = new StripeTerminalService();
        }
        return StripeTerminalService.instance;
    }

    async initialize(apiKey: string): Promise<boolean> {
        try {
            this.terminal = await StripeTerminal.create({
                apiKey,
                name: 'Pre-Set Payments Terminal'
            });
            ApplicationSettings.setString('stripe_api_key', apiKey);
            return true;
        } catch (error) {
            console.error('Failed to initialize Stripe Terminal:', error);
            return false;
        }
    }

    async discoverReaders(): Promise<boolean> {
        try {
            const { readers } = await this.terminal?.discoverReaders({
                discoveryMethod: 'bluetoothScan'
            }) || { readers: [] };
            
            if (readers && readers.length > 0) {
                const connected = await this.terminal?.connectReader(readers[0]);
                return !!connected;
            }
            return false;
        } catch (error) {
            console.error('Failed to discover readers:', error);
            return false;
        }
    }

    async processPayment(amount: number): Promise<boolean> {
        try {
            const paymentIntent = await this.terminal?.createPaymentIntent({
                amount: Math.round(amount * 100),
                currency: 'eur'
            });

            if (!paymentIntent) {
                throw new Error('Failed to create payment intent');
            }

            const processResult = await this.terminal?.processPayment(paymentIntent);
            return processResult?.status === 'succeeded';
        } catch (error) {
            console.error('Failed to process payment:', error);
            return false;
        }
    }

    async disconnect(): Promise<void> {
        try {
            await this.terminal?.disconnectReader();
        } catch (error) {
            console.error('Failed to disconnect reader:', error);
        }
    }
}