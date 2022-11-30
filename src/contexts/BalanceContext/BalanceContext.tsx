import React from "react";

/**
 * @typedef ContractValue - A value/error object - Holds the state value if no errors hit while obtaining, else error will be populated
 * @property { string | false } error - "" if no error, or string if errors occcured in getting the value
 * @property { any } value - The context state value, will be false if error has occurred
 */
type GenericContextValue = {
    error: string | false,
    value: any
}

type StakedContextValue = GenericContextValue & {
    value: StakedPosition[]
}

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
    alcaReward: string,
    ethReward: string,
    exists: boolean,
    lockedAlca: string,
    lockupPeriod: string,
    penalty: string,
    remainingRewards: string,
    tokenId: string,
    unlockDate: string,
}

/**
 * @typedef { Object } StakedPosition - A Staked Position Object
 * @property { string } tokenId - The tokenId of the staked position
 * @property { string } shares - The number of shares(tokens) a position represents
 * @property { string } ethRewards - The amount of claimable eth rewards on the position
 * @property { string } alcaRewards - The amount of claimable alca rewards on the position
 */
type StakedPosition = {
    tokenId: string,
    shares: string,
    ethRewards: string,
    alcaRewards: string
}

type ContextState = {
    trackedAddress: string,
    allowances: object,
    balances: {
        alca: GenericContextValue,
        alcb: GenericContextValue,
        mad: GenericContextValue,
        ethereum: GenericContextValue
    },
    positions: {
        staked: GenericContextValue
        lockedPosition: LockedPosition
    },
    updateBalances: Function
}

const defaultLockedPosition: LockedPosition = {
    alcaReward: "n/a",
    ethReward: "n/a",
    exists: false,
    lockedAlca: "n/a",
    lockupPeriod: "ENROLLMENT" || "STARTED" || "ENDED",
    penalty: "n/a",
    remainingRewards: "n/a",
    tokenId: "n/a",
    unlockDate: "n/a",
}

const defaultContextState: ContextState = {
    trackedAddress: "n/a",
    // Balance of allowance for (x) contract
    allowances: {
        alca: {
            // 0x0: <allowance>
        },
        alcb: {
            // 0x0: <allowance>
        },
        mad: {
            // 0x0: <allowance>
        },
    },
    // Balance of token for connected listener address
    balances: {
        alca: { value: "n/a", error: false },
        alcb: { value: "n/a", error: false },
        ethereum: { value: "n/a", error: false },
        mad: { value: "n/a", error: false }
    },
    positions: {
        staked: { value: [], error: false },
        lockedPosition: { ...defaultLockedPosition }
    },
    /**
     * @param {EthAdapter} ethAdapter - Ethereum adapter to be used from eth-adapter package
     */
    updateBalances: (ethAdapter) => { },
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
    getAlcaAllowanceForStakeRouter: "getAlcaAllowanceForStakeRouter",
    getMadAllowanceForStakeRouter: "getMadAllowanceForStakeRouter"
};

// Pretty function name => [functionName, functionObject]
const prettyFunctionIDs = {
    [prettyFxNames.getMadBalance]: [prettyFxNames.getMadBalance, getMadBalance],
    [prettyFxNames.getAlcaBalance]: [prettyFxNames.getAlcaBalance, getAlcaBalance],
    [prettyFxNames.getAlcbBalance]: [prettyFxNames.getAlcbBalance, getAlcbBalance],
    [prettyFxNames.getATokenAllowanceForMad]: [prettyFxNames.getATokenAllowanceForMad, getATokenAllowanceForMad],
    [prettyFxNames.getStakedAlcaPositions]: [prettyFxNames.getStakedAlcaPositions, getStakedAlcaPositions],
    [prettyFxNames.getLockedPosition]: [prettyFxNames.getLockedPosition, getLockedPosition],
    [prettyFxNames.getAlcaAllowanceForStakeRouter]: [prettyFxNames.getAlcaAllowanceForStakeRouter, getAlcaAllowanceForStakeRouter],
    [prettyFxNames.getMadAllowanceForStakeRouter]: [prettyFxNames.getMadAllowanceForStakeRouter, getMadAllowanceForStakeRouter],
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
        await ethAdapter.updateEthereumBalance()

        const updateAllAddressesFromFactory = async () => {
            let cSalts = ["ALCA", "ALCB", "PublicStaking", "Lockup", "ValidatorStaking", "StakingRouterV1"];
            for (let cSalt of cSalts) {
                let addressFromFactory = await ethAdapter.contractMethods.FACTORY.lookup_view_IN1_OUT1({
                    salt_: ethAdapter.ethers.utils.formatBytes32String(cSalt),
                });
                ethAdapter.contractConfig[cSalt.toUpperCase()].address = addressFromFactory;
            }
        };

        await updateAllAddressesFromFactory();

        // Get legacy token address and update it to the MadToken contract
        let legacyTokenContractAddress = await ethAdapter.contractMethods.ALCA.getLegacyTokenAddress_view_IN0_OUT1()
        ethAdapter.contractConfig["MADTOKEN"].address = legacyTokenContractAddress;

        // Get the BToken contract address and update contractConfig on ethAdapter if it's set to 0x0
        if (ethAdapter.contractConfig["ALCB"].address === "0x0") {
            console.warn("BToken was set to 0x0... using Factory.lookup() to populate ALCB address.");
            let bTokenAddress = await ethAdapter.contractMethods.FACTORY.lookup_view_IN1_OUT1({
                salt_: ethAdapter.ethers.utils.formatBytes32String("BToken"),
            });
            ethAdapter.contractConfig["ALCB"].address = bTokenAddress;
        }

        // Setup pretty function resolution
        let functionResults = await resolveBalancePromiseFunctionsNeatly([
            [prettyFxNames.getMadBalance, [ethAdapter, address]],
            [prettyFxNames.getAlcaBalance, [ethAdapter, address]],
            [prettyFxNames.getAlcbBalance, [ethAdapter, address]],
            [prettyFxNames.getATokenAllowanceForMad, [ethAdapter, address]],
            [prettyFxNames.getStakedAlcaPositions, [ethAdapter, address]],
            [prettyFxNames.getLockedPosition, [ethAdapter, address]],
            [prettyFxNames.getAlcaAllowanceForStakeRouter, [ethAdapter, address]],
            [prettyFxNames.getMadAllowanceForStakeRouter, [ethAdapter, address]],
        ]);

        // Assign them as needed
        let { madBalance, alcaBalance, alcbBalance, alcaMadAllowance, stakedPositions, lockedPosition, alcaRouterAllowance, madRouterAllowance } = {
            alcaBalance: functionResults[prettyFxNames.getAlcaBalance],
            alcbBalance: functionResults[prettyFxNames.getAlcbBalance],
            madBalance: functionResults[prettyFxNames.getMadBalance],
            alcaMadAllowance: functionResults[prettyFxNames.getATokenAllowanceForMad],
            stakedPositions: functionResults[prettyFxNames.getStakedAlcaPositions],
            lockedPosition: functionResults[prettyFxNames.getLockedPosition],
            alcaRouterAllowance: functionResults[prettyFxNames.getAlcaAllowanceForStakeRouter],
            madRouterAllowance: functionResults[prettyFxNames.getMadAllowanceForStakeRouter]
        };

        let errChecks = [madBalance, alcaBalance, alcbBalance, alcaMadAllowance, stakedPositions, lockedPosition];

        for (let errCheck of errChecks) {
            if (errCheck.error) {
                console.error("BalanceContextError: " + String(errCheck.error));
            }
        }

        // Construct newBalances object
        const newBalances = {
            alca: alcaBalance,
            alcb: alcbBalance,
            ethereum: { error: false, value: ethAdapter.balances.ethereum }, // Should be up to date from the updateEthereumBalanceCall()
            mad: madBalance,
        };

        // Construct newAllowances object
        const newAllowances = {
            alca: {
                [ethAdapter.contractConfig.STAKINGROUTERV1.address]: alcaRouterAllowance
            },
            alcb: {

            },
            mad: {
                [ethAdapter.contractConfig.ALCA.address]: alcaMadAllowance,
                [ethAdapter.contractConfig.STAKINGROUTERV1.address]: madRouterAllowance,
            },
        };

        const newPositions = {
            staked: stakedPositions,
            locked: lockedPosition,
        };

        // Messy to type out with the Promise handler above left as is for now
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

function generateContextValueResponse(error: boolean | string, value: any = "err"): GenericContextValue {
    return {
        error: !!error ? String(error) : false,
        value: value
    }
}

async function resolveBalancePromiseFunctionsNeatly(promiseFunctions: any[]): Promise<any> {
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

async function getMadBalance(ethAdapter: any, address: string): Promise<GenericContextValue> {
    try {
        let res = await ethAdapter.contractMethods.MADTOKEN.balanceOf_view_IN1_OUT1({
            _owner: address,
        });
        return generateContextValueResponse(false, ethAdapter.ethers.utils.formatEther(res))
    } catch (ex) {
        return generateContextValueResponse("getMadBalance(): " + ex.message)
    }
}

async function getATokenAllowanceForMad(ethAdapter: any, address: string): Promise<GenericContextValue> {
    try {
        let aTokenAddress = await ethAdapter?.contractConfig?.ALCA?.address; // UPDATE eth-adapter and get ATOken address from the newly exposed config
        if (!aTokenAddress) {
            throw new Error(
                "Unable to determine AToken address from passed ethAdapter. Make sure ethAdapter.contractConfig is populating"
            );
        }
        let allowance = await ethAdapter.contractMethods.MADTOKEN.allowance_view_IN2_OUT1({
            _owner: address,
            _spender: aTokenAddress,
        });
        return generateContextValueResponse(false, ethAdapter.ethers.utils.formatEther(allowance))
    } catch (ex) {
        return generateContextValueResponse("getATokenAllowanceForMad(): " + ex.message)
    }
}

async function getAlcaBalance(ethAdapter: any, address: string): Promise<GenericContextValue> {
    try {
        let res = await ethAdapter.contractMethods.ALCA.balanceOf_view_IN1_OUT1({
            account: address,
        });
        return generateContextValueResponse(false, ethAdapter.ethers.utils.formatEther(res))
    } catch (ex) {
        return generateContextValueResponse("getAlcaBalance(): " + ex.message)
    }
}

async function getAlcbBalance(ethAdapter: any, address: string): Promise<GenericContextValue> {
    try {
        let res = await ethAdapter.contractMethods.ALCB.balanceOf_view_IN1_OUT1({
            account: address,
        });
        return generateContextValueResponse(false, ethAdapter.ethers.utils.formatEther(res))
    } catch (ex) {
        return generateContextValueResponse("getAlcbBalance(): " + ex.message);
    }
}
////////////////////////////////////
// ALCA STAKED POSITION FETCHING // -- If marked with _ function must fall under a try catch that returns error:msg
//////////////////////////////////

async function getStakedAlcaPositions(ethAdapter: any, address: string): Promise<GenericContextValue> {
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
        return generateContextValueResponse(false, positions)
    } catch (ex) {
        return generateContextValueResponse("getStakedAlcaPositions(): " + ex.message);
    }
}

async function _getOwnedPublicStakingTokenIDs(ethAdapter: any, address: string): Promise<string[]> {
    const tokenIds: string[] = [];
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

async function _getPublicStakingTokenMetadataFromTokenIdArray(ethAdapter: any, tokenIds: string[]): Promise<any[]> {
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

async function _estimatePublicStakingRewardEthCollection(ethAdapter: any, tokenId: string): Promise<string> {
    return await ethAdapter.contractMethods.PUBLICSTAKING.estimateEthCollection_view_IN1_OUT1({
        tokenID_: tokenId,
    });
}

async function _estimatePublicStakingRewardAlcaCollection(ethAdapter: any, tokenId: string): Promise<string> {
    return await ethAdapter.contractMethods.PUBLICSTAKING.estimateTokenCollection_view_IN1_OUT1({
        tokenID_: tokenId,
    });
}

async function _getPublicStakingPosition(ethAdapter: any, tokenId: string) {
    return await ethAdapter.contractMethods.PUBLICSTAKING.getPosition_view_IN1_OUT5({
        tokenID_: tokenId,
    });
}

/////////////////////////////////
// ALCA LOCKED POSITION FETCH //
///////////////////////////////

async function getLockedPosition(ethAdapter, address): Promise<GenericContextValue> {

    const getDiffInMonths = (startdate, endDate) => {
        let months = (endDate.getFullYear() - startdate.getFullYear()) * 12;
        months -= startdate.getMonth();
        months += endDate.getMonth();
        return months <= 0 ? 0 : months;
    }

    try {
        const tokenId = await _getLockedPositionTokenIdForAddress(ethAdapter, address);
        const { payoutEth = 0, payoutToken = 0 } =
            tokenId > 0 ? await _estimateLockedPositionProfits(ethAdapter, tokenId) : {};
        const { shares = 0 } = tokenId > 0 ? await _getPublicStakingPosition(ethAdapter, tokenId) : 0;
        const start = await ethAdapter.contractMethods.LOCKUP.getLockupStartBlock_view_IN0_OUT1();
        const end = await ethAdapter.contractMethods.LOCKUP.getLockupEndBlock_view_IN0_OUT1();
        const blockNumber = await ethAdapter.provider.getBlockNumber();
        const SCALING_FACTOR = await ethAdapter.contractMethods.LOCKUP.SCALING_FACTOR_view_IN0_OUT1();
        const FRACTION_RESERVED = await ethAdapter.contractMethods.LOCKUP.FRACTION_RESERVED_view_IN0_OUT1();
        const penalty = ethAdapter.ethers.BigNumber.from(FRACTION_RESERVED).mul(100).div(SCALING_FACTOR);
        const remainingRewards = 100 - penalty;

        // Get rough time data using ETH block interval of 13.5
        const lockupTimestamp = ethAdapter.ethers.BigNumber.from(end).sub(start).toString() * 13.5;
        const endDate = new Date(new Date().getTime() + lockupTimestamp * 1000);
        const months = getDiffInMonths(new Date(), endDate);

        const lockupPeriodDefinition = (() => {
            const BN = num => ethAdapter.ethers.BigNumber.from(num);
            if (BN(blockNumber).lt(BN(start))) {
                return "ENROLLMENT"
            }
            else if (BN(blockNumber).gt(BN(end))) {
                return "ENDED"
            }
            else {
                return "STARTED"
            }
        })()

        return generateContextValueResponse(false, {
            lockedAlca: ethAdapter.ethers.utils.formatEther(shares),
            payoutEth: ethAdapter.ethers.utils.formatEther(payoutEth),
            payoutToken: ethAdapter.ethers.utils.formatEther(payoutToken),
            tokenId: tokenId.toString(),
            lockupPeriod: lockupPeriodDefinition,
            lockupPeriodInMonths: months,
            penalty: penalty.toString(),
            blockUntilUnlock: ethAdapter.ethers.BigNumber.from(end).sub(blockNumber).toString(),
            remainingRewards,
        })
    } catch (ex) {
        return generateContextValueResponse("getLockedPosition()" + ex.message);
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


////////////////////////
// ROUTER ALLOWANCES //
//////////////////////

// Staked Allowanced
async function getAlcaAllowanceForStakeRouter(ethAdapter: any, address: string): Promise<GenericContextValue> {
    try {
        let publicStakingAddress = await ethAdapter?.contractConfig?.STAKINGROUTERV1?.address; // UPDATE eth-adapter and get ATOken address from the newly exposed config
        if (!publicStakingAddress) {
            throw new Error(
                "Unable to determine STAKINGROUTERV1 address from passed ethAdapter. Make sure ethAdapter.contractConfig is populating"
            );
        }
        let allowance = await ethAdapter.contractMethods.ALCA.allowance_view_IN2_OUT1({
            owner: address,
            spender: publicStakingAddress,
        });
        return generateContextValueResponse(false, ethAdapter.ethers.utils.formatEther(allowance))
    } catch (ex) {
        return generateContextValueResponse("getAlcaAllowanceForStakeRouter(): " + ex.message);
    }
}

async function getMadAllowanceForStakeRouter(ethAdapter: any, address: string) {
    try {
        let publicStakingAddress = await ethAdapter?.contractConfig?.STAKINGROUTERV1?.address; // UPDATE eth-adapter and get ATOken address from the newly exposed config
        if (!publicStakingAddress) {
            throw new Error(
                "Unable to determine STAKINGROUTERV1 address from passed ethAdapter. Make sure ethAdapter.contractConfig is populating"
            );
        }
        let allowance = await ethAdapter.contractMethods.MADTOKEN.allowance_view_IN2_OUT1({
            _owner: address,
            _spender: publicStakingAddress,
        });
        return generateContextValueResponse(false, ethAdapter.ethers.utils.formatEther(allowance))
    } catch (ex) {
        return generateContextValueResponse("getMadAllowanceForStakeRouter(): " + ex.message)
    }
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
