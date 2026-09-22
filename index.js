import app from "./app.js";
import { initdb } from "./src/Services/lowJSON.js";
const PORT = 3000;

app.listen(PORT, () => {
  initdb();
  console.log(`Server running on port ${PORT}`);
});
