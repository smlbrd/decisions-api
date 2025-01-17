/* Changed to koa  */
/* Need to work out to connect to mongoDb/mongoose?? */


import koa from 'koa';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import sqlite3 from 'sqlite3'; //change to mongoDB*******
import { open } from 'sqlite'; //change to mongoDB ******
import { availableParallelism } from 'os';
import cluster from 'cluster';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';

// open the database file - mongoDB - just use our connectDB - database.js ??
(async () => {
  const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database,
  });

  // create our 'messages' table (you can ignore the 'client_offset' column for now)
  //*** Necessary for us??? *** */
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNIQUE,
        content TEXT
    );
  `);

  if (cluster.isPrimary) {
    const numCPUs = availableParallelism();
    // create one worker per available core
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork({
        PORT: 3000 + i,
      });
    }

    // set up the adapter on the primary thread
    setupPrimary();
  } else {
    const app = koa();
    const server = createServer(app);
    const io = new Server(server, {
      connectionStateRecovery: {},
      // set up the adapter on each worker thread
      adapter: createAdapter(),
    });

    const __dirname = dirname(fileURLToPath(import.meta.url));

    app.use(async (ctx) => {
      if (ctx.path === '/') {
        ctx.type = 'html';
        ctx.body = await fs.promises.readFile(
          join(__dirname, 'index.html'),
          'utf-8'
        );
      }
    });

    io.on('connection', (socket) => {
      console.log('a user connected');
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });

    io.on('connection', async (socket) => {
      socket.on('chat message', async (msg, clientOffset, callback) => {
        let result;
        try {
          result = await db.run(
            'INSERT INTO messages (content, client_offset) VALUES (?, ?)',
            msg,
            clientOffset
          );
        } catch (e) {
          if (e.errno === 19 /* SQLITE_CONSTRAINT */) {
            // the message was already inserted, so we notify the client
            callback();
          } else {
            // nothing to do, just let the client retry
          }
          return;
        }
        io.emit('chat message', msg, result.lastID);
        // acknowledge the event
        callback();
      });

      if (!socket.recovered) {
        try {
          await db.each(
            'SELECT id, content FROM messages WHERE id > ?',
            [socket.handshake.auth.serverOffset || 0],
            (_err, row) => {
              socket.emit('chat message', row.content, row.id);
            }
          );
        } catch (e) {
          // something went wrong
        }
      }
    });

    const port = process.env.PORT;

    server.listen(port, () => {
      console.log(`server running at http://localhost:${port}`);
    });
  }
})();
