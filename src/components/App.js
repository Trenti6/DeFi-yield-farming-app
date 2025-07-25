import React, { Component } from 'react';
import Navbar from './Navbar';
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json'
import RWD from '../truffle_abis/RWD.json'
import DecentralBank from '../truffle_abis/DecentralBank.json'
import Main from './Main.js'
import ParticlesSettings from './ParticlesSettings.js'

class App extends Component {


    async UNSAFE_componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('No etherium browser detected check metaMask')
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3
        const account = await web3.eth.getAccounts()
        this.setState({ account: account[0] })
        const networkId = await web3.eth.net.getId()

        //load tether contract
        const tetherData = Tether.networks[networkId]
        if (tetherData) {
            const tether = new web3.eth.Contract(Tether.abi, tetherData.address)
            this.setState({ tether: tether })
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call()
            this.setState({ tetherBalance: tetherBalance.toString() })

        } else {
            window.alert('Tether contract not deployed to detected network')
        }

        //load reward contract
        const rewardData = RWD.networks[networkId]
        if (rewardData) {
            const reward = new web3.eth.Contract(RWD.abi, rewardData.address)
            this.setState({ rwd: reward })
            let rewardBalance = await reward.methods.balanceOf(this.state.account).call()
            this.setState({ rwdBalance: rewardBalance.toString() })

        } else {
            window.alert('Reward contract not deployed to detected network')
        }

        //decentral bank contract
        const decentralBankData = DecentralBank.networks[networkId]
        if (decentralBankData) {
            const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
            this.setState({ decentralBank: decentralBank })
            let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call()
            this.setState({ stakingBalance: stakingBalance })

        } else {
            window.alert('Dbank contract not deployed to detected network')
        }
        this.setState({ loading: false })
    }

    //staking function
    stakeTokens = async (amount) => {
    this.setState({ loading: true });
    try {
        await this.state.tether.methods.approve(this.state.decentralBank._address, amount)
            .send({ from: this.state.account });

        await this.state.decentralBank.methods.depositTokens(amount)
            .send({ from: this.state.account });

    } catch (err) {
        console.error("Staking failed:", err.message);
    }
    this.setState({ loading: false });
}



    //unstaking fuction
    unstakeTokens =()=>{
        this.setState({ loading: true })
        this.state.decentralBank.methods.unstakeTokens().send({from:this.state.account}).on('transactionHash',(hash)=>{
            this.setState({ loading: false })
        })
    }


    constructor(props) {
        super(props)
        this.state = {
            account: '0x0',
            tether: {},
            rwd: {},
            decentralBank: {},
            tetherBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true
        }
    }

    render() {
        let content
        {this.state.loading ? content = <p id='loader' className='text-center' style={{margin:'30px'}}>LOADING PLEASE WAIT...</p> : content = <Main 
        tetherBalance = {this.state.tetherBalance}
        rwdBalance = {this.state.rwdBalance}
        stakingBalance = {this.state.stakingBalance}
        stakeTokens = {this.stakeTokens}
        unstakeTokens = {this.unstakeTokens}
        />}
        return (
            <div className='App' style={{position:'relative'}}>
                <div style={{position:'absolute'}}>
                <ParticlesSettings/>
                </div>
                <Navbar account={this.state.account} />
                <div className='container-fluid mt-5'>
                    <div className='row'>
                        <main role='main' className='col-lg-12 ml-auto mr-auto' style={{ maxWidth: '600px', minHeight: '100vm' }}>
                            <div>
                                {content}
                            </div>
                        </main>
                    </div>
                </div>
            </div>

        )
    }
}

export default App;