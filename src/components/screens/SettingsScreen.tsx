import { ApplicationSettings, Dialogs } from '@nativescript/core';
import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../../NavigationParamList";
import { StripeTerminalContext } from "../../context/StripeTerminalContext";

type SettingsScreenProps = {
    route: RouteProp<MainStackParamList, "Settings">,
    navigation: FrameNavigationProp<MainStackParamList, "Settings">,
};

export function SettingsScreen({ navigation }: SettingsScreenProps) {
    const { connect, disconnect, isConnected } = React.useContext(StripeTerminalContext);
    const [apiKey, setApiKey] = React.useState(ApplicationSettings.getString('stripe_api_key', ''));
    const [searching, setSearching] = React.useState(false);

    const handleConnect = async () => {
        if (!apiKey) {
            await Dialogs.alert({
                title: "Error",
                message: "Please enter your Stripe API key",
                okButtonText: "OK"
            });
            return;
        }

        setSearching(true);
        try {
            const success = await connect(apiKey);
            if (success) {
                await Dialogs.alert({
                    title: "Success",
                    message: "Terminal connected successfully!",
                    okButtonText: "OK"
                });
                navigation.goBack();
            } else {
                throw new Error("Failed to connect");
            }
        } catch (error) {
            await Dialogs.alert({
                title: "Error",
                message: "Failed to connect to terminal. Please try again.",
                okButtonText: "OK"
            });
        } finally {
            setSearching(false);
        }
    };

    const handleDisconnect = async () => {
        await disconnect();
        await Dialogs.alert({
            title: "Success",
            message: "Terminal disconnected successfully",
            okButtonText: "OK"
        });
    };

    return (
        <flexboxLayout style={styles.container}>
            <label className="text-xl font-bold mb-4">
                Stripe Settings
            </label>

            <label className="mb-2">API Key</label>
            <textField
                className="mb-4 p-4 bg-gray-100 rounded"
                hint="Enter your Stripe API key"
                text={apiKey}
                onTextChange={(args) => setApiKey(args.value)}
                secure={true}
            />

            <button
                className={`p-4 rounded-lg ${searching ? 'bg-gray-400' : 'bg-blue-500'}`}
                onTap={handleConnect}
                isEnabled={!searching && !isConnected}
            >
                <label className="text-white">
                    {searching ? 'Searching for Terminal...' : 'Connect Terminal'}
                </label>
            </button>

            {isConnected && (
                <button
                    className="mt-4 p-4 rounded-lg bg-red-500"
                    onTap={handleDisconnect}
                >
                    <label className="text-white">
                        Disconnect Terminal
                    </label>
                </button>
            )}
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