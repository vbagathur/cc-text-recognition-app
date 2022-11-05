const path = require('path')
const dotenv = require('dotenv').config();

// Imports the Google Cloud client library
const {Bigtable} = require('@google-cloud/bigtable');

const bigtable = new Bigtable();

async function quickstart() {
  // Connect to an existing instance:my-bigtable-instance
  const instance = bigtable.instance(process.env.BIGTABLE_INSTANCE_ID);

  // Connect to an existing table:my-table
  const table = instance.table(process.env.BIGTABLE_TABLE_ID);

  const timestamp = new Date();
  const row = table.row('phone#4c410523#20190501');
  const filter = [
    {
      column: 'os_build',
      value: {
        start: 'PQ2A',
        end: 'PQ2A',
      },
    },
  ];

  const config = {
    onMatch: [
      {
        method: 'insert',
        data: {
          stats_summary: {
            os_name: 'android',
            timestamp,
          },
        },
      },
    ],
  };

  await row.filter(filter, config);

  // Read a row from my-table using a row key
  const [singleRow] = await table.row('r1').get();

  // Print the row key and data (column value, labels, timestamp)
  const rowData = JSON.stringify(singleRow.data, null, 4);
  console.log(`Row key: ${singleRow.id}\nData: ${rowData}`);
}
quickstart();