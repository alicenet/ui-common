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
        ethereum: "n/a",
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

// Names of functions for readable promise resolving in balance updating -- hardcoded to protect against minify as opposed to FUNCTION.name
const prettyFxNames = {
    getMadBalance: "getMadBalance",
    getAlcaBalance: "getAlcaBalance",
    getAlcbBalance: "getAlcbBalance",
    getATokenAllowanceForMad: "getATokenAllowanceForMad",
    getStakedAlcaPositions: "getStakedAlcaPositions",
    getLockedPosition: "getLockedPosition",
};

// Pretty function name => [functionName, functionObject]
const prettyFunctionIDs = {
    [prettyFxNames.getMadBalance]: [prettyFxNames.getMadBalance, getMadBalance],
    [prettyFxNames.getAlcaBalance]: [prettyFxNames.getAlcaBalance, getAlcaBalance],
    [prettyFxNames.getAlcbBalance]: [prettyFxNames.getAlcbBalance, getAlcbBalance],
    [prettyFxNames.getATokenAllowanceForMad]: [prettyFxNames.getATokenAllowanceForMad, getATokenAllowanceForMad],
    [prettyFxNames.getStakedAlcaPositions]: [prettyFxNames.getStakedAlcaPositions, getStakedAlcaPositions],
    [prettyFxNames.getLockedPosition]: [prettyFxNames.getLockedPosition, getLockedPosition],
};

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

        // Get eth balance first
        await ethAdapter.updateEthereumBalance();

        const updateAllAddressesFromFactory = async () => {
            let cSalts = ["AToken", "BToken", "PublicStaking", "Lockup", "ValidatorStaking"];
            for (let cSalt of cSalts) {
                let addressFromFactory = await ethAdapter.contractMethods.FACTORY.lookup_view_IN1_OUT1({
                    salt_: ethAdapter.ethers.utils.formatBytes32String(cSalt),
                });
                ethAdapter.contractConfig[cSalt.toUpperCase()].address = addressFromFactory;
            }
        };

        await updateAllAddressesFromFactory();

        // Get the BToken contract address and update contractConfig on ethAdapter if it's set to 0x0
        if (ethAdapter.contractConfig["BTOKEN"].address === "0x0") {
            console.warn("BToken was set to 0x0... using Factory.lookup() to populate BTOKEN address.");
            let bTokenAddress = await ethAdapter.contractMethods.FACTORY.lookup_view_IN1_OUT1({
                salt_: ethAdapter.ethers.utils.formatBytes32String("BToken"),
            });
            ethAdapter.contractConfig["BTOKEN"].address = bTokenAddress;
        }

        // Setup pretty function resolution
        let functionResults = await resolveBalancePromiseFunctionsNeatly([
            [prettyFxNames.getMadBalance, [ethAdapter, address]],
            [prettyFxNames.getAlcaBalance, [ethAdapter, address]],
            [prettyFxNames.getAlcbBalance, [ethAdapter, address]],
            [prettyFxNames.getATokenAllowanceForMad, [ethAdapter, address]],
            [prettyFxNames.getStakedAlcaPositions, [ethAdapter, address]],
            [prettyFxNames.getLockedPosition, [ethAdapter, address]],
        ]);

        // Assign them as needed
        let { madBalance, alcaBalance, alcbBalance, alcaMadAllowance, stakedPositions, lockedPosition } = {
            alcaBalance: functionResults[prettyFxNames.getAlcaBalance],
            alcbBalance: functionResults[prettyFxNames.getAlcbBalance],
            madBalance: functionResults[prettyFxNames.getMadBalance],
            alcaMadAllowance: functionResults[prettyFxNames.getATokenAllowanceForMad],
            stakedPositions: functionResults[prettyFxNames.getStakedAlcaPositions],
            lockedPosition: functionResults[prettyFxNames.getLockedPosition],
        };

        let errChecks = [madBalance, alcaBalance, alcbBalance, alcaMadAllowance, stakedPositions, lockedPosition];

        for (let errCheck of errChecks) {
            if (errCheck.error) {
                console.error("BalanceContextError: " + String(errCheck.error));
            }
        }

        // Construct newBalances object
        const newBalances = {
            alca: alcaBalance.error ? { error: alcaBalance.error } : alcaBalance.toString(),
            alcb: alcbBalance.error ? { error: alcbBalance.error } : alcbBalance.toString(),
            ethereum: ethAdapter.balances.ethereum, // Should be up to date from the updateEthereumBalanceCall()
            mad: madBalance.error ? { error: madBalance.error } : madBalance.toString(),
        };

        // Construct newAllowances object
        const newAllowances = {
            alca: {},
            alcb: {},
            mad: {
                [ethAdapter.contractConfig.ATOKEN.address]: alcaMadAllowance.error
                    ? { error: alcaMadAllowance.error }
                    : alcaMadAllowance.toString(),
            },
        };

        const newPositions = {
            staked: stakedPositions.error ? { error: stakedPositions.error } : stakedPositions,
            locked: lockedPosition.error ? { error: lockedPosition.error } : lockedPosition,
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
            positions: {
                lockedPosition: newPositions.locked,
                staked: newPositions.staked,
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
            await sleep(10000);
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

//////////////////////////////
// Pretty Promise Resolver //
////////////////////////////

async function resolveBalancePromiseFunctionsNeatly(promiseFunctions: any[]) {
    const results = {}; // Track neat results for return based on fxName:result
    // Track promises and fxNames in like order
    const promises = [];
    const fxNames = [];
    for (let promiseFx of promiseFunctions) {
        // If the function doesn't exit something is wrong in prettyFunction config above
        let fxName = promiseFx[0];
        let fxArgs = promiseFx[1];
        let fxArr = prettyFunctionIDs[promiseFx[0]];
        let fxToCall = fxArr[1];
        // console.log(fxName, "=>", fxToCall) // For debugging
        if (!fxName || !fxToCall) {
            throw new Error("Check prettyFunctionIDs config, functionName !== givenPrettyName");
        }
        if (typeof fxToCall === "function") {
            fxNames.push(fxName);
            promises.push(fxToCall.apply(null, fxArgs));
        }
    }
    // // Resolve all of the promises syncronously
    let resolved = await Promise.all(promises);
    // For each result assign to resolved with fxName of matching idx
    for (let i = 0; i < resolved.length; i++) {
        results[fxNames[i]] = resolved[i];
    }
    // Return them in neat format
    return results;
}

////////////////////////////////////////////
// Functions for balance resolving below //
//////////////////////////////////////////

async function getMadBalance(ethAdapter, address) {
    try {
        let res = await ethAdapter.contractMethods.MADTOKEN.balanceOf_view_IN1_OUT1({
            _owner: address,
        });
        return ethAdapter.ethers.utils.formatEther(res);
    } catch (ex) {
        return { error: "getMadBalance(): " + String(ex.message) };
    }
}

async function getATokenAllowanceForMad(ethAdapter, address) {
    try {
        let aTokenAddress = await ethAdapter?.contractConfig?.ATOKEN?.address; // UPDATE eth-adapter and get ATOken address from the newly exposed config
        if (!aTokenAddress) {
            throw new Error(
                "Unable to determine AToken address from passed ethAdapter. Make sure ethAdapter.contractConfig is populating"
            );
        }
        let allowance = await ethAdapter.contractMethods.MADTOKEN.allowance_view_IN2_OUT1({
            _owner: address,
            _spender: aTokenAddress,
        });
        return ethAdapter.ethers.utils.formatEther(allowance);
    } catch (ex) {
        return { error: "getATokenAllowanceForMad(): " + String(ex.message) };
    }
}

async function getAlcaBalance(ethAdapter, address) {
    try {
        let res = await ethAdapter.contractMethods.ATOKEN.balanceOf_view_IN1_OUT1({
            account: address,
        });
        return ethAdapter.ethers.utils.formatEther(res);
    } catch (ex) {
        return { error: "getAlcaBalance(): " + String(ex.message) };
    }
}

async function getAlcbBalance(ethAdapter, address) {
    try {
        let res = await ethAdapter.contractMethods.BTOKEN.balanceOf_view_IN1_OUT1({
            account: address,
        });
        return ethAdapter.ethers.utils.formatEther(res);
    } catch (ex) {
        return { error: "getAlcbBalance(): " + String(ex.message) };
    }
}
////////////////////////////////////
// ALCA STAKED POSITION FETCHING // -- If marked with _ function must fall under a try catch that returns error:msg
//////////////////////////////////

async function getStakedAlcaPositions(ethAdapter, address) {
    try {
        const tokenIds = await _getOwnedPublicStakingTokenIDs(ethAdapter, address);
        const metas = await _getPublicStakingTokenMetadataFromTokenIdArray(ethAdapter, tokenIds);
        let positions = [];
        // Construct and parse positions
        for (let meta of metas) {
            positions.push({
                tokenId: meta.tokenId.toString(),
                shares: ethAdapter.ethers.utils.formatEther(meta.shares),
                ethRewards: ethAdapter.ethers.utils.formatEther(meta.ethRewards.toString()),
                alcaRewards: ethAdapter.ethers.utils.formatEther(meta.alcaRewards.toString()),
            });
        }
        return positions;
    } catch (ex) {
        return { error: "getStakedAlcaPositions(): " + String(ex.message) };
    }
}

async function _getOwnedPublicStakingTokenIDs(ethAdapter, address) {
    const tokenIds = [];
    let fetching = true;
    let index = 0;
    while (fetching) {
        let tokenId = await ethAdapter.contractMethods.PUBLICSTAKING.tokenOfOwnerByIndex_view_IN2_OUT1({
            owner: address,
            index: index,
        });
        if (tokenId.error) {
            fetching = false;
            break;
        }
        if (tokenId) tokenIds.push(tokenId);
        index++;
    }
    return tokenIds;
}

async function _getPublicStakingTokenMetadataFromTokenIdArray(ethAdapter, tokenIds) {
    const meta = [];
    for (let id of tokenIds) {
        const metadata = await ethAdapter.contractMethods.PUBLICSTAKING.tokenURI_view_IN1_OUT1({
            tokenID_: id,
        });
        if (metadata.error) {
            throw new Error(metadata.error);
        }
        const { attributes } = parsePublicStakingTokenMetaData(metadata);
        const shares = findPublicStakingTokenAttributeByName(attributes, "Shares");
        const ethRewards = await _estimatePublicStakingRewardEthCollection(ethAdapter, id);
        const alcaRewards = await _estimatePublicStakingRewardAlcaCollection(ethAdapter, id);
        meta.push({ tokenId: id, shares: shares.value, ethRewards, alcaRewards });
    }
    return meta;
}

async function _estimatePublicStakingRewardEthCollection(ethAdapter, tokenId) {
    return await ethAdapter.contractMethods.PUBLICSTAKING.estimateEthCollection_view_IN1_OUT1({
        tokenID_: tokenId,
    });
}

async function _estimatePublicStakingRewardAlcaCollection(ethAdapter, tokenId) {
    return await ethAdapter.contractMethods.PUBLICSTAKING.estimateTokenCollection_view_IN1_OUT1({
        tokenID_: tokenId,
    });
}

async function _getPublicStakingPosition(ethAdapter, tokenId) {
    return await ethAdapter.contractMethods.PUBLICSTAKING.getPosition_view_IN1_OUT5({
        tokenID_: tokenId,
    });
}

/////////////////////////////////
// ALCA LOCKED POSITION FETCH //
///////////////////////////////

async function getLockedPosition(ethAdapter, address) {
    try {
        const tokenId = await _getLockedPositionTokenIdForAddress(ethAdapter, address);
        const { payoutEth = 0, payoutToken = 0 } =
            tokenId > 0 ? await _estimateLockedPositionProfits(ethAdapter, tokenId) : {};
        const { shares = 0 } = tokenId > 0 ? await _getPublicStakingPosition(ethAdapter, tokenId) : 0;
        const end = await ethAdapter.contractMethods.LOCKUP.getLockupEndBlock_view_IN0_OUT1();
        const blockNumber = await ethAdapter.provider.getBlockNumber();
        const SCALING_FACTOR = await ethAdapter.contractMethods.LOCKUP.SCALING_FACTOR_view_IN0_OUT1();
        const FRACTION_RESERVED = await ethAdapter.contractMethods.LOCKUP.FRACTION_RESERVED_view_IN0_OUT1();
        const penalty = ethAdapter.ethers.BigNumber.from(FRACTION_RESERVED).mul(100).div(SCALING_FACTOR);
        const remainingRewards = 100 - penalty;

        return {
            lockedAlca: ethAdapter.ethers.utils.formatEther(shares),
            payoutEth: ethAdapter.ethers.utils.formatEther(payoutEth),
            payoutToken: ethAdapter.ethers.utils.formatEther(payoutToken),
            tokenId: tokenId.toString(),
            lockupPeriod: ethAdapter.ethers.BigNumber.from(end).gt(blockNumber) ? "LOCKED" : "END",
            penalty: penalty.toString(),
            blockUntilUnlock: ethAdapter.ethers.BigNumber.from(end).sub(blockNumber).toString(),
            remainingRewards,
        };
    } catch (ex) {
        return { error: "getLockedPosition(): " + String(ex.message) };
    }
}

async function _getLockedPositionTokenIdForAddress(ethAdapter, address) {
    return ethAdapter.contractMethods.LOCKUP.tokenOf_view_IN1_OUT1({
        acct_: address,
    });
}

async function _estimateLockedPositionProfits(ethAdapter, tokenId) {
    return await ethAdapter.contractMethods.LOCKUP.estimateProfits_view_IN1_OUT2({
        tokenID_: tokenId,
    });
}

/////////////////////
// Util Functions //
///////////////////

function findPublicStakingTokenAttributeByName(attributes, attributeName) {
    return attributes && attributes.length && attributes.find((item) => item.trait_type === attributeName);
}

function parsePublicStakingTokenMetaData(metadata) {
    const [, encodedMetaData] = metadata.split("data:application/json;utf8,");
    return encodedMetaData ? JSON.parse(encodedMetaData) : {};
}
