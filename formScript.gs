function onFormSubmit(e) {


  var sheetName = "Form_Responses";
  var sheetURL = "[URL TO SPREADSHEET]";
  
  var book = SpreadsheetApp.openByUrl(sheetURL);
  var sheet = book.getSheetByName(sheetName);
  
  var row = sheet.getLastRow();
  var num = row - 1;

  var idCol = [ENTER THE COLUMN THAT THE ID VALUE WILL BE PLACED INTO]
  sheet.getRange(row,idCol).setValue(num);

}
