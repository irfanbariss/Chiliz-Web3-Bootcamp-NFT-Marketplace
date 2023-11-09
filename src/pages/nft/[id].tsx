import Layout from '@/layout/Layout'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getMarketplaceContract, getNFTContract } from '@/util/getContracts'
import {
  useTransferNFT,
  useNFT,
  useValidDirectListings,
} from '@thirdweb-dev/react'
import NFTDetails from '@/components/NFTDetails'
import CancelSellingCard from '@/components/CancelSelling'
import SellNFTCard from '@/components/SellNFTCard'

function NFTDetailsPage() {
  const router = useRouter()
  const [price, setPrice] = useState(0.01)
  const [symbol, setSymbol] = useState('')
  const [listingID, setListingID] = useState('')
  const [nftID, setNftID] = useState('NFTDetails')
  const [address, setAddress] = useState('') // for recipient address

  const { nft_contract } = getNFTContract()
  const { marketplace } = getMarketplaceContract()
  const { data: nft, isLoading: isNFTLoading } = useNFT(nft_contract, nftID)
  const { data: diretListings } = useValidDirectListings(marketplace, {
    start: 0,
    count: 100,
  })

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value) // changing the address
  }

  const {
    mutate: transferNFT,
    isLoading: isTransferLoading,
    error: transferError,
  } = useTransferNFT(nft_contract)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { id } = router.query
      setNftID(id as string)
    }

    let listedNFT = diretListings?.find((item) => item.tokenId === nftID)
    if (listedNFT) {
      setListingID(listedNFT.id)
      setPrice(Number(listedNFT.currencyValuePerToken.displayValue))
      setSymbol(listedNFT.currencyValuePerToken.symbol)
    }
  }, [router.query])

  const handleTransferNFT = async () => {
    try {
      await transferNFT({
        to: address,
        tokenId: parseInt(nftID), // converting nftID which is a string to an integer
      })
      alert('Successfully transferred NFT')
    } catch (error) {
      console.log('Error transferring NFT', error)
    }
  }

  return (
    <Layout>
      <div>
        <h1 className="text-6xl font-semibold my-4 text-center">NFT Details</h1>
      </div>
      {isNFTLoading || !nft ? (
        <div className="text-center">{`Loading NFT with id ${nftID}`}</div>
      ) : (
        <>
          <NFTDetails {...nft} />
          {listingID ? (
            <CancelSellingCard
              price={price}
              symbol={symbol}
              listingID={listingID}
            />
          ) : (
            <>
              <SellNFTCard onUpdatePrice={setPrice} price={price} id={nftID} />
              {/* input for transferring */}
              <div>
                <label>Recipient Address:</label>
                <input
                  type="text"
                  value={address}
                  onChange={handleAddressChange}
                />
              </div>
              <button onClick={handleTransferNFT} disabled={isTransferLoading}>
                {isTransferLoading ? 'Transfering...' : 'Transfer NFT'}
              </button>
            </>
          )}
        </>
      )}
    </Layout>
  )
}
export default NFTDetailsPage
