import { ArrowRight,  } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { ethers, Contract } from 'ethers'
import { SERVICES } from "@/data";
import { cardWaveABI } from "@/abis/CardWave";
import { contractAddress } from "@/constants";


export default function Home() {
    const [userAddress, setUserAddress] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const { address, isConnected } = useAccount();


  const [savedCards, setSavedCards] = useState<any[]>([])

  useEffect(() => {
   (() => {
     if (typeof window !== "undefined") {
       const cards: any = localStorage.getItem("giftcards")
       setSavedCards(JSON.parse(cards))
     }
   })()
  }, [])


const getProviderOrSigner = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const { chainId } = await provider.getNetwork()
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


      const { data, isError, isLoading } = useBalance({
        address,
        unit: 'ether'
    })

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isConnected && address) {
            setUserAddress(address);
        }
    }, [address, isConnected]);

    useEffect(() => {
        (async () => {
        const signer = await getProviderOrSigner()
        const cardWaveContract = new Contract(
            contractAddress,
            cardWaveABI,
            signer
        );

        const giftcardDetails = await cardWaveContract.fetchAllGiftcards();
        
        const giftcards = giftcardDetails.map((giftcard: any) => {
            console.log(giftcard, 'gift')
        })
        
        })()
    }, [])


   

    if (!isMounted) {
        return null;
    }

    const redeemCard = async (bytes: string) => {
        try {
          const signer = await getProviderOrSigner() 
        const cardWaveContract = new Contract(
            contractAddress,
            cardWaveABI,
            signer
    );
        const redeemedCard = await cardWaveContract.redeem(bytes)
        console.log(redeemedCard, 'redeemed')
        alert('redeemed successully')
    }catch(e: any) {
        console.log(e.message)
        alert("something wetn wrong")
    }
    }

    return (
        <div className="wrapper">
        <div className="balance-wrapper">
            {isConnected ? (
                <>
                <h1>Your Wallet</h1>
                <div className="h2 text-center">
                    balance: ${data?.formatted as any} 
                </div>

                <div className="h2 text-center">
                    address: {userAddress}
                </div>
                </>

            ) : (
                <div>Please connect your wallet to get started</div>
            )}
        </div>
        <div className="cards-wrapper">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1>Redeem gift cards</h1>
                <ArrowRight color="#000" size={30} />
            </div>
        <div style={{display: 'flex', overflowX: 'scroll', width: '100%'}}>
           {savedCards.map((card) => (

            <>
                <div>
                   <div className="gift-card">
                     <div>
                        <div style={{}}>
                            <p>{card.name}</p>
                            <p>{card.bytes}</p>
                        </div>
                     </div>
                     <div style={{display: 'flex', flexDirection: 'row',  justifyItems: 'space-between', position: 'absolute', bottom: -6}}>
                        <p style={{color: 'white', fontWeight: 'bolder', fontSize: 20}}>$5</p>
                        <img  src="/images/qrcode.png" />
                     </div>
                    </div> 
                        <button className="btn" style={{borderRadius: 20, padding: '12px 20px', width: 100, marginLeft: 15, color: '#fff', backgroundColor: '#000', border: 'none', marginTop: 15}} onClick={() =>redeemCard(card.bytes)}>
                             Redeem
                </button>
                </div>
            </>


           ))}
        </div>
        </div>
    

    <h2 style={{backgroundColor: '#EEE8F4', padding: 10}}>Local businesses</h2>
    <div className='service-list'>  
     {SERVICES.map((service) => (
        <div className='service-card' key={service.name}>
            <img src={service.img} className='service-img' />
            <div>
            <p>{service.name}</p>
            <p className='service-price'>${service.price}</p>
            <button className="btn" style={{borderRadius: 20, alignSelf: 'center', padding: '12px 20px', width: 100, marginLeft: 15, color: '#fff', backgroundColor: '#800020', border: 'none', }} onClick={() => alert('work in progress..')}>
                Spend
              </button>
            </div>
        </div>
     ))}
    </div>
    </div>
    );
}
