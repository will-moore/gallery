import React from "react";

const SettingsContext = React.createContext({});

export const SettingsProvider = SettingsContext.Provider;
export const SettingsConsumer = SettingsContext.Consumer;
export default SettingsContext;
