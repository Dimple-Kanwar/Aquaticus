# Aquaticus

NFT backend for Aquaticus game

## Local Setup Instructions

### Compile smart contract:

        npx hardhat compile

### Test smart contract:

        npm run test

### Deploy contract :

        npx hardhat run scripts/deploy.ts --network --network amoy

### Run server:

        npm start

## Setup Instructions on Render

### connect with github Repo

        branch: main

### Fill out following settings

        language: node
        build command: npm install
        start command: node src/index.ts

### enter required environment variables

        TESTNET_RPC=https://rpc-amoy.polygon.technology
        PRIVATE_KEY="enter_your_wallet_private_key"
        PINATA_API_KEY="enter pinata api key"
        PINATA_API_SECRET="enter pinata api secret"
        PINATA_JWT="enter pinata jwt token"
        PINATA_DOMAIN="enter pinata domain"
        NFT_CONTRACT_ADDRESS="enter nft smart contract address"

### deploy server

Server will be up and running if there is not issue. You will get the server url.

        url: https://web3-fgzm.onrender.com

## API Collection

### Mint NFT

#### Local

        curl --location 'http://localhost:8080/api/asset/mint' \
        --form 'nftFile=@"<image_file_path>"' \
        --form 'metadata="{
        \"name\": \"my fish\",
        \"description\": \"My awesome NFT description\",
        \"attributes\": [
        {
        \"trait_type\": \"Color\",
        \"value\": \"orange\"
        }
        ]
        }"' \
        --form 'recipient="<nft_owner_address>"'

### Render

        curl --location 'https://web3-fgzm.onrender.com/api/asset/mint' \
        --form 'nftFile=@"<image_file_path>"' \
        --form 'metadata="{
                \"name\": \"my fish\",
                \"description\": \"My awesome NFT description\",
                \"attributes\": [
                {
                \"trait_type\": \"Color\",
                \"value\": \"orange\"
                }
                ]
                }"' \
        --form 'recipient="<nft_owner_address>"'

Note: you can add more traits in the attributes

### View NFT

#### Local

        curl --location 'http://localhost:8080/api/asset/info/<token_id>'

#### Render

        curl --location 'https://web3-fgzm.onrender.com/api/asset/info/<token_id>'

### Transfer NFT

#### Local

        curl --location --request PUT 'http://localhost:8080/api/asset/transfer' \
        --header 'Content-Type: application/json' \
        --data '{
        "from": "<nft_owner_address>",
        "to": "<new_nft_owner>",
        "tokenId": <token_id>
        }'

#### Render

        curl --location --request PUT 'https://web3-fgzm.onrender.com/api/asset/transfer' \
        --header 'Content-Type: application/json' \
        --data '{
        "from": "<nft_owner_address>",
        "to": "<new_nft_owner>",
        "tokenId": <token_id>
        }'

Note: to test the transfer NFT api, make sure the Private key of the nft owner address in the environment variable is correct.

### Fetch all NFTs by owner address

#### Local

        curl --location 'http://localhost:8080/api/asset/<nft_owner_address>'

#### Render

        curl --location 'https://web3-fgzm.onrender.com/api/asset/<nft_owner_address>'

#### Response Format

        {
        "total": 2,
        "nfts": [
                {
                "contract_address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
                "owner_address": "0x0500DE79c6Aa801936cA05D798C9E7468b6739C6",
                "token_id": 2,
                "metadata": {
                        "name": "my fish",
                        "description": "My awesome NFT description",
                        "image": "https://blush-fascinating-sloth-995.mypinata.cloud/ipfs/QmTGXxyqFCifd6aXiGS3GzfFfceiYW5UBAoFsGz1MpEZRo",
                        "attributes": [
                        {
                        "trait_type": "Color",
                        "value": "orange"
                        }
                        ]
                }
                },
                {
                "contract_address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
                "owner_address": "0x0500DE79c6Aa801936cA05D798C9E7468b6739C6",
                "token_id": 3,
                "metadata": {
                        "name": "my fish",
                        "description": "My awesome NFT description",
                        "image": "https://blush-fascinating-sloth-995.mypinata.cloud/ipfs/QmTGXxyqFCifd6aXiGS3GzfFfceiYW5UBAoFsGz1MpEZRo",
                        "attributes": [
                        {
                        "trait_type": "Color",
                        "value": "orange"
                        }
                        ]
                }
                }
                ]
                }

### Burn NFT

#### Local

        curl --location 'http://localhost:8080/api/asset/burn/<token_id>' \
        --header 'Content-Type: application/json' \
        --data '{
        "ownerAddress": "<nft_owner_address>"
        }'

#### Render

        curl --location 'https://web3-fgzm.onrender.com/api/asset/burn/<token_id>' \
        --header 'Content-Type: application/json' \
        --data '{
        "ownerAddress": "<nft_owner_address>"
        }'

#### Response Format

        {
                "message": "NFT burned successfully",
                "result": {
                        "tokenId": 4,
                        "success": true
                }
        }