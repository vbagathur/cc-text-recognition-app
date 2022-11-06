const path = require('path')
const dotenv = require('dotenv').config();

// Imports the Google Cloud client library
const {Bigtable} = require('@google-cloud/bigtable');

const bigtable = new Bigtable();
// Connect to an existing instance:my-bigtable-instance
const instance = bigtable.instance(process.env.BIGTABLE_INSTANCE_ID);
// Connect to an existing table:my-table
const table = instance.table(process.env.BIGTABLE_TABLE_ID);

async function insertRecord(userId, receiptId, receiptObj) {
    try {
        const timestamp = new Date();
        const rowToInsert = {
          key: userId + '-' + receiptId,
          data: {
            receiptText: {
              description: receiptObj
            }
          }
        };
      
        await table.insert(rowToInsert);
      
        console.log(`Successfully wrote row ${rowToInsert.key}`);
      
      
    } catch (err) {
      console.log(err.message);
    }
}

async function queryRecord(userId, receiptId) {
// Read a row from my-table using a row key
    try {
    const [singleRow] = await table.row(userId + '-' + receiptId).get();

    // Print the row key and data (column value, labels, timestamp)
    const rowData = JSON.stringify(singleRow.data, null, 4);
    console.log(`Row key: ${singleRow.id}\nData: ${rowData}`);

    return rowData;

  }catch(e){
    console.log('Unable to find or get row with key:'+'r1');
    console.log(e);
  }
}

module.exports.queryRecord = queryRecord;
module.exports.insertRecord = insertRecord;
