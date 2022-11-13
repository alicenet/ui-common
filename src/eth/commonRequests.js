/**
 * @property {} 
 */
export const commonEthRequests = {
    /**
     * Send a request to open a public staking position
     * @param { Object } ethAdapter - EthAdapter from eth-adapter 
     * @param { String } unformattedAmount - The unformatted amont of ATokens to open a staking position of
     * @returns { any } - Return { error: msg } from ethAdapter if error
     */
    openPublicStakingPosition: async (ethAdapter, unformattedAmount) => {
        return await ethAdapter.contractMethods.PUBLICSTAKING.mint_nonpayable_IN1_OUT1({
            amount_: unformattedAmount
        })
    },
    /**
     * Send an approve allowance request for AToken contract to spend X Mad Tokens
     * @param { Object } ethAdapter - EthAdapter from eth-adapter 
     * @param { String } unformattedAmount - The unformatted amont of Mad Tokens to allow
     * @returns { any } - Return { error: msg } from ethAdapter if error
     */
    sendMadAllowanceForATokenRequest: async (ethAdapter, unformattedAmount) => {
        return await ethAdapter.contractMethods.MADTOKEN.approve_nonpayable_IN2_OUT1({
            _spender: ethAdapter.contractConfig.ATOKEN.address,
            _value: ethAdapter.ethers.utils.parseEther(unformattedAmount)
        })
    },
    /**
     * Send a migration amount of MAD => ALCA token for the unformatted amount
     * User must have allowance against AToken contract prior to this request
     * @param { Object } ethAdapter - EthAdapter from eth-adapter 
     * @param { String } unformattedAmount - The unformatted amont of Mad Tokens to allow
     */
    sendMigrateRequest: async (ethAdapter, unformattedAmount) => {
        return awaitethAdapter.contractMethods.ATOKEN.migrate_nonpayable_IN1_OUT1({
            amount: ethAdapter.ethers.utils.parseEther(unformattedAmount)
        });
    },
    /**
     * Send an approve allowance request for PublicStaking contract to spend X ATokens
     * @param { Object } ethAdapter - EthAdapter from eth-adapter 
     * @param { String } unformattedAmount - The unformatted amont of ATokens to allow
     * @returns { any } - Return { error: msg } from ethAdapter if error
     */
    sendAtokenAllowanceForPublicStaking: async (ethAdapter, amount) => {
        return await ethAdapter.contractMethods.ATOKEN.approve_nonpayable_IN2_OUT1({
            spender: ethAdapter.contractConfig.PUBLICSTAKING.address,
            amount: ethAdapter.ethers.utils.parseEther(unformattedAmount)
        })
    },
    /**
     * Send an safeTranderFrom request to send the staked position NFT to the Lockup contract to lock a staked position
     * @param { Object } ethAdapter - EthAdapter from eth-adapter 
     * @param { String } tokenId - uint256 tokenId to lockup
     * @returns { any } - Return { error: msg } from ethAdapter if error
     */
    sendLockStakePositionRequestWithSafeTransferFrom: async (ethAdapter, tokenId) => {
        return await ethAdapter.contractMethods.PUBLICSTAKING.safeTransferFrom_nonpayable_IN3_OUT0({
            from: ethAdapter.getAddressByIndex(0),
            to: ethAdapter.contractConfig.LOCKUP.address,
            tokenId: ""
        })
    }

}