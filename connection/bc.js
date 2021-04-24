const Web3 = require("web3");

const connectBC = async () => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.LOCAL_NODE)
  );
  console.log(`Blockchain connected: ${web3._requestManager.provider.host}`);
  //console.log(web3);
};

// Write there code to interact with contracts, then export them. See examples.

module.exports = connectBC;
