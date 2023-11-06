function processForTrelloTrigger() {
    //Check for new file in folder
    // Get the directory that you want to list the files in.
    var directory = DriveApp.getFolderById('1Z4GIsZnvm-PyDad9NYqO_r4yi6aaHRw8u');
  
    // Get the files in the directory.
    let files = directory.getFiles();
    let boardName = '';
    let emailAdddressToUse = '';
    let processed = false;
    while (files.hasNext()) {
      file = files.next();
      processed = false;
      //Get board name from file name
      let length = file.getName().length;
      if (file.getName().indexOf("trello_") === 0) {
        Logger.log('file name: ' + file.getName());
        var fileId = Drive.Files.insert({mimeType: MimeType.GOOGLE_DOCS}, file.getBlob()).id;
        var tempFile = DocumentApp.openById(fileId);
        var textToParse = tempFile.getBody().getText();
        Logger.log('textToParse: ' + textToParse);
        boardName = file.getName().substring(7, length-4);
        Logger.log('boardName: ' + boardName);
        emailAdddressToUse = getEmailAddress(boardName);
        Logger.log('emailAddress: ' + emailAdddressToUse);
  
        //Parse textToParse into lines consisting of Title and Description
        processed = processTextToParse(boardName, emailAdddressToUse, textToParse);
  
        //Remove the temp Google Doc  
        DriveApp.getFileById(tempFile.getId()).setTrashed(true);
      }  
      if (processed === true) {
        let subject = "Trello Cards Created in " + boardName;
        var remainingQuota = MailApp.getRemainingDailyQuota();
        body = "Processing completed. Remaing number of emails for the day: " + remainingQuota;
        sendEmail("<your_email_address>@gmail.com", subject, body);
        
        //Once done delete file (PDF only or will lose the script!) so directory is empty
        if (file.getName().indexOf("trello_") === 0) {
          let newName = "old_" + file.getName();
          // file.setTrashed(true);
          Logger.log("File being renamed to: " + newName);
          file.setName(newName);
        }
      }
    }
  }
  
  function processTextToParse(boardName, emailAdddressToUse, textToParse) {
    let processed = false;
    if (boardName !== null && emailAdddressToUse !== null && textToParse !== null) {
  
      // Split the string on the : character.
      var parts = textToParse.split(':');
  
      try {
        for (var i = 0; i < parts.length; i += 2) {
          if (parts[i] !== '' && parts[i + 1] !== undefined) {
            let subject = parts[i] + " #DRAFT @simon932";
            sendEmail(emailAdddressToUse, subject, parts[i + 1]);
            processed = true;
          }
        }
        } catch (e) {
          processed = false;
          Logger.log("An error occured and processing stopped. boardName: " + boardName + " emailAddressToUse: " + emailAdddressToUse + " textToParse: " + textToParse);
          Logger.log("Exception thrown: " + e.message);
          var remainingQuota = MailApp.getRemainingDailyQuota();
          Logger.log("Remaining Email Quota: " + remainingQuota);
        }
    } else {
      Logger.log("An error occured and processing stopped. boardName: " + boardName + " emailAddressToUse: " + emailAdddressToUse + " textToParse: " + textToParse);
    }
  
    // Get the remaining quota. 
    var remainingQuota = MailApp.getRemainingDailyQuota();
    Logger.log("Remaining Email Quota: " + remainingQuota);
    
    return processed;
  }
  
  function getEmailAddress(boardName) {
    if (boardName === 'Board 1') { return 'simon932+ultprgt8rxphsvlevhfs@boards.trello.com'}
    if (boardName === 'Board 2') { return 'simon932+yb6qbnzxcmf3dhdgsqbz@boards.trello.com'}
    if (boardName === 'Project 1') { return 'simon932+zqgce7afmoomjncjx5jv@boards.trello.com'}
  
    return 'unknown';
  }
  
  function sendEmail(recipient, subject, body) {
    MailApp.sendEmail(recipient, subject, body);
    Logger.log("sendEmail: recipent: " + recipient + " subject: " + subject + " body: " + body);
  }
  
