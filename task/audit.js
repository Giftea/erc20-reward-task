require('dotenv').config();
const { Web3 } = require('web3');
const web3 = new Web3(`https://goerli.infura.io/v3/${process.env.INFURA_ID}`);
const { namespaceWrapper } = require('../_koiiNode/koiiNode');

class Audit {
  async validateNode(submission_value, round) {
    let vote;
    console.log('SUBMISSION VALUE', submission_value, round);
    try {
      const txReceipt = await web3.eth.getTransactionReceipt(submission_value);

      if (txReceipt) {
        if (txReceipt.status) {
          // For successful flow we return true (Means the audited node submission is correct)
          vote = true;
          console.log('Transaction is successful');
        } else {
          // For unsuccessful flow we return false (Means the audited node submission is incorrect)
          vote = false;
          console.log('Transaction has failed');
        }
      } else {
        vote = false;
        console.log('Transaction not found');
      }
    } catch (error) {
      vote = false;
      console.error('Error fetching transaction status:', error);
    }
    return vote;
  }

  async auditTask(roundNumber) {
    console.log('auditTask called with round', roundNumber);
    console.log(
      await namespaceWrapper.getSlot(),
      'current slot while calling auditTask',
    );
    await namespaceWrapper.validateAndVoteOnNodes(
      this.validateNode,
      roundNumber,
    );
  }
}
const audit = new Audit();
module.exports = { audit };
