/**********************************************************
 
ADOBE SYSTEMS INCORPORATED 
Copyright 2005-2006 Adobe Systems Incorporated 
All Rights Reserved 
 
NOTICE:  Adobe permits you to use, modify, and 
distribute this file in accordance with the terms
of the Adobe license agreement accompanying it.  
If you have received this file from a source 
other than Adobe, then your use, modification,
or distribution of it requires the prior 
written permission of Adobe. 
 
*********************************************************/
 
/**********************************************************
 
Export to PDFs.jsx
 
DESCRIPTION
 
This sample gets files specified by the user from the 
selected folder and batch processes them and saves them 
as PDFs.
 
Edits by Patrick Mineault:
 - only .ai files processed
 - files saved in same folder as the input files
 - export files have name (oldname)_export.pdf
 - PDF settings: non-editable / acrobatLayers=false 
      for maximum compatibility with Preview
 
**********************************************************/
 
// Main Code [Execution of script begins here]
 
// uncomment to suppress Illustrator warning dialogs
app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
 
var destFolder, sourceFolder, files, fileType, sourceDoc, targetFile, jpegSaveOpts, type;
 
// Select the source folder.
sourceFolder = Folder.selectDialog( 'Select the folder with Illustrator .ai files you want to convert to JPEG');
 
// If a valid folder is selected
if ( sourceFolder != null )
{
    files = new Array();
    fileType = "*.ai"; //prompt( 'Select type of Illustrator files to you want to process. Eg: *.ai', ' ' );
 
    // Get all files matching the pattern
    files = sourceFolder.getFiles( fileType );
 
    if ( files.length > 0 )
    {
        // Get the destination to save the files
        destFolder = Folder.selectDialog( 'Select the folder where you want to save the converted JPEG files.', '~' );
        //destFolder = sourceFolder;
        type = ExportType.JPEG;
        for ( i = 0; i < files.length; i++ )
        {
            sourceDoc = app.open(files[i]); // returns the document object
            $.writeln(files[i]);
            cropToSbb();
            // Call function getNewName to get the name and file to save the pdf
            targetFile = getNewName();
 
            // Call function getPDFOptions get the PDFSaveOptions for the files
            jpegSaveOpts = getJPEGOptions( );
 
            // Export as JPEG
            sourceDoc.exportFile( targetFile, type, jpegSaveOpts );
            sourceDoc.close( SaveOptions.DONOTSAVECHANGES );
        }
        alert( 'Files are saved as JPEG in ' + destFolder );
    }
    else
    {
        alert( 'No matching files found' );
    }
}
 
/*********************************************************
 
getNewName: Function to get the new file name. The primary
name is the same as the source file.
 
**********************************************************/
 
function getNewName()
{
    var ext, docName, newName, saveInFile, docName;
    docName = sourceDoc.name;
    ext = '.jpg'; // new extension for jpg file
    newName = "";
 
    for ( var i = 0 ; docName[i] != "." ; i++ )
    {
        newName += docName[i];
    }
    newName += ext; // full jpg name of the file
 
    // Create a file object to save the jpg
    saveInFile = new File( destFolder + '/' + newName );
 
    return saveInFile;
}
 
/*********************************************************
 
getJPEGOptions: Function to set the PDF saving options of the 
files using the PDFSaveOptions object.
 
**********************************************************/
 
function getJPEGOptions()
{
    // Create the PDFSaveOptions object to set the PDF options
    var jpegSaveOpts = new ExportOptionsJPEG();
 
    // Setting PDFSaveOptions properties. Please see the JavaScript Reference
    // for a description of these properties.
    // Add more properties here if you like

    jpegSaveOpts.antiAliasing = false;
    jpegSaveOpts.qualitySetting = 100;
    jpegSaveOpts.artBoardClipping = true;
    
    return jpegSaveOpts;
}


/*********************************************************
 
cropToSbb: Function to cut 200x1.65 to 54 [SBB Size]
 
**********************************************************/
 
function cropToSbb()
{
    var doc = app.activeDocument;  
    var activeArtboardIndex = doc.artboards.getActiveArtboardIndex(); 
    //    This will give left, top, right, bottom.
    var rc =  doc.artboards[activeArtboardIndex].artboardRect;
    var ro = doc.artboards[activeArtboardIndex].rulerOrigin;
    //$.writeln(rc);
    //$.writeln(ro);
    var ableft = rc [0];
    var abtop =  rc[1];
    var abright = rc[2]-10512;//cropping setting the origin on the left.
    var abbottom = rc[3];    
    //$.writeln(rc);
    //$.writeln(ro);
    doc.artboards[activeArtboardIndex].artboardRect = [ableft, abtop, abright, abbottom];

}