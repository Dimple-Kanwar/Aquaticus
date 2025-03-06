# Aquaticus

NFT backend for Aquaticus game

## Setup Instructions

### Compile smart contract:

        npx hardhat compile

### Test smart contract:

        npm run test

### Start a local hardhat node:

        npx hardhat node

### Deploy contract :

        npx hardhat ignition deploy ignition/modules/NFT.ts --network localhost

Note: change --network from localhost to your network name.

If you want to use polygon network, replace localhost with polygon

        npx hardhat ignition deploy ignition/modules/NFT.ts --network polygon

### Run server:

        npm start

## API Collection

### Mint NFT

        curl --location 'http://localhost:8080/api/assets/mint' \
        --form 'nftFiles=@"<image_file_path>"' \
        --form 'metadata="{
        \"name\": \"<nft_name_here>\",
        \"description\": \"<nft_description_here>\",
        \"attributes\": [
        {
        \"trait_type\": \"<nft_trait_name>\",
        \"value\": \"<nft_trait_value>\"
        }
        ]
        }"' \
        --form 'recipient="<nft_owner_address>"'

Note: you can add more traits in the attributes

### View NFT

        curl --location 'http://localhost:8080/api/assets/info/<token_id>'

### Transfer NFT

        curl --location --request PUT 'http://localhost:8080/api/assets/transfer' \
        --header 'Content-Type: application/json' \
        --data '{
        "from": "<nft_owner_address>",
        "to": "<new_nft_owner>",
        "tokenId": <token_id>
        }'

Note: to test the transfer NFT api, make sure the Private key of the nft owner address in the environment variable is correct.

### Get All NFTs by the Owner

        curl --location 'http://localhost:8080/api/assets/0x0500DE79c6Aa801936cA05D798C9E7468b6739C6'

### Burn NFT

        curl --location 'http://localhost:8080/api/assets/burn/4' \
        --header 'Content-Type: application/json' \
        --data '{
                "ownerAddress": "0x0500DE79c6Aa801936cA05D798C9E7468b6739C6"
        }'
