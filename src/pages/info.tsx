import ContractMetadata from '@/components/ContractMetadata'
import Layout from '@/layout/Layout'
import { getMarketplaceContract, getNFTContract } from '@/util/getContracts'
import { useContractMetadata } from '@thirdweb-dev/react'
import { Metadata } from '@/types/metadata'

const InfoPage = () => {
  const { marketplace } = getMarketplaceContract()
  const { nft_contract } = getNFTContract()

  const { data: marketplace_metadata, isLoading: marketMetadataLoading } =
    useContractMetadata(marketplace)
  const { data: nft_metadata, isLoading: nftMetadataLoading } =
    useContractMetadata(nft_contract)

  return (
    <Layout>
      <div>
        <h1 className="">Contract Details</h1>
      </div>
      {nftMetadataLoading ||
        (marketMetadataLoading && (
          <div className="text">Loading contract info...</div>
        ))}
      {marketplace_metadata && (
        <ContractMetadata
          metadata={marketplace_metadata as Metadata}
          title="NFT Marketplace Contract Metadata"
        />
      )}
      {nft_metadata && (
        <ContractMetadata
          metadata={nft_metadata as Metadata}
          title="NFT Collection Contract Metadata"
        />
      )}
    </Layout>
  )
}

export default InfoPage
