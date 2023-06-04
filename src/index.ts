import { createConnection } from "typeorm";
import createServer from "./server";
const app = createServer();
app.listen(process.env.PORT, async () => {

  //Need to update CRM version and connections
  await createConnection();
  console.log("DB connection established and connected to server", process.env.PORT);
});
