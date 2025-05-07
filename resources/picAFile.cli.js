const { app, dialog } = require('electron');

app.whenReady().then(async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile']
  });

  if (!result.canceled && result.filePaths.length > 0) {
    console.log(result.filePaths[0]);
    run(result.filePaths[0]);
  } else {
    console.log('No file selected.');
  }

  app.quit();
});
