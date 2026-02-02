const app = require("./src/config/express.config");
require("dotenv").config();
const port = process.env.PORT || 9005;

app.listen(port, () => {
  try{
    console.log(`Server is running on port ${port}`);
  }catch(excption){
    console.log(excption);
  }
});