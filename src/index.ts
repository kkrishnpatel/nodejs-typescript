import { createConnection } from "typeorm";
import createServer from "./server";
const app = createServer();
app.listen(process.env.PORT, async () => {
  await createConnection();
  console.log("DB connection established and connected to server", process.env.PORT);
});
