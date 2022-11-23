/**
 * @property {}
 */
export declare const commonEthRequests: {
    /**
     * Send an approve allowance request for AToken contract to spend X Mad Tokens
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of Mad Tokens to allow
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    migrate_sendMadAllowanceForATokenRequest: (ethAdapter: any, unformattedAmount: string) => Promise<any>;
    /**
     * Send a migration amount of MAD => ALCA token for the unformatted amount
     * User must have allowance against AToken contract prior to this request
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of Mad Tokens to allow
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    migrate_sendMigrateRequest: (ethAdapter: any, unformattedAmount: string) => Promise<any>;
    /**
     * Send an approve allowance request for PublicStaking contract to spend X ATokens
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of ATokens to allow
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    staking_sendAtokenAllowanceForPublicStakingRequest: (ethAdapter: any, amount: string) => Promise<any>;
    /**
     * Send a request to open a public staking position
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of ATokens to open a staking position of
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    staking_sendOpenPublicStakingPositionRequest: (ethAdapter: any, unformattedAmount: string) => Promise<any>;
    /**
     * Send a request to claim all rewards associated with a given stakedPosition's tokenId -- Must own the position & only rewards are claimed , position remains viable
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } tokenId - uint256 tokenId to lockup
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    staking_sendClaimAllPublicStakingRewardsRequest: (ethAdapter: any, tokenId: string) => Promise<any>;
    /**
     * Send a request to claim all rewards associated with a given stakedPosition's tokenId -- Must own the position, position is dissolved
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } tokenId - uint256 tokenId to lockup
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    staking_sendUnstakePublicStakedPositionRequest: (ethAdapter: any, tokenId: string) => Promise<any>;
    /**
     * Send an safeTranderFrom request to send the staked position NFT to the Lockup contract to lock a staked position -- No allowance needed
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } tokenId - uint256 tokenId to lockup
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    lockup_sendLockStakePositionWithSafeTransferFromRequest: (ethAdapter: any, tokenId: string) => Promise<any>;
    /**
     * Send a collectAllRewards request to the lockup contract to claim all ETH & Token rewards from a locked position
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    lockup_sendCollectAllRewardsFromLockupRequest: (ethAdapter: any) => Promise<any>;
    /**
     * Gets an estimate for all current lockup rewards for a given locked position's id
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    lockup_estimateLockedPositionRewards: (ethAdapter: any, tokenId: string) => Promise<any>;
    /**
     * Gets an estimate for all final lockup rewards for a given locked position's id for if user stays until LOCKUP_END
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    lockup_getEstimateForFinalBonusProfitsFromLockupPosition: (ethAdapter: any, tokenId: string) => Promise<any>;
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
    lockup_sendAggregateLockupProfitsRequest: (ethAdapter: any) => Promise<any>;
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
    lockup_sendExitLockedPositionEarlyRequest: (ethAdapter: any, exitValue: string, stakeExit: boolean) => Promise<any>;
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
    lockup_sendExitLockedPositionRequest: (ethAdapter: any, toAddress: string, stakeExit: boolean) => Promise<any>;
    /**
     * Send an approve allowance request for Router contract contract to spend X Mad Tokens
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of Mad Tokens to allow
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    psrouter_sendApproveMadTokenForPublicStakingRouterRequest: (ethAdapter: any, unformattedAmount: string) => Promise<any>;
    /**
     * Send an approve allowance request for Router contract to spend X ALCA Tokens
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of Mad Tokens to allow
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    psrouter_sendApproveAlcaTokenForPublicStakingRouterRequest: (ethAdapter: any, unformattedAmount: string) => Promise<any>;
    /**
     * Send a Tx request to PublicStakingRouter for a migrateAndStake -- Must have approved >= specified amount of MadToken for PublicStakingRouter first
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of Mad Tokens to allow
     * @param { String } positionOwner - The address of the account that will own the staking position
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    psrouter_sendMigrateAndStakeRequestToPublicStakingRouter: (ethAdapter: any, unformattedAmount: string, stakePositionOwner: string) => Promise<any>;
    /**
     * Send a Tx request to PublicStakingRouter for a stake and lock -- Must have approved >= amount of ALCA for PublicStakingRouter first
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of Mad Tokens to allow
     * @param { String } positionOwner - The address of the account that will own the staking position
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    psrouter_sendStakeAndLockRequestToPublicStakingRouter: (ethAdapter: any, unformattedAmount: string, lockPositionOwner: string) => Promise<any>;
    /**
     * Send a Tx request to PublicStakingRouter for a migrateStakeLock action -- Must have approved MadToken for PublicStakingRouter first
     * @param { any } ethAdapter - EthAdapter from eth-adapter
     * @param { String } unformattedAmount - The unformatted amont of Mad Tokens to allow
     * @param { String } positionOwner - The address of the account that will own the staking position
     * @returns { any } - Return { error: msg } from ethAdapter if error, else Tx Object from ethers
     */
    psrouter_sendMigrateStakeLockRequestToPublicStakingRouter: (ethAdapter: any, unformattedMigrationAmount: string, unformattedStakingAmount: any, stakePositionOwner: string) => Promise<any>;
};
