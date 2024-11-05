import { Dialogs } from '@nativescript/core';
import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../../NavigationParamList";
import { StripeTerminalContext } from "../../context/StripeTerminalContext";
import { PresetButton } from "../ui/PresetButton";

type HomeScreenProps = {
    route: RouteProp<MainStackParamList, "Home">,
    navigation: FrameNavigationProp<MainStackParamList, "Home">,
};

export function HomeScreen({ navigation }: HomeScreenProps) {
    const [currentAmount, setCurrentAmount] = React.useState(2.00);
    const { isConnected, processPayment } = React.useContext(StripeTerminalContext);
    const [isProcessing, setIsProcessing] = React.useState(false);

    const handlePresetTap = (amount: number) => {
        setCurrentAmount(amount);
    };

    const handlePayment = async () => {
        if (!isConnected) {
            await Dialogs.alert({
                title: "Not Connected",
                message: "Please connect to a Stripe terminal in Settings",
                okButtonText: "OK"
            });
            return;
        }

        setIsProcessing(true);
        try {
            const success = await processPayment(currentAmount);
            if (success) {
                await Dialogs.alert({
                    title: "Success",
                    message: `Payment of €${currentAmount.toFixed(2)} processed successfully`,
                    okButtonText: "OK"
                });
            } else {
                throw new Error("Payment failed");
            }
        } catch (error) {
            await Dialogs.alert({
                title: "Error",
                message: "Failed to process payment. Please try again.",
                okButtonText: "OK"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <flexboxLayout style={styles.container}>
            <label className="text-3xl font-bold text-center mb-8">
                €{currentAmount.toFixed(2)}
            </label>

            <gridLayout columns="*, *, *" rows="auto" className="mb-8">
                <PresetButton amount={1} onTap={() => handlePresetTap(1)} col={0} />
                <PresetButton amount={2} onTap={() => handlePresetTap(2)} col={1} />
                <PresetButton amount={5} onTap={() => handlePresetTap(5)} col={2} />
            </gridLayout>

            <textField
                hint="Enter custom amount"
                keyboardType="number"
                className="mb-8 p-4 bg-gray-100 rounded"
                text={currentAmount.toString()}
                onTextChange={(args) => {
                    const value = parseFloat(args.value);
                    if (!isNaN(value)) {
                        setCurrentAmount(value);
                    }
                }}
            />

            <button
                className={`p-4 rounded-lg ${isConnected && !isProcessing ? 'bg-blue-500' : 'bg-gray-400'}`}
                onTap={handlePayment}
                isEnabled={isConnected && !isProcessing}
            >
                <label className="text-white text-lg font-bold">
                    {isProcessing ? 'Processing...' : 'Pay with Terminal'}
                </label>
            </button>

            <button
                className="mt-4"
                onTap={() => navigation.navigate("Settings")}
            >
                <label className="text-blue-500">
                    Settings
                </label>
            </button>

            <label className={`mt-4 ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                Terminal: {isConnected ? 'Connected' : 'Not Connected'}
            </label>
        </flexboxLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        flexDirection: "column",
        padding: 20,
    },
});