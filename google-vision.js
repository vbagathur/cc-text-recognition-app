const path = require('path')
const dotenv = require('dotenv').config();

const vision = require('@google-cloud/vision');
const {GoogleAuth, grpc} = require('google-gax');

const apiKey = process.env.VISION_API_KEY;

function getApiKeyCredentials() {
  const sslCreds = grpc.credentials.createSsl();
  const googleAuth = new GoogleAuth();
  const authClient = googleAuth.fromAPIKey(apiKey);
  const credentials = grpc.credentials.combineChannelCredentials(
    sslCreds,
    grpc.credentials.createFromGoogleCredential(authClient)
  );
  return credentials;
}

// initialize the client
const sslCreds = getApiKeyCredentials();
const client = new vision.ImageAnnotatorClient({sslCreds});

async function recognizeReceipt(userId,receiptNo,targetFile) {

  // Performs text detection on the local file
  const [result] = await client.textDetection(targetFile);
  const detections = result.textAnnotations;
  console.log('Text:');
  let retText=[];
  // detections.forEach((text,index) => retText+='{ ' + index +' : "'+ text['description'] + '" }' );

  detections.forEach(text => retText.push(text['description']) );
  console.log(retText[0]); 
  return retText[0];
}

module.exports.recognizeReceipt = recognizeReceipt;