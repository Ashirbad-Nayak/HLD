
import fs from 'fs';
import { parse } from 'csv-parse';
// import { PrismaClient } from '@prisma/client';
import { Client } from "@opensearch-project/opensearch";

const LoadStockData = async (req, res) => {
//  const prisma = new PrismaClient();
 const csvFilePath = '/HHLD-STOCK-BROKER/market_data_service/complete.csv';//downlaod and keep it at a path, its avaialble online in internet by upstox
 const stocksDataForOpenSearch = [];

 fs.createReadStream(csvFilePath)
   .pipe(parse({ delimiter: ',', quote: '"', columns: true }))
   .on('data', async (row) => {
     try {
       console.log('Adding to OpenSearch');

       //sending data to opensearch
       var host = process.env.AIVEN_HOST;
       var client = new Client({
         node: host
       });

       var index_name = "all_stocks";
       var stock_data = {
         instrumentKey: row["instrument_key"],
         name: row["name"],
         type: row["instrument_type"],
         exchange: row["exchange"]
       };

       var response = await client.index({
        // id: title, // (let elastic search take care of id)
         index: index_name,
         body: stock_data,
         refresh: true,
       });

       console.log(stock_data);
       console.log(response);
     } catch (error) {
       console.error(`Error inserting row: ${JSON.stringify(row)}, Error: ${error}`);
     }
   })
   .on('end', async () => {
     console.log('CSV file successfully processed.');
    //  await prisma.$disconnect();
   })
   .on('error', (error) => {
     console.error('Error parsing CSV:', error);
   });
}

export default LoadStockData; 