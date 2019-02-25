 /**
 * This script allow you to add filename below graphics in illustrator EPS.
 * @author Vianney Miranda
 * @supported Mac OS X/WINDOWS Illustrator (versions CS5 to CC) 
 */

// Main Code [Execution of script begins here]

 

// uncomment to suppress Illustrator warning dialogs
// app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

 

var destFolder, sourceFolder, files, fileType, sourceDoc, targetFile, epsExportOpts;

 

// Select the source folder.
sourceFolder = Folder.selectDialog( 'Select the folder with Illustrator files you want to add Filename', '~' );

 

// If a valid folder is selected
if ( sourceFolder != null )
{
    files = new Array();
    fileType = prompt( 'Select type of Illustrator files to you want to process. Eg: *.eps', ' ' );
    
    // Get all files matching the pattern
    files = sourceFolder.getFiles( fileType );
    
    if ( files.length > 0 )
    {
        // Get the destination to save the files
        destFolder = Folder.selectDialog( 'Select the folder where you want to save the converted EPS files.', '~' );
        for ( i = 0; i < files.length; i++ )
        {
            sourceDoc = app.open(files[i]); // returns the document object
            app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;  
            var doc = app.activeDocument;
            doc.artboards.setActiveArtboardIndex( 0 );  
            var abRect = doc.artboards[0].artboardRect;  
            pointTextRef = doc.textFrames.add(); 
            pointTextRef.position = [ abRect[2]/2, abRect[3]/2 ];
            pointTextRef.textRange.paragraphAttributes.justification = Justification.CENTER;
            pointTextRef.contents = app.activeDocument.name; 
            //pointTextRef.top = 20; 
            //pointTextRef.left = 0;                         
            //Call function getNewName to get the name and file to save the eps
            targetFile = getNewName();
            
            // Call function getPNGOptions get the PNGExportOptions for the files
            epsSaveOpts = getEPSOptions();
            
            // Save as EPS
            sourceDoc.saveAs( targetFile, epsSaveOpts );
            
            sourceDoc.close(SaveOptions.DONOTSAVECHANGES);
        }
        alert( 'Files are saved as PNG in ' + destFolder );
    }
    else
    {
        alert( 'No matching files found' );
    }
}

 

/*********************************************************

 

addFileName: Function to add the filename as a text.


 

**********************************************************/

function addFileName()
{
var pointTextRef = app.activeDocument.textFrames.add(); 
pointTextRef.contents = app.activeDocument.name; 
pointTextRef.top = 20; 
pointTextRef.left = 10; 
}
 

 


/*********************************************************

 

getNewName: Function to get the new file name. The primary
name is the same as the source file.

 

**********************************************************/

 

function getNewName()
{
    var ext, docName, newName, saveInFile, docName;
    docName = sourceDoc.name;
    ext = '.eps'; // new extension for png file
    newName = "";
        
    for ( var i = 0 ; docName[i] != "." ; i++ )
    {
        newName += docName[i];
    }
    newName += ext; // full eps name of the file
    
    // Create a file object to save the png
    saveInFile = new File( destFolder + '/' + newName );

 

    return saveInFile;
}

 

 

 


/*********************************************************

 

getESPOptions: Function to set the EPS saving options of the 
files using the PDFSaveOptions object.

 

**********************************************************/

 

function getEPSOptions()
{
    
    // Create the PDFSaveOptions object to set the PDF options
    var epsExportOpts = new EPSSaveOptions();
   
    // Setting EPSExportOptions properties. Please see the JavaScript Reference
    // for a description of these properties.
    // Add more properties here if you like
    epsExportOpts.embedAllFonts = true;
    epsExportOpts.artboardRange = false;
    epsExportOpts.saveAsHTML = false;

    return epsExportOpts;
}