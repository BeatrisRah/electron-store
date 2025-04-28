import { app, BrowserWindow } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path';
import 'dotenv/config';
import { Client } from 'pg';

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config = {
  user: process.env['DB_USER'],
  host: 'localhost',
  password: process.env['DB_PASS'],
  port: 5432,
  database: 'store_db', 
};

let client: Client;


process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width:1920,
    height:1080,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })


  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

async function connectDB(){
  const tempClient = new Client({
    ...config,
    database:'postgres'
  })

  await tempClient.connect()
  const result = await tempClient.query(
    `SELECT 1 FROM pg_database WHERE datname='${config.database}'`
  );

  if (result.rowCount === 0) {
    console.log(`Database ${config.database} does not exist. Creating...`);
    await tempClient.query(`CREATE DATABASE ${config.database}`);
    console.log(`Database ${config.database} created.`);
  } else {
    console.log(`Database ${config.database} already exists.`);
  }

  await tempClient.end();

  client = new Client(config);
  await client.connect();
  console.log('Connected to database:', config.database);

}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(async () => {
  createWindow()
  try{
    await connectDB()
  } catch(err){
    console.error('Database error:', err)
    
  }
})
