/**
 * @property {}
 */
export const commonEthRequests = {
    /////////////////////////
    // MIGRATION REQUESTS //
    ///////////////////////

    /**
     * Send an approve allowance request for AToken contract to spend X Mad Tokens
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of Mad Tokens to allow
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    sendMadAllowanceForATokenRequest: async (ethAdapter: any, unformattedAmount: string) => {
        return await ethAdapter.contractMethods.MADTOKEN.approve_nonpayable_IN2_OUT1({
            _spender: ethAdapter.contractConfig.ATOKEN.address,
            _value: ethAdapter.ethers.utils.parseEther(unformattedAmount),
        });
    },
    /**
     * Send a migration amount of MAD => ALCA token for the unformatted amount
     * User must have allowance against AToken contract prior to this request
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of Mad Tokens to allow
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    sendMigrateRequest: async (ethAdapter: any, unformattedAmount: string) => {
        return await ethAdapter.contractMethods.ATOKEN.migrate_nonpayable_IN1_OUT1({
            amount: ethAdapter.ethers.utils.parseEther(unformattedAmount),
        });
    },

    ///////////////////////
    // STAKING REQUESTS //
    /////////////////////

    /**
     * Send an approve allowance request for PublicStaking contract to spend X ATokens
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of ATokens to allow
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    sendAtokenAllowanceForPublicStakingRequest: async (ethAdapter: any, amount: string) => {
        return await ethAdapter.contractMethods.ATOKEN.approve_nonpayable_IN2_OUT1({
            spender: ethAdapter.contractConfig.PUBLICSTAKING.address,
            amount: ethAdapter.ethers.utils.parseEther(amount),
        });
    },
    /**
     * Send a request to open a public staking position
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of ATokens to open a staking position of
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    sendOpenPublicStakingPositionRequest: async (ethAdapter: any, unformattedAmount: string) => {
        return await ethAdapter.contractMethods.PUBLICSTAKING.mint_nonpayable_IN1_OUT1({
            amount_: ethAdapter.ethers.utils.parseEther(unformattedAmount),
        });
    },
    /**
     * Send a request to claim all rewards associated with a given stakedPosition's tokenId -- Must own the position & only rewards are claimed , position remains viable
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } tokenId - uint256 tokenId to lockup
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    sendClaimAllPublicStakingRewardsRequest: async (ethAdapter: any, tokenId: string) => {
        return await ethAdapter.contractMethods.PUBLICSTAKING.collectAllProfits_nonpayable_IN1_OUT2({
            tokenID_: tokenId,
        });
    },
    /**
     * Send a request to claim all rewards associated with a given stakedPosition's tokenId -- Must own the position, position is dissolved
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } tokenId - uint256 tokenId to lockup
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    sendUnstakePublicStakedPositionRequest: async (ethAdapter: any, tokenId: string) => {
        ethAdapter.contractMethods.PUBLICSTAKING.burn_nonpayable_IN1_OUT2({
            tokenID_: tokenId,
        });
    },

    /////////////////////
    // LOCKUP REQUESTS //
    ////////////////////

    /**
     * Send an safeTranderFrom request to send the staked position NFT to the Lockup contract to lock a staked position -- No allowance needed
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } tokenId - uint256 tokenId to lockup
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    sendLockStakePositionWithSafeTransferFromRequest: async (ethAdapter: any, tokenId: string) => {
        return await ethAdapter.contractMethods.PUBLICSTAKING.safeTransferFrom_nonpayable_IN3_OUT0({
            from: ethAdapter.getAddressByIndex(0),
            to: ethAdapter.contractConfig.LOCKUP.address,
            tokenId: tokenId,
        });
    },
    /**
     * Send a collectAllRewards request to the lockup contract to claim all ETH & Token rewards from a locked position
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    sendCollectAllRewardsFromLockupRequest: async (ethAdapter: any) => {
        return await ethAdapter.contractMethods.LOCKUP.collectAllProfits_nonpayable_IN0_OUT2();
    },
    /**
     * Gets an estimate for all current lockup rewards for a given locked position's id
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    estimateLockedPositionRewards: async (ethAdapter: any, tokenId: string) => {
        return await await ethAdapter.contractMethods.LOCKUP.estimateProfits_view_IN1_OUT2({
            tokenID_: tokenId,
        });
    },
    /**
     * Gets an estimate for all final lockup rewards for a given locked position's id for if user stays until LOCKUP_END
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    getEstimateForFinalBonusProfitsFromLockupPosition: async (ethAdapter: any, tokenId: string) => {
        return await await ethAdapter.contractMethods.LOCKUP.estimateFinalBonusWithProfits_view_IN1_OUT4({
            tokenID_: tokenId,
        });
    },
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
    sendAggregateLockupProfitsRequest: async (ethAdapter: any) => {
        return await ethAdapter.contractMethods.LOCKUP.aggregateProfits_nonpayable_IN0_OUT0();
    },
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
    sendExitLockedPositionEarlyRequest: async (ethAdapter: any, exitValue: string, stakeExit: boolean) => {
        return await await ethAdapter.contractMethods.LOCKUP.unlockEarly_nonpayable_IN2_OUT2({
            exitValue_: ethAdapter.ethers.utils.parseEther(exitValue),
            stakeExit_: stakeExit,
        });
    },
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
    sendExitLockedPositionRequest: async (ethAdapter: any, toAddress: string, stakeExit: boolean) => {
        return await ethAdapter.contractMethods.LOCKUP.unlock_nonpayable_IN2_OUT2({
            to_: toAddress,
            stakeExit_: stakeExit,
        });
    },
};
