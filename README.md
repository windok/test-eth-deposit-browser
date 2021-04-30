This is test project to get known with Web3.

Service allows to subscribe for incoming transactions to a specific addresses and stores them in memory.

Service provides API for:
1) Adding, removing addresses to listen
2) Get current list of addresses
3) Get transactions by address
4) Get total amount of ETH transferred(registered by system) to a specific address

Storing transaction and addresses in persistent storage is not implemented yet.

# Setup #

Prepare project:

```bash
# Clone project to your local machine
git clone https://github.com/windok/test-eth-deposit-browser.git
cd test-eth-deposit-browser/

# Copy env config file from sample. If needed edit values in config 
cp .env.sample .env

# Start docker container
docker compose up
```

Set up Postman collection for invoking API
- use link https://www.getpostman.com/collections/794be39e633c9df105b5
- or import manually with `test-eth-deposit-browser.postman_collection.json` file in project root

Edit Postman collection and set your own ETH wallet addresses for variables `ethFirstAddress` and `ethSecondAddress`.

Make sure that addresses of your wallets exist in test network of Ethereum provided in config file (`WEB3_WS_PROVIDER` and `WEB3_HTTP_PROVIDER`)

# API reference #

## PUT /address ##
Start watching address

Request example body:
```json
{
  "address": "0x5110354A3E15C7B97f4FF67F3615575fB4daF878"
}
```

Response: 204 No Content

## DELETE /address/:address ##
Stop watching address. Also all tracked transaction will be cleared

Request example:
```
DELETE /address/:address
```

Response: 204 No Content

## GET /address/:address/balance ##
Get address balance

Request example:
```
DELETE /address/0x5110354A3E15C7B97f4FF67F3615575fB4daF878/balance
```

In response it is possible to see address balance based on transactions that occurred after service launch.
Also overall balance of the address is present.
 
Response example:
```json
{
    "depositedBalance": {
        "wei": "230000000000000000",
        "eth": "0.23"
    },
    "actualBalance": {
        "wei": "2544448000000000000",
        "eth": "2.544448"
    }
}
```

In case service does not track the address 404 Not Found HTTP error will returned

## GET /address/:address/transaction ##
Get address transaction tracked by service

Request example:
```
DELETE /address/0x5110354A3E15C7B97f4FF67F3615575fB4daF878/transaction
```

Response is array of [web3 Transaction](https://github.com/ChainSafe/web3.js/blob/1.x/packages/web3-core/types/index.d.ts#L117) models 
 
Response example:
```json
[
    {
        "blockHash": "0x45069b0d3a6a40c7bbcb1d568672a059c46d90223ad0bb4f7d6cb61092af7661",
        "blockNumber": 8503072,
        "from": "0x559d3A96cA554C75c51f24F83DE8c73c4B3e6089",
        "gas": 21000,
        "gasPrice": "1000000000",
        "hash": "0xf8e9257bfeaf86ecc5bc0511c63358ce42e8c225292dc02b7d90da43d10294c2",
        "input": "0x",
        "nonce": 14,
        "r": "0xe6d6229dc9555985352ee56be365e00362110ab24332520d832584ddffda2ad3",
        "s": "0xa2b82dc055986c944d82c0678203037f96db56284b1906627676b07b7579261",
        "to": "0x5110354A3E15C7B97f4FF67F3615575fB4daF878",
        "transactionIndex": 3,
        "type": "0x0",
        "v": "0x2b",
        "value": "230000000000000000"
    }
]
```

In case service does not track the address 404 Not Found HTTP error will returned 

