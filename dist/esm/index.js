import React from 'react';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var _a;
var defaultLockedPosition = {
    alcaReward: "n/a",
    ethReward: "n/a",
    exists: false,
    lockedAlca: "n/a",
    lockupPeriod: "ENROLLMENT"  ,
    penalty: "n/a",
    remainingRewards: "n/a",
    tokenId: "n/a",
    unlockDate: "n/a"
};
var defaultContextState = {
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
        }
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
        lockedPosition: __assign({}, defaultLockedPosition)
    },
    /**
     * @param {EthAdapter} ethAdapter - Ethereum adapter to be used from eth-adapter package
     */
    updateBalances: function (ethAdapter) { }
};
var BalanceContext = React.createContext(defaultContextState);
// Setup sleeper function
var sleep = function (amt) { return new Promise(function (res) { return setTimeout(res, amt); }); };
// Names of functions for readable promise resolving in balance updating -- hardcoded to protect against minify as opposed to FUNCTION.name
var prettyFxNames = {
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
var prettyFunctionIDs = (_a = {},
    _a[prettyFxNames.getMadBalance] = [prettyFxNames.getMadBalance, getMadBalance],
    _a[prettyFxNames.getAlcaBalance] = [prettyFxNames.getAlcaBalance, getAlcaBalance],
    _a[prettyFxNames.getAlcbBalance] = [prettyFxNames.getAlcbBalance, getAlcbBalance],
    _a[prettyFxNames.getATokenAllowanceForMad] = [prettyFxNames.getATokenAllowanceForMad, getATokenAllowanceForMad],
    _a[prettyFxNames.getStakedAlcaPositions] = [prettyFxNames.getStakedAlcaPositions, getStakedAlcaPositions],
    _a[prettyFxNames.getLockedPosition] = [prettyFxNames.getLockedPosition, getLockedPosition],
    _a[prettyFxNames.getAlcaAllowanceForStakeRouter] = [prettyFxNames.getAlcaAllowanceForStakeRouter, getAlcaAllowanceForStakeRouter],
    _a[prettyFxNames.getMadAllowanceForStakeRouter] = [prettyFxNames.getMadAllowanceForStakeRouter, getMadAllowanceForStakeRouter],
    _a);
/**
 * @param {String} addressToTrack -
 * @param {Object[]} children -
 * @param {EthAdapter} ethAdapter - eth-adapter required, must be passed -- Used to check balances
 * @returns
 */
function BalanceContextProvider(_a) {
    var _this = this;
    var children = _a.children, ethAdapter = _a.ethAdapter;
    var _b = React.useState(defaultContextState), contextState = _b[0], setContextState = _b[1];
    var updateBalances = function (ethAdapter) { return __awaiter(_this, void 0, void 0, function () {
        var address, updateAllAddressesFromFactory, legacyTokenContractAddress, bTokenAddress, functionResults, _a, madBalance, alcaBalance, alcbBalance, alcaMadAllowance, stakedPositions, lockedPosition, alcaRouterAllowance, madRouterAllowance, errChecks, _i, errChecks_1, errCheck, newBalances, newAllowances, newPositions;
        var _b, _c;
        var _this = this;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!ethAdapter) {
                        throw new Error("ethAdapter must be passed to updateBalances()!");
                    }
                    address = ethAdapter.connectedAccount;
                    // Get eth balance first
                    return [4 /*yield*/, ethAdapter.updateEthereumBalance()];
                case 1:
                    // Get eth balance first
                    _d.sent();
                    updateAllAddressesFromFactory = function () { return __awaiter(_this, void 0, void 0, function () {
                        var cSalts, _i, cSalts_1, cSalt, addressFromFactory;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    cSalts = ["ALCA", "ALCB", "PublicStaking", "Lockup", "ValidatorStaking", "StakingRouterV1"];
                                    _i = 0, cSalts_1 = cSalts;
                                    _a.label = 1;
                                case 1:
                                    if (!(_i < cSalts_1.length)) return [3 /*break*/, 4];
                                    cSalt = cSalts_1[_i];
                                    return [4 /*yield*/, ethAdapter.contractMethods.FACTORY.lookup_view_IN1_OUT1({
                                            salt_: ethAdapter.ethers.utils.formatBytes32String(cSalt)
                                        })];
                                case 2:
                                    addressFromFactory = _a.sent();
                                    ethAdapter.contractConfig[cSalt.toUpperCase()].address = addressFromFactory;
                                    _a.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, updateAllAddressesFromFactory()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, ethAdapter.contractMethods.ALCA.getLegacyTokenAddress_view_IN0_OUT1()];
                case 3:
                    legacyTokenContractAddress = _d.sent();
                    ethAdapter.contractConfig["MADTOKEN"].address = legacyTokenContractAddress;
                    if (!(ethAdapter.contractConfig["ALCB"].address === "0x0")) return [3 /*break*/, 5];
                    console.warn("BToken was set to 0x0... using Factory.lookup() to populate ALCB address.");
                    return [4 /*yield*/, ethAdapter.contractMethods.FACTORY.lookup_view_IN1_OUT1({
                            salt_: ethAdapter.ethers.utils.formatBytes32String("BToken")
                        })];
                case 4:
                    bTokenAddress = _d.sent();
                    ethAdapter.contractConfig["ALCB"].address = bTokenAddress;
                    _d.label = 5;
                case 5: return [4 /*yield*/, resolveBalancePromiseFunctionsNeatly([
                        [prettyFxNames.getMadBalance, [ethAdapter, address]],
                        [prettyFxNames.getAlcaBalance, [ethAdapter, address]],
                        [prettyFxNames.getAlcbBalance, [ethAdapter, address]],
                        [prettyFxNames.getATokenAllowanceForMad, [ethAdapter, address]],
                        [prettyFxNames.getStakedAlcaPositions, [ethAdapter, address]],
                        [prettyFxNames.getLockedPosition, [ethAdapter, address]],
                        [prettyFxNames.getAlcaAllowanceForStakeRouter, [ethAdapter, address]],
                        [prettyFxNames.getMadAllowanceForStakeRouter, [ethAdapter, address]],
                    ])];
                case 6:
                    functionResults = _d.sent();
                    _a = {
                        alcaBalance: functionResults[prettyFxNames.getAlcaBalance],
                        alcbBalance: functionResults[prettyFxNames.getAlcbBalance],
                        madBalance: functionResults[prettyFxNames.getMadBalance],
                        alcaMadAllowance: functionResults[prettyFxNames.getATokenAllowanceForMad],
                        stakedPositions: functionResults[prettyFxNames.getStakedAlcaPositions],
                        lockedPosition: functionResults[prettyFxNames.getLockedPosition],
                        alcaRouterAllowance: functionResults[prettyFxNames.getAlcaAllowanceForStakeRouter],
                        madRouterAllowance: functionResults[prettyFxNames.getMadAllowanceForStakeRouter]
                    }, madBalance = _a.madBalance, alcaBalance = _a.alcaBalance, alcbBalance = _a.alcbBalance, alcaMadAllowance = _a.alcaMadAllowance, stakedPositions = _a.stakedPositions, lockedPosition = _a.lockedPosition, alcaRouterAllowance = _a.alcaRouterAllowance, madRouterAllowance = _a.madRouterAllowance;
                    errChecks = [madBalance, alcaBalance, alcbBalance, alcaMadAllowance, stakedPositions, lockedPosition];
                    for (_i = 0, errChecks_1 = errChecks; _i < errChecks_1.length; _i++) {
                        errCheck = errChecks_1[_i];
                        if (errCheck.error) {
                            console.error("BalanceContextError: " + String(errCheck.error));
                        }
                    }
                    newBalances = {
                        alca: alcaBalance,
                        alcb: alcbBalance,
                        ethereum: { error: false, value: ethAdapter.balances.ethereum },
                        mad: madBalance
                    };
                    newAllowances = {
                        alca: (_b = {},
                            _b[ethAdapter.contractConfig.STAKINGROUTERV1.address] = alcaRouterAllowance,
                            _b),
                        alcb: {},
                        mad: (_c = {},
                            _c[ethAdapter.contractConfig.ALCA.address] = alcaMadAllowance,
                            _c[ethAdapter.contractConfig.STAKINGROUTERV1.address] = madRouterAllowance,
                            _c)
                    };
                    newPositions = {
                        staked: stakedPositions,
                        locked: lockedPosition
                    };
                    // Messy to type out with the Promise handler above left as is for now
                    setContextState(function (s) { return (__assign(__assign({}, s), { balances: __assign(__assign({}, s.balances), newBalances), allowances: __assign(__assign({}, s.allowances), { alca: __assign(__assign({}, s.allowances.alca), newAllowances.alca), alcb: __assign(__assign({}, s.allowances.alcb), newAllowances.alcb), mad: __assign(__assign({}, s.allowances.mad), newAllowances.mad) }), positions: {
                            lockedPosition: newPositions.locked,
                            staked: newPositions.staked
                        }, trackedAddress: address })); });
                    return [2 /*return*/];
            }
        });
    }); };
    // Setup balance listener that updates state
    React.useEffect(function () {
        var balanceCheckInterval = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!ethAdapter.connectedAccount) {
                            updateBalances(ethAdapter);
                        }
                        return [4 /*yield*/, sleep(10000)];
                    case 1:
                        _a.sent();
                        balanceCheckInterval();
                        return [2 /*return*/];
                }
            });
        }); };
        balanceCheckInterval();
    }, []);
    return (React.createElement(BalanceContext.Provider, { value: __assign(__assign({}, contextState), { updateBalances: updateBalances }) }, children));
}
//////////////////////////////
// Pretty Promise Resolver //
////////////////////////////
function generateContextValueResponse(error, value) {
    if (value === void 0) { value = "err"; }
    return {
        error: !!error ? String(error) : false,
        value: value
    };
}
function resolveBalancePromiseFunctionsNeatly(promiseFunctions) {
    return __awaiter(this, void 0, void 0, function () {
        var results, promises, fxNames, _i, promiseFunctions_1, promiseFx, fxName, fxArgs, fxArr, fxToCall, resolved, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    results = {};
                    promises = [];
                    fxNames = [];
                    for (_i = 0, promiseFunctions_1 = promiseFunctions; _i < promiseFunctions_1.length; _i++) {
                        promiseFx = promiseFunctions_1[_i];
                        fxName = promiseFx[0];
                        fxArgs = promiseFx[1];
                        fxArr = prettyFunctionIDs[promiseFx[0]];
                        fxToCall = fxArr[1];
                        // console.log(fxName, "=>", fxToCall) // For debugging
                        if (!fxName || !fxToCall) {
                            throw new Error("Check prettyFunctionIDs config, functionName !== givenPrettyName");
                        }
                        if (typeof fxToCall === "function") {
                            fxNames.push(fxName);
                            promises.push(fxToCall.apply(null, fxArgs));
                        }
                    }
                    return [4 /*yield*/, Promise.all(promises)];
                case 1:
                    resolved = _a.sent();
                    // For each result assign to resolved with fxName of matching idx
                    for (i = 0; i < resolved.length; i++) {
                        results[fxNames[i]] = resolved[i];
                    }
                    // Return them in neat format
                    return [2 /*return*/, results];
            }
        });
    });
}
////////////////////////////////////////////
// Functions for balance resolving below //
//////////////////////////////////////////
function getMadBalance(ethAdapter, address) {
    return __awaiter(this, void 0, void 0, function () {
        var res, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, ethAdapter.contractMethods.MADTOKEN.balanceOf_view_IN1_OUT1({
                            _owner: address
                        })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, generateContextValueResponse(false, ethAdapter.ethers.utils.formatEther(res))];
                case 2:
                    ex_1 = _a.sent();
                    return [2 /*return*/, generateContextValueResponse("getMadBalance(): " + ex_1.message)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getATokenAllowanceForMad(ethAdapter, address) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var aTokenAddress, allowance, ex_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, ((_b = (_a = ethAdapter === null || ethAdapter === void 0 ? void 0 : ethAdapter.contractConfig) === null || _a === void 0 ? void 0 : _a.ALCA) === null || _b === void 0 ? void 0 : _b.address)];
                case 1:
                    aTokenAddress = _c.sent();
                    if (!aTokenAddress) {
                        throw new Error("Unable to determine AToken address from passed ethAdapter. Make sure ethAdapter.contractConfig is populating");
                    }
                    return [4 /*yield*/, ethAdapter.contractMethods.MADTOKEN.allowance_view_IN2_OUT1({
                            _owner: address,
                            _spender: aTokenAddress
                        })];
                case 2:
                    allowance = _c.sent();
                    return [2 /*return*/, generateContextValueResponse(false, ethAdapter.ethers.utils.formatEther(allowance))];
                case 3:
                    ex_2 = _c.sent();
                    return [2 /*return*/, generateContextValueResponse("getATokenAllowanceForMad(): " + ex_2.message)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getAlcaBalance(ethAdapter, address) {
    return __awaiter(this, void 0, void 0, function () {
        var res, ex_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, ethAdapter.contractMethods.ALCA.balanceOf_view_IN1_OUT1({
                            account: address
                        })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, generateContextValueResponse(false, ethAdapter.ethers.utils.formatEther(res))];
                case 2:
                    ex_3 = _a.sent();
                    return [2 /*return*/, generateContextValueResponse("getAlcaBalance(): " + ex_3.message)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getAlcbBalance(ethAdapter, address) {
    return __awaiter(this, void 0, void 0, function () {
        var res, ex_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, ethAdapter.contractMethods.ALCB.balanceOf_view_IN1_OUT1({
                            account: address
                        })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, generateContextValueResponse(false, ethAdapter.ethers.utils.formatEther(res))];
                case 2:
                    ex_4 = _a.sent();
                    return [2 /*return*/, generateContextValueResponse("getAlcbBalance(): " + ex_4.message)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
////////////////////////////////////
// ALCA STAKED POSITION FETCHING // -- If marked with _ function must fall under a try catch that returns error:msg
//////////////////////////////////
function getStakedAlcaPositions(ethAdapter, address) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenIds, metas, positions, _i, metas_1, meta, ex_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, _getOwnedPublicStakingTokenIDs(ethAdapter, address)];
                case 1:
                    tokenIds = _a.sent();
                    return [4 /*yield*/, _getPublicStakingTokenMetadataFromTokenIdArray(ethAdapter, tokenIds)];
                case 2:
                    metas = _a.sent();
                    positions = [];
                    // Construct and parse positions
                    for (_i = 0, metas_1 = metas; _i < metas_1.length; _i++) {
                        meta = metas_1[_i];
                        positions.push({
                            tokenId: meta.tokenId.toString(),
                            shares: ethAdapter.ethers.utils.formatEther(meta.shares),
                            claimRewardsAfter: meta.claimRewardsAfter.value,
                            unstakePositionAfter: meta.unstakeAfter.value,
                            ethRewards: ethAdapter.ethers.utils.formatEther(meta.ethRewards.toString()),
                            alcaRewards: ethAdapter.ethers.utils.formatEther(meta.alcaRewards.toString())
                        });
                    }
                    return [2 /*return*/, generateContextValueResponse(false, positions)];
                case 3:
                    ex_5 = _a.sent();
                    return [2 /*return*/, generateContextValueResponse("getStakedAlcaPositions(): " + ex_5.message)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function _getOwnedPublicStakingTokenIDs(ethAdapter, address) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenIds, fetching, index, tokenId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenIds = [];
                    fetching = true;
                    index = 0;
                    _a.label = 1;
                case 1:
                    if (!fetching) return [3 /*break*/, 3];
                    return [4 /*yield*/, ethAdapter.contractMethods.PUBLICSTAKING.tokenOfOwnerByIndex_view_IN2_OUT1({
                            owner: address,
                            index: index
                        })];
                case 2:
                    tokenId = _a.sent();
                    if (tokenId.error) {
                        fetching = false;
                        return [3 /*break*/, 3];
                    }
                    if (tokenId)
                        tokenIds.push(tokenId);
                    index++;
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, tokenIds];
            }
        });
    });
}
function _getPublicStakingTokenMetadataFromTokenIdArray(ethAdapter, tokenIds) {
    return __awaiter(this, void 0, void 0, function () {
        var meta, _i, tokenIds_1, id, metadata, attributes, shares, unstakeAfter, claimRewardsAfter, ethRewards, alcaRewards;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    meta = [];
                    _i = 0, tokenIds_1 = tokenIds;
                    _a.label = 1;
                case 1:
                    if (!(_i < tokenIds_1.length)) return [3 /*break*/, 6];
                    id = tokenIds_1[_i];
                    return [4 /*yield*/, ethAdapter.contractMethods.PUBLICSTAKING.tokenURI_view_IN1_OUT1({
                            tokenID_: id
                        })];
                case 2:
                    metadata = _a.sent();
                    if (metadata.error) {
                        throw new Error(metadata.error);
                    }
                    attributes = parsePublicStakingTokenMetaData(metadata).attributes;
                    shares = findPublicStakingTokenAttributeByName(attributes, "Shares");
                    unstakeAfter = findPublicStakingTokenAttributeByName(attributes, "Free After");
                    claimRewardsAfter = findPublicStakingTokenAttributeByName(attributes, "Withdraw Free After");
                    return [4 /*yield*/, _estimatePublicStakingRewardEthCollection(ethAdapter, id)];
                case 3:
                    ethRewards = _a.sent();
                    return [4 /*yield*/, _estimatePublicStakingRewardAlcaCollection(ethAdapter, id)];
                case 4:
                    alcaRewards = _a.sent();
                    meta.push({ tokenId: id, shares: shares.value, unstakeAfter: unstakeAfter, claimRewardsAfter: claimRewardsAfter, ethRewards: ethRewards, alcaRewards: alcaRewards });
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, meta];
            }
        });
    });
}
function _estimatePublicStakingRewardEthCollection(ethAdapter, tokenId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.PUBLICSTAKING.estimateEthCollection_view_IN1_OUT1({
                        tokenID_: tokenId
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function _estimatePublicStakingRewardAlcaCollection(ethAdapter, tokenId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.PUBLICSTAKING.estimateTokenCollection_view_IN1_OUT1({
                        tokenID_: tokenId
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function _getPublicStakingPosition(ethAdapter, tokenId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.PUBLICSTAKING.getPosition_view_IN1_OUT5({
                        tokenID_: tokenId
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/////////////////////////////////
// ALCA LOCKED POSITION FETCH //
///////////////////////////////
function getLockedPosition(ethAdapter, address) {
    return __awaiter(this, void 0, void 0, function () {
        var getDiffInMonths, tokenId, _a, _b, payoutEth, _c, payoutToken, _d, _e, shares, _f, start_1, end_1, blockNumber_1, SCALING_FACTOR, FRACTION_RESERVED, penalty, remainingRewards, lockupTimestamp, endDate, months, lockupPeriodDefinition, ex_6;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    getDiffInMonths = function (startdate, endDate) {
                        var months = (endDate.getFullYear() - startdate.getFullYear()) * 12;
                        months -= startdate.getMonth();
                        months += endDate.getMonth();
                        return months <= 0 ? 0 : months;
                    };
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 14, , 15]);
                    return [4 /*yield*/, _getLockedPositionTokenIdForAddress(ethAdapter, address)];
                case 2:
                    tokenId = _g.sent();
                    if (!(tokenId > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, _estimateLockedPositionProfits(ethAdapter, tokenId)];
                case 3:
                    _d = _g.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _d = {};
                    _g.label = 5;
                case 5:
                    _a = _d, _b = _a.payoutEth, payoutEth = _b === void 0 ? 0 : _b, _c = _a.payoutToken, payoutToken = _c === void 0 ? 0 : _c;
                    if (!(tokenId > 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, _getPublicStakingPosition(ethAdapter, tokenId)];
                case 6:
                    _f = _g.sent();
                    return [3 /*break*/, 8];
                case 7:
                    _f = 0;
                    _g.label = 8;
                case 8:
                    _e = (_f).shares, shares = _e === void 0 ? 0 : _e;
                    return [4 /*yield*/, ethAdapter.contractMethods.LOCKUP.getLockupStartBlock_view_IN0_OUT1()];
                case 9:
                    start_1 = _g.sent();
                    return [4 /*yield*/, ethAdapter.contractMethods.LOCKUP.getLockupEndBlock_view_IN0_OUT1()];
                case 10:
                    end_1 = _g.sent();
                    return [4 /*yield*/, ethAdapter.provider.getBlockNumber()];
                case 11:
                    blockNumber_1 = _g.sent();
                    return [4 /*yield*/, ethAdapter.contractMethods.LOCKUP.SCALING_FACTOR_view_IN0_OUT1()];
                case 12:
                    SCALING_FACTOR = _g.sent();
                    return [4 /*yield*/, ethAdapter.contractMethods.LOCKUP.FRACTION_RESERVED_view_IN0_OUT1()];
                case 13:
                    FRACTION_RESERVED = _g.sent();
                    penalty = ethAdapter.ethers.BigNumber.from(FRACTION_RESERVED).mul(100).div(SCALING_FACTOR);
                    remainingRewards = 100 - penalty;
                    lockupTimestamp = ethAdapter.ethers.BigNumber.from(end_1).sub(start_1).toString() * 13.5;
                    endDate = new Date(new Date().getTime() + lockupTimestamp * 1000);
                    months = getDiffInMonths(new Date(), endDate);
                    lockupPeriodDefinition = (function () {
                        var BN = function (num) { return ethAdapter.ethers.BigNumber.from(num); };
                        if (BN(blockNumber_1).lt(BN(start_1))) {
                            return "ENROLLMENT";
                        }
                        else if (BN(blockNumber_1).gt(BN(end_1))) {
                            return "ENDED";
                        }
                        else {
                            return "STARTED";
                        }
                    })();
                    return [2 /*return*/, generateContextValueResponse(false, {
                            lockedAlca: ethAdapter.ethers.utils.formatEther(shares),
                            payoutEth: ethAdapter.ethers.utils.formatEther(payoutEth),
                            payoutToken: ethAdapter.ethers.utils.formatEther(payoutToken),
                            tokenId: tokenId.toString(),
                            lockupPeriod: lockupPeriodDefinition,
                            lockupPeriodInMonths: months,
                            penalty: penalty.toString(),
                            blockUntilUnlock: ethAdapter.ethers.BigNumber.from(end_1).sub(blockNumber_1).toString(),
                            remainingRewards: remainingRewards
                        })];
                case 14:
                    ex_6 = _g.sent();
                    return [2 /*return*/, generateContextValueResponse("getLockedPosition()" + ex_6.message)];
                case 15: return [2 /*return*/];
            }
        });
    });
}
function _getLockedPositionTokenIdForAddress(ethAdapter, address) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ethAdapter.contractMethods.LOCKUP.tokenOf_view_IN1_OUT1({
                    acct_: address
                })];
        });
    });
}
function _estimateLockedPositionProfits(ethAdapter, tokenId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.LOCKUP.estimateProfits_view_IN1_OUT2({
                        tokenID_: tokenId
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
////////////////////////
// ROUTER ALLOWANCES //
//////////////////////
// Staked Allowanced
function getAlcaAllowanceForStakeRouter(ethAdapter, address) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var publicStakingAddress, allowance, ex_7;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, ((_b = (_a = ethAdapter === null || ethAdapter === void 0 ? void 0 : ethAdapter.contractConfig) === null || _a === void 0 ? void 0 : _a.STAKINGROUTERV1) === null || _b === void 0 ? void 0 : _b.address)];
                case 1:
                    publicStakingAddress = _c.sent();
                    if (!publicStakingAddress) {
                        throw new Error("Unable to determine STAKINGROUTERV1 address from passed ethAdapter. Make sure ethAdapter.contractConfig is populating");
                    }
                    return [4 /*yield*/, ethAdapter.contractMethods.ALCA.allowance_view_IN2_OUT1({
                            owner: address,
                            spender: publicStakingAddress
                        })];
                case 2:
                    allowance = _c.sent();
                    return [2 /*return*/, generateContextValueResponse(false, ethAdapter.ethers.utils.formatEther(allowance))];
                case 3:
                    ex_7 = _c.sent();
                    return [2 /*return*/, generateContextValueResponse("getAlcaAllowanceForStakeRouter(): " + ex_7.message)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getMadAllowanceForStakeRouter(ethAdapter, address) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var publicStakingAddress, allowance, ex_8;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, ((_b = (_a = ethAdapter === null || ethAdapter === void 0 ? void 0 : ethAdapter.contractConfig) === null || _a === void 0 ? void 0 : _a.STAKINGROUTERV1) === null || _b === void 0 ? void 0 : _b.address)];
                case 1:
                    publicStakingAddress = _c.sent();
                    if (!publicStakingAddress) {
                        throw new Error("Unable to determine STAKINGROUTERV1 address from passed ethAdapter. Make sure ethAdapter.contractConfig is populating");
                    }
                    return [4 /*yield*/, ethAdapter.contractMethods.MADTOKEN.allowance_view_IN2_OUT1({
                            _owner: address,
                            _spender: publicStakingAddress
                        })];
                case 2:
                    allowance = _c.sent();
                    return [2 /*return*/, generateContextValueResponse(false, ethAdapter.ethers.utils.formatEther(allowance))];
                case 3:
                    ex_8 = _c.sent();
                    return [2 /*return*/, generateContextValueResponse("getMadAllowanceForStakeRouter(): " + ex_8.message)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/////////////////////
// Util Functions //
///////////////////
function findPublicStakingTokenAttributeByName(attributes, attributeName) {
    return attributes && attributes.length && attributes.find(function (item) { return item.trait_type === attributeName; });
}
function parsePublicStakingTokenMetaData(metadata) {
    var _a = metadata.split("data:application/json;utf8,"), encodedMetaData = _a[1];
    return encodedMetaData ? JSON.parse(encodedMetaData) : {};
}

/**
 * @property {}
 */
var commonEthRequests = {
    /////////////////////////
    // MIGRATION REQUESTS //
    ///////////////////////
    /**
     * Send an approve allowance request for AToken contract to spend X Mad Tokens
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of Mad Tokens to allow
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    migrate_sendMadAllowanceForATokenRequest: function (ethAdapter, unformattedAmount) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.MADTOKEN.approve_nonpayable_IN2_OUT1({
                        _spender: ethAdapter.contractConfig.ALCA.address,
                        _value: ethAdapter.ethers.utils.parseEther(unformattedAmount)
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /**
     * Send a migration amount of MAD => ALCA token for the unformatted amount
     * User must have allowance against AToken contract prior to this request
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of Mad Tokens to allow
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    migrate_sendMigrateRequest: function (ethAdapter, unformattedAmount) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.ALCA.migrate_nonpayable_IN1_OUT1({
                        amount: ethAdapter.ethers.utils.parseEther(unformattedAmount)
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    ///////////////////////
    // STAKING REQUESTS //
    /////////////////////
    /**
     * Send an approve allowance request for PublicStaking contract to spend X ATokens
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of ATokens to allow
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    staking_sendAtokenAllowanceForPublicStakingRequest: function (ethAdapter, amount) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.ALCA.approve_nonpayable_IN2_OUT1({
                        spender: ethAdapter.contractConfig.PUBLICSTAKING.address,
                        amount: ethAdapter.ethers.utils.parseEther(amount)
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /**
     * Send a request to open a public staking position
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of ATokens to open a staking position of
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    staking_sendOpenPublicStakingPositionRequest: function (ethAdapter, unformattedAmount) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.PUBLICSTAKING.mint_nonpayable_IN1_OUT1({
                        amount_: ethAdapter.ethers.utils.parseEther(unformattedAmount)
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /**
     * Send a request to claim all rewards associated with a given stakedPosition's tokenId -- Must own the position & only rewards are claimed , position remains viable
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } tokenId - uint256 tokenId to lockup
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    staking_sendClaimAllPublicStakingRewardsRequest: function (ethAdapter, tokenId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.PUBLICSTAKING.collectAllProfits_nonpayable_IN1_OUT2({
                        tokenID_: tokenId
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /**
     * Send a request to claim all rewards associated with a given stakedPosition's tokenId -- Must own the position, position is dissolved
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } tokenId - uint256 tokenId to lockup
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    staking_sendUnstakePublicStakedPositionRequest: function (ethAdapter, tokenId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.PUBLICSTAKING.burn_nonpayable_IN1_OUT2({
                        tokenID_: tokenId
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /////////////////////
    // LOCKUP REQUESTS //
    ////////////////////
    /**
     * Send an safeTranderFrom request to send the staked position NFT to the Lockup contract to lock a staked position -- No allowance needed
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } tokenId - uint256 tokenId to lockup
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    lockup_sendLockStakePositionWithSafeTransferFromRequest: function (ethAdapter, tokenId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.PUBLICSTAKING.safeTransferFrom_nonpayable_IN3_OUT0({
                        from: ethAdapter.getAddressByIndex(0),
                        to: ethAdapter.contractConfig.LOCKUP.address,
                        tokenId: tokenId
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /**
     * Send a collectAllRewards request to the lockup contract to claim all ETH & Token rewards from a locked position
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    lockup_sendCollectAllRewardsFromLockupRequest: function (ethAdapter) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.LOCKUP.collectAllProfits_nonpayable_IN0_OUT2()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /**
     * Gets an estimate for all current lockup rewards for a given locked position's id
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    lockup_estimateLockedPositionRewards: function (ethAdapter, tokenId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.LOCKUP.estimateProfits_view_IN1_OUT2({
                        tokenID_: tokenId
                    })];
                case 1: return [4 /*yield*/, _a.sent()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /**
     * Gets an estimate for all final lockup rewards for a given locked position's id for if user stays until LOCKUP_END
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    lockup_getEstimateForFinalBonusProfitsFromLockupPosition: function (ethAdapter, tokenId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.LOCKUP.estimateFinalBonusWithProfits_view_IN1_OUT4({
                        tokenID_: tokenId
                    })];
                case 1: return [4 /*yield*/, _a.sent()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /**
     * Iterate alls locked positions and collect their profits before
     * @notice allowing withdraws/unlocks. This step is necessary to make sure that the correct reserved
     * amount is in the rewardPool before allowing unlocks. This function will not send any ether or
     * ALCA to users, since this can be very dangerous (specially on a loop). Instead all the
     * assets that are not sent to the rewardPool are held in the lockup contract, and the right
     * balance is stored per position owner. All the value will be send to the owner address at the
     * call of the `{unlock()}` function. This function can only be called after the locking period
     * has finished. Anyone can call this function.
     * Gets an estimate for all final lockup rewards for a given PublicStaking position for if user stays until LOCKUP_END
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    lockup_sendAggregateLockupProfitsRequest: function (ethAdapter) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.LOCKUP.aggregateProfits_nonpayable_IN0_OUT0()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /**
     * Send a request to exit a locked position early partially or fully
     * @notice Function to partially or fully unlock a locked position. The entitled owner will
     * able to decide which will be the amount unlocked earlier (exitValue_). In case of full exit
     * (exitValue_ == positionShares), the owner will not get the percentage of profits of that
     * position that are held by this contract and he will not receive any bonus amount. In case, of
     * partial exit (exitValue_< positionShares), the owner will be loosing only the profits + bonus
     * relative to the exiting amount. The owner may choose via stakeExit_ boolean if the ALCA will be
     * sent a new publicStaking position or as ALCA directly to his address.
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } exitValue The unparsed amount in which the user wants to unlock earlier
     * @param { boolean } stakeExit Flag to decide the ALCA will be sent directly or staked as new publicStakingPosition
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    lockup_sendExitLockedPositionEarlyRequest: function (ethAdapter, exitValue, stakeExit) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.LOCKUP.unlockEarly_nonpayable_IN2_OUT2({
                        exitValue_: ethAdapter.ethers.utils.parseEther(exitValue),
                        stakeExit_: stakeExit
                    })];
                case 1: return [4 /*yield*/, _a.sent()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /**
     * Send a request to exit a locked position early partially or fully
     * @notice unlocks a locked position and collect all kind of profits (bonus shares, held rewards etc).
     * Can only be called after the locking period has finished and {aggregateProfits}
     * has been executed for positions. Can only be called by the user entitled to a position
     * (address that locked a position). This function can only be called after the locking period
     * has finished and {aggregateProfits()} has been executed for all locked positions.
     * into a new publicStaking position.
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } toAddress destination address were the profits, shares will be sent
     * @param { boolean } stakeExit boolean flag indicating if the ALCA should be returned directly or staked
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    lockup_sendExitLockedPositionRequest: function (ethAdapter, toAddress, stakeExit) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.LOCKUP.unlock_nonpayable_IN2_OUT2({
                        to_: toAddress,
                        stakeExit_: stakeExit
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /////////////////////
    // ROUTER REQUESTS //
    ////////////////////
    /**
     * Send an approve allowance request for Router contract contract to spend X Mad Tokens
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of Mad Tokens to allow
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    psrouter_sendApproveMadTokenForPublicStakingRouterRequest: function (ethAdapter, unformattedAmount) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.MADTOKEN.approve_nonpayable_IN2_OUT1({
                        _spender: ethAdapter.contractConfig.STAKINGROUTERV1.address,
                        _value: ethAdapter.ethers.utils.parseEther(unformattedAmount)
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /**
     * Send an approve allowance request for Router contract to spend X ALCA Tokens
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of Mad Tokens to allow
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    psrouter_sendApproveAlcaTokenForPublicStakingRouterRequest: function (ethAdapter, unformattedAmount) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.ALCA.approve_nonpayable_IN2_OUT1({
                        _spender: ethAdapter.contractConfig.STAKINGROUTERV1.address,
                        _value: ethAdapter.ethers.utils.parseEther(unformattedAmount)
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /**
     * Send a Tx request to PublicStakingRouter for a migrateAndStake -- Must have approved >= specified amount of MadToken for PublicStakingRouter first
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of Mad Tokens to allow
     * @param { String } positionOwner - The address of the account that will own the staking position
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    psrouter_sendMigrateAndStakeRequestToPublicStakingRouter: function (ethAdapter, unformattedAmount, stakePositionOwner) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.STAKINGROUTERV1.migrateAndStake_nonpayable_IN3_OUT0({
                        stakingAmount_: ethAdapter.ethers.utils.parseEther(unformattedAmount),
                        to: stakePositionOwner
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /**
     * Send a Tx request to PublicStakingRouter for a stake and lock -- Must have approved >= amount of ALCA for PublicStakingRouter first
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of Mad Tokens to allow
     * @param { String } positionOwner - The address of the account that will own the staking position
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    psrouter_sendStakeAndLockRequestToPublicStakingRouter: function (ethAdapter, unformattedAmount, lockPositionOwner) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.STAKINGROUTERV1.stakeAndLock_nonpayable_IN2_OUT0({
                        stakingAmount_: ethAdapter.ethers.utils.parseEther(unformattedAmount),
                        to_: lockPositionOwner
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
    /**
     * Send a Tx request to PublicStakingRouter for a migrateStakeLock action -- Must have approved MadToken for PublicStakingRouter first
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of Mad Tokens to allow
     * @param { String } positionOwner - The address of the account that will own the staking position
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    psrouter_sendMigrateStakeLockRequestToPublicStakingRouter: function (ethAdapter, unformattedMigrationAmount, unformattedStakingAmount, stakePositionOwner) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethAdapter.contractMethods.STAKINGROUTERV1.migrateStakeAndLock_nonpayable_IN3_OUT0({
                        migrationAmount_: ethAdapter.ethers.utils.parseEther(unformattedMigrationAmount),
                        stakingAmount_: ethAdapter.ethers.utils.parseEther(unformattedStakingAmount),
                        to_: stakePositionOwner
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }
};

export { BalanceContext, BalanceContextProvider, commonEthRequests };
//# sourceMappingURL=index.js.map
