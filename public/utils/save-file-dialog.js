const { dialog } = require("electron");
const path = require("path");
const fs = require("fs");

const saveFile = (dataToSave) => {
  // Resolves to a Promise<Object>
  dialog
    .showSaveDialog({
      title: "Select the File Path to save",
      defaultPath: path.join(__dirname, "../assets/exported.csv"),
      // defaultPath: path.join(__dirname, '../assets/'),
      buttonLabel: "Save",
      // Restricting the user to only Text Files.
      filters: [
        {
          name: "Text Files",
          extensions: ["csv"]
        }
      ],
      properties: []
    })
    .then((file) => {
      // Stating whether dialog operation was cancelled or not.
      console.debug(file.canceled);
      if (!file.canceled) {
        // Creating and Writing to the sample.txt file
        fs.writeFile(file.filePath.toString(), dataToSave, function (err) {
          if (err) throw err;
          console.info(`File Saved on ${file.filePath.toString()}!`);
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = { saveFile };
