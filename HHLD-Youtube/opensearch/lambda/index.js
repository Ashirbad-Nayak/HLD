import express from 'express';
import { Client } from "@opensearch-project/opensearch";
import serverless from 'serverless-http';
const app = express();

// Route for handling search requests
app.get('/search', async (req, res) => {
 try {
   console.log('Inside search query');
   // Extract query parameter from the request
   const searchTerm = req.query.q || '';

   console.log('search term is ', searchTerm);
   // Example search query

   var host_aiven = 'YourOSHostHere'; // Replace with your OpenSearch host
   var client = new Client({
       node: host_aiven
   });

   const { body } = await client.search({
     index: 'video',//'all_stocks', // Index name in OpenSearch
     body: {
       query: {
        "match": {
          //"name" //for stock broker app
          "title": {
            "query": searchTerm,
            "fuzziness": "Auto"
          }
        }
      }
     }
   });

   // Process search results
   const hits = body.hits.hits;
   console.log(hits);

   res.status(200).json(hits);
 } catch (error) {
   console.error(error);
   res.status(500).json({ message: 'Internal Server Error' });
 }
});

// Wrap the Express app with serverless-http
const wrappedApp = serverless(app);

// Export the wrapped app for Serverless Framework
export const handler = wrappedApp;