#!/usr/bin/env node

const { createGameServer } = require('./server/httpServer');
const { SAVE_FILE } = require('./server/saveManager');

const PORT = parseInt(process.env.PORT, 10) || 8080;
const server = createGameServer();

server.listen(PORT, () => {
  console.log(`\x1b[36m\x1b[1m============================================================\x1b[0m`);
  console.log(`\x1b[35m\x1b[1m   ARCANASTRIDE 3D: MMORPG SERVER ONLINE (PORT ${PORT})   \x1b[0m`);
  console.log(`\x1b[36m\x1b[1m============================================================\x1b[0m`);
  console.log(`1. Landing Screen:  \x1b[32mhttp://localhost:${PORT}/\x1b[0m`);
  console.log(`2. MMORPG Realm:    \x1b[32mhttp://localhost:${PORT}/realm\x1b[0m`);
  console.log(`3. Save file:       \x1b[36m${SAVE_FILE}\x1b[0m`);
});