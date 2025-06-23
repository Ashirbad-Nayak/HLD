
import { Client } from "@opensearch-project/opensearch";

const PushToOpenSearch =  async (title, description, author, videoUrl) => {
   try {

       console.log('Pushing to Open Search');
       // Process video upload and extract metadata
       var auth = "YourOSUsername:YourOSPasswordHere"; // For testing only. Don't store credentials in code.
       var host_aiven = `https://${auth}@YourOSHostHere:YourOSPortHere`;
      
       var client = new Client({
           node: host_aiven
       });

       var index_name = "video";
       var document = {
           title: title,
           author: author,
           description: description,
           videoUrl: videoUrl
       };

       var response = await client.index({
           id: title, // id should ideally be db id
           index: index_name,
           body: document,
           refresh: true,
       });
       console.log("Adding document:");
       console.log(response.body);
      
   } catch (error) {
       // Respond with error message
       console.log(error.message)
   }
};
export default PushToOpenSearch;