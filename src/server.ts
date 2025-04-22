import app from "./app";
import { Server } from "http";
import config from "./app/config";

async function main() {
    const server: Server = app.listen(config.port, () => {
        console.log(`PH_Health_Care Server listening on port ${config.port}`)
    })
};

main();