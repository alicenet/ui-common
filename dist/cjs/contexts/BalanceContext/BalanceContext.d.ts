import React from "react";
export declare const BalanceContext: React.Context<{
    trackedAddress: string;
    allowances: {
        alca: {};
        alcb: {};
        mad: {};
    };
    balances: {
        alca: string;
        alcb: string;
        ethereum: string;
        mad: string;
    };
    positions: {
        staked: any[];
        lockedPosition: {
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
    };
    /**
     * @param {EthAdapter} ethAdapter - Ethereum adapter to be used from eth-adapter package
     */
    updateBalances: (ethAdapter: any) => void;
}>;
/**
 * @param {String} addressToTrack -
 * @param {Object[]} children -
 * @param {EthAdapter} ethAdapter - eth-adapter required, must be passed -- Used to check balances
 * @returns
 */
export declare function BalanceContextProvider({ children, ethAdapter }: {
    children: any;
    ethAdapter: any;
}): JSX.Element;
