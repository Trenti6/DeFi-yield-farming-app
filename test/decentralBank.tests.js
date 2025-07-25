const Web3 = require('web3');

const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('DecentralBank', ([owner, customer]) => {
    let tether, rwd, decentralBank

    function tokens(number) {
        return Web3.utils.toWei(number, 'ether')
    }

    before(async () => {
        // loading contracts
        tether = await Tether.new()
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address, tether.address)

        // transfer all tokens to dbank 1mil
        await rwd.transfer(decentralBank.address, tokens('1000000'))

        // transfer 100 tokens to customer
        await tether.transfer(customer, tokens('100'), { from: owner })

    })

    describe('Mock Tether deployement', async () => {
        it('matches name successfully', async () => {
            const name = await tether.name()

            assert.equal(name, 'Tether')
        })
    })

    describe('Mock RWD deployement', async () => {
        it('matches name successfully', async () => {
            const name = await rwd.name()

            assert.equal(name, 'Reward Token')
        })
    })

    describe('Decentral Bank Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await decentralBank.name()

            assert.equal(name, 'Decentral Bank')
        })

        it('contract has correct amount of tokens', async () => {
            let balance = await rwd.balanceOf(decentralBank.address)

            assert.equal(balance, tokens('1000000'))
        })
    })

    describe('Yield farm staking', async () => {
        it('reward tokens for staking', async () => {
            let result;

            result = await tether.balanceOf(customer);
            assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance before staking')

            await tether.approve(decentralBank.address, tokens('100'), { from: customer },)
            await decentralBank.depositTokens(tokens('100'), { from: customer })

            // check updated balance customer
            result = await tether.balanceOf(customer);
            assert.equal(result.toString(), tokens('0'), 'customer mock wallet balance after staking')

            //check updatd balance of decentral bank
            result = await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(), tokens('100'), 'decentral bank mock wallet balance after staking')

            // is staking balance

            result = await decentralBank.isStaked(customer)
            assert.equal(result.toString(),'true','customer isStaking status after staking')

            // Issue tokens
            await decentralBank.issueTokens({from:owner})

            // Issue tokens from not owner(testing only owner can issue)
            await decentralBank.issueTokens({from:customer}).should.be.rejected;

            // Unstake tokens
            await decentralBank.unstakeTokens({from:customer})

            // check unstake balance
            
            result = await tether.balanceOf(customer);
            assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance after ustaking')
            
            result = await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(), tokens('0'), 'decentral bank mock wallet balance after unstaking')

            result = await decentralBank.isStaked(customer)
            assert.equal(result.toString(),'false','customer isStaking status after unstaking')


        })
    })

})