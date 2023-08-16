require('dotenv').config();
const { namespaceWrapper } = require('../_koiiNode/koiiNode');
const { Web3 } = require('web3');
const tokenContractABI = require('../abi/KToken.json');

const web3 = new Web3(`https://goerli.infura.io/v3/${process.env.INFURA_ID}`);
const tokenContractAddress = process.env.TOKEN_CONTRACT_ADDRESS;

const privateKey = process.env.PRIVATE_KEY;

const userAddress = '0x9329dd1Be0D10B5D8C5C641F45de62c054272760';

class Submission {
  async task(round) {
    try {
      const tokenContract = new web3.eth.Contract(
        tokenContractABI,
        tokenContractAddress,
      );

      const gasPrice = await web3.eth.getGasPrice();
      const rewardAmount = '10000000000000000000';
      const txData = tokenContract.methods
        .transfer(userAddress, rewardAmount)
        .encodeABI();

      const nonce = await web3.eth.getTransactionCount(
        process.env.CONTRACT_OWNER_ADDRESS,
        'latest',
      );

      const tx = {
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: web3.utils.toHex(300000),
        to: tokenContractAddress,
        data: txData,
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      const txReceipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
      );

      if (txReceipt.transactionHash) {
        // store value on NeDB
        await namespaceWrapper.storeSet('value', txReceipt.transactionHash);
      }
      return txReceipt.transactionHash;
    } catch (err) {
      console.log('ERROR IN EXECUTING TASK', err);
      return 'ERROR IN EXECUTING TASK' + err;
    }
  }

  async submitTask(roundNumber) {
    console.log('submitTask called with round', roundNumber);
    try {
      console.log('inside try');
      console.log(
        await namespaceWrapper.getSlot(),
        'current slot while calling submit',
      );
      const submission = await this.fetchSubmission(roundNumber);
      console.log('SUBMISSION', submission);
      await namespaceWrapper.checkSubmissionAndUpdateRound(
        submission,
        roundNumber,
      );
      console.log('after the submission call');
      return submission;
    } catch (error) {
      console.log('error in submission', error);
    }
  }

  async fetchSubmission(round) {
    // Write the logic to fetch the submission values here and return the cid string

    // fetching round number to store work accordingly

    console.log('IN FETCH SUBMISSION');

    // The code below shows how you can fetch your stored value from level DB

    const value = await namespaceWrapper.storeGet('value'); // retrieves the value
    console.log('VALUE', value);
    return value;
  }
}
const submission = new Submission();
module.exports = { submission };
