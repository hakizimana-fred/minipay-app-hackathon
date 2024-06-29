import { SERVICES } from '@/data'
import React, { useEffect, useState } from 'react'

export default function history() {

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [savedCards, setSavedCards] = React.useState<any[]>([])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
   (() => {
     if (typeof window !== "undefined") {
       const cards: any = localStorage.getItem("giftcards")
       if (cards) {
         setSavedCards(JSON.parse(cards))
       }
     }
   })()
  }, [])


  const cardsWithImages = savedCards.map(card => {
    const service = SERVICES.find(service => service.name === card.name);

    return {
        ...card,
        img: service ? service.img : '' 
    };
});

console.log(cardsWithImages, 'cards')

  return (
    <div>
    
    {cardsWithImages.map((card => (
  <>
        <div className='history-wrapper'>
            <div className='wrapper-dets'>
                <img className='history-logo' src={card.img} />
                <div style={{display: 'flex', flexDirection: 'column'}}>
                <h4>{card.name}</h4>
                <div>code: {card.bytes}</div>
                </div>
            </div>
            <p>${card.amount}</p>
        </div>
       </>
    )))}
    </div>
  )
}
