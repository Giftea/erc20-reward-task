require('dotenv').config();
const { namespaceWrapper } = require('../_koiiNode/koiiNode');
const { Web3Storage, File } = require('web3.storage');
const storageClient = new Web3Storage({
  token: process.env.SECRET_WEB3_STORAGE_KEY,
});
const nodeEthAddress = process.env.RECIPIENT_ADDRESS;

class Submission {
  async task(round) {
    try {
      const value = 'Hello, World!';
      // Create a submission object with the value and nodeEthAddress
      const submission = {
        value,
        nodeEthAddress,
      };
  
      // Convert the submission object into a Blob for structured data
      const blob = new Blob([JSON.stringify(submission)], {
        type: 'application/json',
      });
  
      // Create a File containing the Blob with a specified filename
      const files = [new File([blob], 'submission.json')];
  
      // Upload to IPFS
      const cid = await storageClient.put(files);
      console.log('stored files with cid:', cid);
  
      // Check if the CID was obtained
      if (cid) {
        // Store the CID under the 'value' key using namespaceWrapper
        await namespaceWrapper.storeSet('value', cid);
      }
  
      return cid;
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
