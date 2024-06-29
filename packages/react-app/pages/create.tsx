import { useRouter } from 'next/router'
import React, {useState, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'
import { Contract, ethers, providers } from 'ethers'
import { cardWaveABI } from '../abis/CardWave'
import { SERVICES } from '@/data'
import { contractAddress } from '@/constants'
import { generateRandomBytes32 } from '@/bytes'


const randomBytes = generateRandomBytes32()

export default   function create() {
     // eslint-disable-next-line react-hooks/rules-of-hooks
     const { address, isConnected } = useAccount();
     

     // eslint-disable-next-line react-hooks/rules-of-hooks
     const [businessName, setBusinessName] = useState(SERVICES[0].name || '')
     // eslint-disable-next-line react-hooks/rules-of-hooks
     const [creatorAddress, setAddress] = useState(address || '')
     // eslint-disable-next-line react-hooks/rules-of-hooks
     const [amount, setAmount] = useState('')




  const getProviderOrSigner = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const { chainId } = await provider.getNetwork()
      console.log(chainId, 'chain')
      if (chainId !== 44787) {
        throw new Error("Network not supported")
      }
      const signer = provider.getSigner();


      if (signer) {
        return signer
      }
      return provider
  } else {
    console.log('Please install MetaMask!');
  }
};


const handleSubmit = async (e: any) => {
  e.preventDefault()
  if (!businessName || !creatorAddress || amount == '0' || !amount) {
    alert("all fields are required")
    return 
  }
  // send to address contract address
  let cards = JSON.parse(localStorage.getItem('giftcards') || '[]');
  try {
    const signer = await getProviderOrSigner()
    const cardWaveContract = new Contract(
      contractAddress,
      cardWaveABI,
      signer
  );

  console.log(cardWaveContract, 'contract')
  console.log(amount, 'amount...')

  const tx = await cardWaveContract.issue(randomBytes, amount, businessName)
  cards.push({name: businessName, amount, bytes: randomBytes})
  console.log(tx, 'tx')
  localStorage.setItem('giftcards', JSON.stringify(cards))
  alert("You have successfully created a gift card!!")
}catch(err: any){
  console.log(err.message)
}
}

console.log('my random byte', randomBytes)

 
  return (
    <>
    <div className='egift-placeholder'>
        <img src="/images/kfc-card.png" />
    </div>
    <h4>Create Gift card on chain</h4>
    <div className='form-wrapper'>

  <form className='create-form' onSubmit={handleSubmit}>

     <div className='form-control'>
      <select className='form-input' style={{width: 200}} name='businessName' onChange={(e) => setBusinessName(e.target.value)}>
      {SERVICES.map((service, idx) => (
        <option key={idx}  value={service.name}>{service.name}</option>
      ))}
      </select>
      </div>    

        <div className='form-control'>
            <input className='form-input' value={creatorAddress}  type="text" placeholder='Creator Address' name='creatorAddress' />
        </div>

        <div className='form-control'>
            <input className='form-input' type="text" value={amount}  onChange={(e) => setAmount(e.target.value)}   placeholder='Amount' name='amount' />
        </div>


        <div className='form-control'>
            <input className='form-input' type="text" value={randomBytes}    placeholder='Amount' name='amount' />
        </div>


        <button type="submit" className='btn form-btn'>Create</button>
      </form>
    </div>
  
    </>
  )
}
