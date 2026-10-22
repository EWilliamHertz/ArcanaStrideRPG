#!/usr/bin/env node

const { createGameServer } = require('./server/httpServer');
const { SAVE_FILE } = require('./server/saveManager');

const PORT = process.env.PORT || 8080;
const server = createGameServer();

server.listen(PORT, () => {
  console.log(`\x1b[36m\x1b[1m============================================================\x1b[0m`);
  console.log(`\x1b[35m\x1b[1m   ARCANASTRIDE 3D: MMORPG SERVER ONLINE (PORT ${PORT})   \x1b[0m`);
  console.log(`\x1b[36m\x1b[1m============================================================\x1b[0m`);
  console.log(`1. Click \x1b[33m"Web Preview"\x1b[0m -> \x1b[32m"Preview on port 8080"\x1b[0m or open your ngrok tunnel.`);
  console.log(`2. Press \x1b[33m[O]\x1b[0m for Attributes & Draggable Skills, \x1b[33m[I]\x1b[0m for Inventory & Wargear.`);
  console.log(`3. Save file location: \x1b[36m${SAVE_FILE}\x1b[0m`);
});