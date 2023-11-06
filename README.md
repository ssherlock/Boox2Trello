# Boox2Trello
Google apps scripts for converting notes taken on the Boox handwriting tablet into Trello cards
## Introduction
I bought the Boox Note Air 2 Plus because I am constantly scribbling down notes and designs for projects I hope to start one day. The fact I never get round to half of them is another issue, but still it means I have bits of paper all over the place.  So buying this enables me to keep said notes in one place on a device that can also be backed up.

Having read the article by Michal Wlosik at https://medium.com/@MichalWlosik/new-method-how-to-sync-onyx-boox-note-air-2-handwritten-notes-with-your-google-drive-with-ocr-c314b26499f7 I started to think how it would be nice to be able to add some of my job ideas to a Trello board, something else I use for organising jobs and projects, once I actually start them of course!

But what I found was that, with later firmware updates, cloud storage to other cloud providers, such as Google Drive and Dropbox etc already exists.  This meant that, for what I wanted, I didn’t need to install the extra software Michal mentions and, with a bit of scripting, I could use it for creating Trello cards from my hand-written notes.  Let’s ignore the fact that the Boox tablets are fully fledged Android devices and the Trello app can be installed and used that way if you so wish, but the ease of being able to write what I need and have it translated into a card was just too much for a tinkerer like me to resist…

## Setup Cloud Connection
I’m going to concentrate on Google Drive here as that is what I use mostly but I have tried syncing notes with DropBox and OneNote quite successfully (though not tried the OCR side of the others).

To bind your Google Drive account to your Boox device, first go to **Settings** and then choose **Accounts**, followed by **View Notes Sync Accounts** and choose **Bind Account**.  This gives you a list to choose from, so we choose Google Drive and log in with our Google account.

Make sure that **Enable notes sync (export)** is turned On and from now on all notes created on the tablet should sync with Google Drive.

You can go ahead and test this by editing a note then checking on Google Drive to see if it has synced.  For me the folder structure on Google Drive is as follows, but it may vary depending on the firmware version (odd I know but it changed for me when I upgraded to the latest).

![Screenshot from 2023-11-05 08-58-54](https://github.com/ssherlock/Boox2Trello/assets/501364/1914f5b8-1cde-460d-8c47-a11daf307710)

## Trello
Trello - https://trello.com/ - is a web based tool for creating jobs and lists and also for Kanban style projects.  It has a free tier but also a premium one which adds a LOT of functionality.  For what we are doing here the free one is fine.

Create a new board, calling it whatever your latest project might be.  

The default Kanban style board will be created with 3 lists; To do, Doing and Done but you can add more and/or rename these as you wish.

![Screenshot from 2023-11-05 09-12-32](https://github.com/ssherlock/Boox2Trello/assets/501364/4df09265-47b3-430c-97f2-ad4bd928da10)

Before we start the scripting part, grab the email address that will be used for emailing in our OCR’ed jobs to add to the To Do list.

Click on the ellipsis menu on the top right of the Trello page. 

![Screenshot from 2023-11-05 09-13-39](https://github.com/ssherlock/Boox2Trello/assets/501364/bb28ffd7-9124-41e4-a8be-6aa4cc1249c8)

This will give you a dropdown menu that gives you a lot of features

![Screenshot from 2023-11-05 09-14-31](https://github.com/ssherlock/Boox2Trello/assets/501364/cab7218e-ee47-4e15-9b29-741afed049ca)

Choose **Email-to-board** that gives you an email address that can be used for creating trello cards from an email. Take note of the email address and also check that new cards will be produced in the list you want as well.  The email address will follow this format:  

**simon932**```+zqgce7afmhhmjncjx5jv@boards.trello.com```

Note the bit in bold as this is your username and will be used in the script

Creating labels is also a good idea as it makes it easier to spot which cards are more important than others.  I use Draft as a label so I can quickly see the newest cards and check that the OCR worked etc.  It can also be used to indicate a card needs assigning to other users and so on

![Screenshot from 2023-11-05 09-58-40](https://github.com/ssherlock/Boox2Trello/assets/501364/918829b6-c70a-4161-8416-ab80ee3976b3)

Now we are ready to test this before creating the script so you know you have the correct bits of information and that emailing it creates a card as you want.

In your email client create a mail to the email address you got above, and put the following in the Subject line: 
**Test #DRAFT @simon932**

**Test** is the title for the new card, **#DRAFT** will label the card as DRAFT (handy for knowing what is new as well as checking the OCR has worked as cards can be edited after being created) and finally **@simon932** should be replaced by whatever your username is (taken from the email address you got above)

For the subject you can add whatever you like as that will become the description for the card.  Once sent it will take a while to process but the card should appear on your board, similar to

![Screenshot from 2023-11-05 10-39-48](https://github.com/ssherlock/Boox2Trello/assets/501364/fd111d3d-c3b1-412c-a60f-644558108dab)

If you click on the card it will give more detail and from there you can change who it is allocated to, the label and add more text etc.

## The Scripts 
So far you’ve seen some very basic Trello functionality, and if you’re happy using the web page or app that might be good enough.  But I want to be able to create jobs from Boox using the hand-writing functionality I bought the device for.

Google Drive does a pretty good job of OCR’ing your notes when converting a PDF with handwriting, though you will soon learn to write a bit slower and neater to save yourself from correcting manually later (if your hand writing is as bad as mine at least).

In Google Drive I created a new directory called Trello under my notes backup structure e.g.

**My drive > onyx > NoteAir2P > Notepads > Trello**

I then created a new AppScript within the Notepads folder 

![Screenshot from 2023-11-05 11-23-45](https://github.com/ssherlock/Boox2Trello/assets/501364/8373eda9-7a7b-4a1a-a9b1-1f140e22c624)

The script can be named what you like but I went with **Trello Processing** though I called the function *moveTrelloFilesTrigger* as it will be triggered at certain times.

Note the lines like this below - DriveApp.getFolderById('**187z-KitcrQ9CNH33eMKBTRssWzK5MSl4**');.  This is the identifier for the folder you want and you can get this from the address bar of said folder e.g. https://drive.google.com/drive/u/0/folders/187z-KitcrQ9CNH33eMKBTRssWzK5MSl4

This is how Google Drive knows where you are as it is a unique identifier for said folders.
```
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
            newName = file.getName().substring(7, length + 1);
            var newPath = DriveApp.getFolderById('1Z4GIsZnvm-PyDad9NYqO_r4yi6aaHRw8u');
            file.moveTo(newPath);
        }
    }
}
```
The script above therefore does the following:
Gets the directory identifier for where your files get synced to (**My drive > onyx > NoteAir2P > Notepads**)
Loops through all the files in that directory processing only those prefixed with *trello_*  and moving them to the **Trello** folder

You can, of course, run this script whenever you like but for automating it I created a trigger to run it every 5 minutes.
![Screenshot from 2023-11-05 11-39-28](https://github.com/ssherlock/Boox2Trello/assets/501364/882ffca7-8730-4fd7-8fca-a2926f74fc6e)

From here click the **Create trigger** button and fill in the required details as follows (or to suit yourself)
![Screenshot from 2023-11-05 11-40-39](https://github.com/ssherlock/Boox2Trello/assets/501364/b9993df2-6de1-43c2-9bae-5e26b42f07d0)

Once this is up and running then any files following the format of *trello_<boardName>.pdf* will be moved into the Trello folder for actual processing.  For example, **trello_Test.pdf** will parse lines in the file creating a card for each and placing it on the Test board within Trello

Before going into detail on what this script does, this is an example of the file being processed.  In this example two cards should be produced on Trello; Test 2 and Test 3:

![Screenshot from 2023-11-05 11-56-31](https://github.com/ssherlock/Boox2Trello/assets/501364/e1e98f7a-9009-40c1-b285-8f3b25adb921)

Breaking this down we have the following format with : being used as a separator

**Card Title : Card description :**

The script for handling this (also set to trigger every 5 minutes for me) is as follows:
```
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
            var fileId = Drive.Files.insert({ mimeType: MimeType.GOOGLE_DOCS }, 
file.getBlob()).id;

            var tempFile = DocumentApp.openById(fileId);
            var textToParse = tempFile.getBody().getText();
            Logger.log('textToParse: ' + textToParse);
            boardName = file.getName().substring(7, length - 4);
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
            body = "Processing completed. Remaing number of emails for the day: " + 
remainingQuota;
            sendEmail("<your_email>@gmail.com", subject, body);

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
```
So what the above is basically doing is taking any file beginning with **trello_** and converting it to a Google Doc (with does the magic OCR) before taking the body of said doc and parsing it, splitting the text on the : so that we get a card title and card description field. This processing is shown in the function below where it also creates the email that will be sent to Trello. Note the subject line has #DRAFT (for allocating the label) and @simon932 to indicate the initial user to allocate the ticket to.  Chnage these to suit your needs (especially the user name!)
```
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
```
The getEmailAddress function is a bit clunky as I have created a line for each board name that exists and matched the correct Trello email address to it.  Rememner that the email addresses come from Trello and will differ for each board you have.
```
function getEmailAddress(boardName) {
    if (boardName === 'Board 1') { 
return 'simon932+somthing1@boards.trello.com' }
    if (boardName === ‘Board 2’) { 
return simon932+somthing2@boards.trello.com }
    if (boardName === 'Project 1') { 
return 'simon932+zqgce7afmoomjncjx5jv@boards.trello.com' 
    }
    return 'unknown';
} 

function sendEmail(recipient, subject, body) {
    MailApp.sendEmail(recipient, subject, body);
    Logger.log("sendEmail: recipent: " + recipient + " subject: " + subject + " body: " + body);
}
```
So for these to work you need to double check the following:
1. You have the Trello board(s) set up and the correct email address added to the script
2. You change the user (simon932) to your Trello user, as per the email address Trello gives you for emailing cards in
3. The Google Drive directories exist, with the scripts above and relevant triggers if required (as you can just run them manually if you want).

## Conclusion
Well that was far more long-winded and involved than I had envisaged!  
Hopefully it makes sense and is easy enough to follow.  The template scripts can be found at https://github.com/ssherlock/Boox2Trello/

Those of you with decent scripting knowledge will also have no doubt spotted how clunky parts of this are.  Please feel free to improve and check in your changes to Github.

