import * as React from "react";
import { StyleSheet } from "react-nativescript";

interface PresetButtonProps {
    amount: number;
    onTap: () => void;
    col: number;
}

export function PresetButton({ amount, onTap, col }: PresetButtonProps) {
    return (
        <button
            className="m-2 p-4 bg-blue-100 rounded-lg"
            onTap={onTap}
            col={col}
        >
            <label className="text-blue-800 font-bold">
                €{amount.toFixed(2)}
            </label>
        </button>
    );
}