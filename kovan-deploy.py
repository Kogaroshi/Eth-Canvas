from web3 import Web3, HTTPProvider
import sys
import os
import json
import time
from pprint import pprint

w3 = Web3(HTTPProvider("http://37.187.153.186:8554",request_kwargs={'timeout':60})) #Kovan node

with open('./kovan-private-key.txt') as keyfile:
    metaKey = keyfile.read()
metaAccount = w3.eth.account.from_key(metaKey)

with open("./eth/build/contracts/Pixel.json") as f:
    pixelContract = json.load(f)


Pixel = w3.eth.contract(abi=pixelContract['abi'], bytecode=pixelContract['bytecode'])
tx_dict = Pixel.constructor().buildTransaction({
    'from' : metaAccount.address,
    'nonce' : w3.eth.getTransactionCount(metaAccount.address)
})
tx = w3.eth.account.signTransaction(tx_dict, metaAccount.key)
result = w3.eth.sendRawTransaction(tx.rawTransaction)
print(result.hex())
txReceipt = w3.eth.waitForTransactionReceipt(result)
pprint(txReceipt)
print(txReceipt['contractAddress'])