import axios from "axios";

const BASE_API_URL = "http://localhost:5000";

/* 
  json-server will give you CRUD endpoints on snacks and drinks.
  Here we've provided you with a single action to get all drinks.

  You'll need to add to this class as you build features for the app.
*/

class AllBooksData {

  static async Business() {
    const result = await axios.get(`${BASE_API_URL}/business`);
    return result.data;
  }
  static async Art() {
    const result2 = await axios.get(`${BASE_API_URL}/art`)
    console.log(result2)
    return result2.data;
  }

  

}

export default SnackOrBoozeApi;
