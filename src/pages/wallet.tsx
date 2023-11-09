import NFTCard from '@/components/NFTCard'
import Layout from '@/layout/Layout'
import { getNFTContract } from '@/util/getContracts'
import { useAddress, useOwnedNFTs } from '@thirdweb-dev/react/evm'

export default function Wallet() {
  const { nft_contract } = getNFTContract()
  const address = useAddress()
  const {
    data: ownedNFTs,
    isLoading,
    error,
  } = useOwnedNFTs(nft_contract, address, {
    start: 0,
    count: 100,
  })
  return (
    <Layout>
      <div>
        <h1 className="text-6xl font-semibold my-4 text-center">My NFTs</h1>
        {!address && <div> No Wallet Detected...</div>}
        {isLoading ? (
          <div>loading NFT Data...</div>
        ) : (
          <div>
            {ownedNFTs &&
              ownedNFTs.map((nft, id) => {
                return <NFTCard key={id} {...nft} />
              })}
          </div>
        )}
      </div>
    </Layout>
  )
}
