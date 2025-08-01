import React,{Component} from 'react'
import bank from '../bank.png'
import tether from '../tether.png'
import Airdrop from './Airdrop'

class Main extends Component{
    render(){
        return(
            <div id='content' className='mt-3'>
                <table className='table text-muted text-center'>
                    <thead>
                    <tr style={{color:'Black'}}>
                        <th scope='col'>Staking Balance</th>
                        <th scope='col'> Reward Balance</th>
                    </tr>
                    </thead>
                    <tbody >
                        <tr style={{color:'Black'}}>
                            <td>{window.web3.utils.fromWei(this.props.stakingBalance,'Ether')} USDT</td>
                            <td>{window.web3.utils.fromWei(this.props.rwdBalance, 'Ether')} RWD</td>
                        </tr>
                    </tbody>
                </table>
                <div className='card mb-2' style={{opacity:'.9'}}>
                    <form className='mb-3' onSubmit={((event) =>{
                        event.preventDefault()
                        let amount
                        amount = this.input.value.toString()
                        amount = window.web3.utils.toWei(amount,'Ether')
                        this.props.stakeTokens(amount)
                    })}>
                        <div style={{borderSpacing:'0 1em'}}>
                            <label className='float-left' style={{marginLeft:'15px'}}><b>Stake Tokens</b></label>
                            <span className='float-right' style={{marginRight:'8px'}}>
                                Balance: {window.web3.utils.fromWei(this.props.tetherBalance, 'Ether')}
                            </span>
                            <div className='input-group mb-4'>
                                <input ref={(input)=>{this.input = input}} type='text' placeholder='0' required/>
                                <div className='input-group-open'>
                                    <div className='input-group-text'>
                                        <img src={tether} alt='tether image' height='32px'/> 
                                        &nbsp;&nbsp;&nbsp; USDT
                                    </div>
                                </div>
                            </div>
                            <button type='Submit' className='btn btn-primary btn-lg btn-block'>DEPOSIT</button>
                        </div>
                    </form>
                    <button type='Submit' onClick={(event)=>{
                            event.preventDefault(
                                this.props.unstakeTokens()
                            )
                    }} 
                    className='btn btn-secondary btn-lg btn-block'>WITHDRAW</button>
                    <div className='card-body text-center' style={{color:'blue'}}>
                        AIRDROP <Airdrop stakingBalance = {this.props.stakingBalance}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Main;