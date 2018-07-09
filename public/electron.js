const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./db.sqlite"
  }
});

knex.schema.hasTable('prize').then(function(exists) {
  if (!exists) {
    return knex.schema.createTable('prize', function(t) {
    t.increments();
    t.string('name');
    t.integer('quantity');
    })
  }
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    // frame: false,
    // fullscreen: true
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', () => {
  createWindow();

  ipcMain.on("adminPageLoaded", () => {
    knex.select().table('prize')
    .then((prizes)=>{
      mainWindow.webContents.send("prizeSent", prizes);
    })
  })

  ipcMain.on("addPrize", (event, args) => {
    knex('prize').insert([{
      name: args.name,
      quantity: args.quantity
    }]).then((prizeIds)=>{
      knex.select().table('prize').where('id', prizeIds[0])
      .then((prizes) => {
        mainWindow.webContents.send("prizeAdded", prizes[0]);
      })
    })
  })

  ipcMain.on("deletePrize", (event, args) => {
    knex('prize').delete().where('id', args.id)
    .then((result) => {
      mainWindow.webContents.send("prizeDeleted", result);
    })
  })

  ipcMain.on("editPrize", (event, args) => {
    knex('prize')
    .where('id', args.id)
    .update({
      name: args.name,
      quantity: args.quantity
    }).then((result) => {
      mainWindow.webContents.send("prizeEdited", result);
    })
  })

  ipcMain.on("getRandomPrize", (event, args) => {
    knex.select().table('prize').orderByRaw('RANDOM()').limit(1)
    .then(prize => {
      
      knex('prize').where('id', prize[0].id)
      .update({
        quantity: prize[0].quantity - 1
      }).then(()=>{
        mainWindow.webContents.send("randomPrizeSent", prize[0])
      })
    })
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
