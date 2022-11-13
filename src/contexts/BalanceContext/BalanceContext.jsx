import React from "react";

const defaultContextState = {
    trackedAddress: "",
    // Balance of allowance for (x) contract
    allowances: {
        alca: {
            // 0x0: <allowance>
        },
        alcb: {},
        mad: {},
    },
    // Balance of token for connected listener address
    balances: {
        alca: "n/a",
        alcb: "n/a",
        eth: "n/a",
        mad: "n/a",
    },
    positions: {
        staked: [
            /*
            {
            //     tokenId: "",
            //     rewardAlca: "",
            //     rewardEth: "",
            },
            */
        ],
        lockedPosition: {
            alcaReward: "",
            ethReward: "",
            exists: false,
            lockedAlca: "",
            lockupPeriod: "START" || "LOCKED" || "END",
            penalty: "",
            remainingRewards: "",
            tokenId: "",
            unlockDate: "",
        },
    },
    /**
     * @param {EthAdapter} ethAdapter - Ethereum adapter to be used from eth-adapter package
     */
    updateBalances: (ethAdapter) => {},
};

export const BalanceContext = React.createContext(defaultContextState);

// Setup sleeper function
const sleep = (amt) => new Promise((res) => setTimeout(res, amt));

/**
 * @param {String} addressToTrack -
 * @param {Object[]} children -
 * @param {EthAdapter} ethAdapter - eth-adapter required, must be passed -- Used to check balances
 * @returns
 */
export function BalanceContextProvider({ children, ethAdapter }) {
    const [contextState, setContextState] = React.useState(defaultContextState);

    const updateBalances = async (ethAdapter) => {
        if (!ethAdapter) {
            throw new Error("ethAdapter must be passed to updateBalances()!");
        }

        const address = ethAdapter.connectedAccount;

        let functionResults = await resolveBalancePromiseFunctionsNeatly([
            [
                function updateEthBalance() {
                    ethAdapter.updateEthereumBalance;
                },
                [],
            ], // Wrap as a function to contain this context on ethAdapter
            [getMadBalance, [ethAdapter, address]],
            [getATokenAllowanceForMad, [ethAdapter, address]],
            [getAlcaBalance, [ethAdapter, address]],
        ]);

        // Assign them as needed
        let { madBalance, alcaBalance, alcaMadAllowance } = {
            alcaBalance: functionResults["getAlcaBalance"].toString(),
            madBalance: functionResults["getMadBalance"].toString(),
            alcaMadAllowance: functionResults["getATokenAllowanceForMad"].toString(),
        };

        // Construct newBalances object
        const newBalances = {
            alca: alcaBalance.toString(),
            ethereum: ethAdapter.balances.ethereum, // Should be up to date from the updateEthereumBalanceCall()
            madBalance: madBalance.toString(),
        };

        // Construct newAllowances object
        const newAllowances = {
            alca: {},
            alcb: {},
            mad: {
                [ethAdapter.contractConfig.ATOKEN.address]: alcaMadAllowance,
            },
        };

        setContextState((s) => ({
            ...s,
            balances: { ...s.balances, ...newBalances },
            allowances: {
                ...s.allowances,
                alca: { ...s.allowances.alca, ...newAllowances.alca },
                alcb: { ...s.allowances.alcb, ...newAllowances.alcb },
                mad: { ...s.allowances.mad, ...newAllowances.mad },
            },
            trackedAddress: address,
        }));
    };

    // Setup balance listener that updates state
    React.useEffect(() => {
        const balanceCheckInterval = async () => {
            if (!!ethAdapter.connectedAccount) {
                updateBalances(ethAdapter);
            }
            await sleep(7500);
            balanceCheckInterval();
        };
        balanceCheckInterval();
    }, []);

    return (
        <BalanceContext.Provider value={{ ...contextState, updateBalances: updateBalances }}>
            {children}
        </BalanceContext.Provider>
    );
}

async function resolveBalancePromiseFunctionsNeatly(promiseFunctions = [[fxToCall, [params]]]) {
    const results = {}; // Track neat results for return based on fxName:result
    // Track promises and fxNames in like order
    const promises = [];
    const fxNames = [];
    for (let promiseFx of promiseFunctions) {
        promises.push(promiseFx[0](...promiseFx[1]));
        fxNames.push(promiseFx[0].name);
    }
    // Resolve all of the promises syncronously
    let resolved = await Promise.all(promises);
    // For each result assign to resolved with fxName of matching idx
    for (let i = 0; i < resolved.length; i++) {
        results[fxNames[i]] = resolved[i];
    }
    // Return them in neat format
    return results;
}

function getMadBalance(ethAdapter, address) {
    try {
        let res = ethAdapter.contractMethods.MADTOKEN.balanceOf_view_IN1_OUT1({
            _owner: address,
        });
        return res;
    } catch (ex) {
        return { error: ex.message };
    }
}

function getATokenAllowanceForMad(ethAdapter, address) {
    try {
        let aTokenAddress = ethAdapter?.contractConfig?.ATOKEN?.address; // UPDATE eth-adapter and get ATOken address from the newly exposed config
        if (!aTokenAddress) {
            throw new Error(
                "Unable to determine AToken address from passed ethAdapter. Make sure ethAdapter.contractConfig is populating"
            );
        }
        let allowance = ethAdapter.contractMethods.MADTOKEN.allowance_view_IN2_OUT1({
            _owner: address,
            _spender: aTokenAddress,
        });
        return allowance;
    } catch (ex) {
        return { error: ex };
    }
}

function getAlcaBalance(ethAdapter, address) {
    try {
        let res = ethAdapter.contractMethods.ATOKEN.balanceOf_view_IN1_OUT1({
            account: address,
        });
        return res;
    } catch (ex) {
        return { error: ex.message };
    }
}
