module.exports = {
  apiAddress: 'http://71.237.7.8:8000',
  provider: 'https://kovan.infura.io',
  etherscan: 'https://kovan.etherscan.io/',
  cacherWSServer: 'ws://71.237.7.8:1812',
  defaultTokens: [
    '0xAE7Fed61555838b7C38684DF0E35ef19BDA405Ee',
    '0x16056734afb539A029Af949b56F968B3baE0c064',
    '0x9C4785ce89a3d0Bb9a369d8672d4Df19aaEe0568',
    '0x36FE3dbB5a5D769FdCF88d8C3384C75b305515dc',
    '0x9e0c1ffbfda9486eae55c3642bcc965d8ea24eca',
    '0xc5d93c777ba0e35ff9f7d3b07cab96a22d811528',
    '0xda18e3919cebca9a6570ef3293fb5e17f8045fc8',
    '0xa71654e08ee04551a744277dd8b0d8aa863ad02b',
    '0x31d1282569b35a107f3fa743646d55cef434e41e'
  ],
  defaultMarket: {
    '_id': '5b654c17910a780b70365fd5',
    'name': 'LootSafe',
    'address': '0x159f3be04024d12C4adB8f7FDEb0931B7949965C',
    'token_type': 'ERC20'
  },
  autoRefreshInterval: 5000,
  pubnub: {
    publishKey: 'pub-c-98125911-7f1f-4242-a1e7-793109201f5d',
    subscribeKey: 'sub-c-4fd1528c-ac0f-11e8-bf00-aaab7b0b8683'
  }
}
