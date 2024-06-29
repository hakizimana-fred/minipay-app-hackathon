import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Settings } from 'lucide-react';

export default function Header() {
    const [hideConnectBtn, setHideConnectBtn] = useState(false);
    const { connect } = useConnect();

    useEffect(() => {
        if (window.ethereum && window.ethereum.isMiniPay) {
            setHideConnectBtn(true);
            connect({ connector: injected({ target: "metaMask" }) });
        }
    }, []);

    const router = useRouter()

        const renderHeaderTop = () => {
        if (router.pathname === '/') {
            return (
                <>
                  <img  className='logo' src="/images/31.png" alt="avatar" />
                <h3>Welcome! <span style={{color: '#0000FF'}}></span></h3>
                </>
            )
        }else if (router.pathname === '/create') {
            return (
                <h1>Create Gift card</h1>
            )
        }else if(router.pathname === '/history') {
            return(
                <h1>History</h1>
            )
        }else {
            console.log('pathname invalid')
        }
    }

    return (
        <>
         <header className='header-top'>
        <div className='header-content'>
          {renderHeaderTop()}
        </div>
         {!hideConnectBtn ? (
              <ConnectButton
                                        showBalance={{
                                            smallScreen: true,
                                            largeScreen: false,
                                        }}
                                    />
         ): 
            <>
         <div style={{width: 50, height: 50, borderRadius: '50%', background: '#D9D9D9', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Settings color="#1C1B1F" size={30}  /> 
        </div>
              
            </> 
         }
       
       </header>
    
        </>
    );
}
