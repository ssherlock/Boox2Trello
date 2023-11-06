function moveTrelloFilesTrigger() {
    // Get the directory that you want to list the files in.
    var directory = DriveApp.getFolderById('187z-KitcrQ9CNH33eMKBTRssWzK5MSl4');
  
    // Get the files in the directory.
    let files = directory.getFiles();
    while (files.hasNext()) {
      file = files.next();
      let length = file.getName().length;
      let newName = "";
      if (file.getName().indexOf("trello_") === 0) {
        newName = file.getName().substring(7, length+1);
        console.log("Renamed file: " + newName);
        var newPath = DriveApp.getFolderById('1Z4GIsZnvm-PyDad9NYqO_r4yi6aaHRw8u');
        console.log("newPath: " + newPath);
        file.moveTo(newPath);
      }
    }
  }
  
