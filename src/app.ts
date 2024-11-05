import * as React from 'react';
import * as ReactNativeScript from 'react-nativescript';
import { MainStack } from './components/MainStack';
import { StripeTerminalProvider } from './context/StripeTerminalContext';

Object.defineProperty(global, '__DEV__', { value: false });

const App = () => (
    <StripeTerminalProvider>
        <MainStack />
    </StripeTerminalProvider>
);

ReactNativeScript.start(React.createElement(App, {}, null));