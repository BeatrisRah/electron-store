import { app, BrowserWindow, ipcMain } from 'electron'
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

async function connectToTables() {
  await client.query(`
    CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
    );`)

  await client.query(`
    CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    company_id INTEGER REFERENCES companies(id),
    quantity INTEGER NOT NULL DEFAULT 0,
    current_price DECIMAL(10, 2) NOT NULL,
    last_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `)
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
    await connectToTables()
  } catch(err){
    console.error('Database error:', err)
    
  }
})

ipcMain.handle('get-all-items', async() => {
  const res = await client.query(`
  SELECT 
    items.*,
    companies.name AS company_name
  FROM items
  JOIN companies ON items.company_id = companies.id`)
  return res.rows;
})

type Item = {
  name: string,
  type: string,
  company_name: string,
  quantity: number,
  currentPrice:number,
  lastPrice?:number,
}

ipcMain.handle('add-item', async(_event, item:Item ) => {
  try{
    await client.query("BEGIN");

  const companyRes = await client.query(
    `
    WITH company_entry AS (
      INSERT INTO companies (name)
      VALUES ($1)
      ON CONFLICT (name) DO NOTHING
      RETURNING id
    )
    SELECT id FROM company_entry
    UNION
    SELECT id FROM companies WHERE name = $1
    `,
    [item.company_name]
  );

  const companyId = companyRes.rows[0]?.id;
  if (!companyId) throw new Error("Failed to find or insert company");

  const insrtedRes =  await client.query(
    `
    INSERT INTO items (
      name,
      type,
      quantity,
      current_price,
      last_price,
      company_id
    ) VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      item.name,
      item.type,
      item.quantity,
      item.currentPrice,
      item.lastPrice ?? null,
      companyId,
    ]
  );

  await client.query("COMMIT");
  console.log("Item inserted successfully");
  return insrtedRes.rows[0]
  
  } catch(err){
    await client.query("ROLLBACK");
    console.error("Error inserting item:", err);
    throw err;
  }
})

ipcMain.handle('get-companies', async () => {
  const result = await client.query('SELECT name FROM companies ORDER BY name');
  return result.rows.map(row => row.name);
});
