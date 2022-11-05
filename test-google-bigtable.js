const path = require('path')
const dotenv = require('dotenv').config();

// Imports the Google Cloud client library
const {Bigtable} = require('@google-cloud/bigtable');

const bigtable = new Bigtable();

async function writeReadSimple() {
  // Connect to an existing instance:my-bigtable-instance
  const instance = bigtable.instance(process.env.BIGTABLE_INSTANCE_ID);

  // Connect to an existing table:my-table
  const table = instance.table(process.env.BIGTABLE_TABLE_ID);

  const timestamp = new Date();
  const rowToInsert = {
    key: 'phone#4c410523#20190501',
    data: {
      stats_summary: {
        connected_cell: {
          value: 1,
          timestamp,
        },
        connected_wifi: {
          value: 1,
          timestamp,
        },
        os_build: {
          value: 'PQ2A.190405.003',
          timestamp,
        },
      },
    },
  };

  await table.insert(rowToInsert);

  console.log(`Successfully wrote row ${rowToInsert.key}`);

  // Read a row from my-table using a row key
  const [singleRow] = await table.row('phone#4c410523#20190501').get();

  // Print the row key and data (column value, labels, timestamp)
  const rowData = JSON.stringify(singleRow.data, null, 4);
  console.log(`Row key: ${singleRow.id}\nData: ${rowData}`);

}
writeReadSimple();