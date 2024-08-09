import React, { Component } from "react";
/**
 * @typedef ContractValue - A value/error object - Holds the state value if no errors hit while obtaining, else error will be populated
 * @property { string | false } error - "" if no error, or string if errors occcured in getting the value
 * @property { any } value - The context state value, will be false if error has occurred
 */
type GenericContextValue = {
    error: string | false;
    value: any;
};
/**
 * @typedef LockedPosition
 * @property { string } alcaReward -
 * @property { string } ethrewards -
 * @property { boolean } exists -
 * @property { string } lockedAlca -
 * @property { string } lockupPeriod -
 * @property { string } penalty -
 * @property { string } remainignRewards -
 * @property { string } tokenId -
 * @property { string } unlockDate -
 */
type LockedPosition = {
    alcaReward: string;
    ethReward: string;
    exists: boolean;
    lockedAlca: string;
    lockupPeriod: string;
    penalty: string;
    remainingRewards: string;
    tokenId: string;
    unlockDate: string;
};
type ContextState = {
    trackedAddress: string;
    allowances: object;
    balances: {
        alca: GenericContextValue;
        alcb: GenericContextValue;
        mad: GenericContextValue;
        ethereum: GenericContextValue;
    };
    positions: {
        staked: GenericContextValue;
        lockedPosition: LockedPosition;
    };
    updateBalances: Function;
};
export declare const BalanceContext: React.Context<ContextState>;
/**
 * @param {String} addressToTrack -
 * @param {Object[]} children -
 * @param {EthAdapter} ethAdapter - eth-adapter required, must be passed -- Used to check balances
 * @returns
 */
export declare function BalanceContextProvider({ children, ethAdapter }: {
    children: Component;
}): React.JSX.Element;
export {};
