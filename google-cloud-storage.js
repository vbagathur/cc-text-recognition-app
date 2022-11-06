/**
 * This code originally from here
 * https://www.woolha.com/tutorials/node-js-upload-file-to-google-cloud-storage 
 */


 const path = require('path')
 const dotenv = require('dotenv').config();

const { Storage } = require('@google-cloud/storage');
  
  const storage = new Storage({
    projectId: process.env.GOOGLE_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });

  exports.getPublicUrl = (bucketName, fileName) => `https://storage.googleapis.com/${bucketName}/${fileName}`;
 
  /**
   * Copy file from local to a GCS bucket.
   * Uploaded file will be made publicly accessible.
   *
   * @param {string} localFilePath
   * @param {string} bucketName
   * @param {Object} [options]
   * @return {Promise.<string>} - The public URL of the uploaded file.
   */
  exports.copyFileToGCS = (localFilePath, bucketName, options) => {
    options = options || {};
  
    const bucket = storage.bucket(bucketName);
    const fileName = path.basename(localFilePath);
    const file = bucket.file(fileName);
  
    let status;
    try {
     status = bucket.upload(localFilePath, options)
      .then(() => file.makePublic())
      .then(() => exports.getPublicUrl(bucketName, bucketName));
    }catch(e){
      console.log(e);
    }
    
    return status;
  };