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
        --form 'nftFiles=@"/home/phinelipy/Pictures/fish.png"' \
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
        --form 'recipient="0x865639b103B5cb25Db1C8703a02a64449dA4d038"'

Note: you can add more traits in the attributes

### View NFT

        curl --location 'http://localhost:8080/api/assets/info/1'



