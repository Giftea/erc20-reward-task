require('dotenv').config();
const axios = require('axios');
const { Web3Storage } = require('web3.storage');
const storageClient = new Web3Storage({
  token: process.env.SECRET_WEB3_STORAGE_KEY,
});

async function retrieveFromCid(cid) {
  const res = await storageClient.get(cid.replace(/['"]/g, ''));

  if (res?.ok) {
    const file = await res.files();
    const url = `https://${file[0].cid}.ipfs.w3s.link/?filename=${file[0].name}`;

    try {
      const output = await axios.get(url);
      return output.data;
    } catch (error) {
      console.log('ERROR', error);
    }
  } else {
    return false;
  }
}

module.exports = { retrieveFromCid };
