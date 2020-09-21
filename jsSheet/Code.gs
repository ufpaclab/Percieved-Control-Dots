function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
}

function Insert(id, data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheetName = id.toString()
  var sheet = ss.getSheetByName(sheetName)
  if (sheet == null) {
    sheet = ss.insertSheet(sheetName)
  }
  sheet.appendRow(data)
}
 
function InsertBulk(id, data) {
  data.forEach(row => Insert(id, row))
}

function GetSessionID() {
  var lock = LockService.getScriptLock()
  lock.waitLock(30000)
  var documentProperties = PropertiesService.getDocumentProperties()
  var currentID = documentProperties.getProperty('sessionID')
  if (typeof currentID === 'undefined') {
    documentProperties.setProperty('sessionID', '0')
    currentID = '0'
  }
  var newID = parseInt(currentID) + 1
  documentProperties.setProperty('sessionID', newID.toString())
  lock.releaseLock()
  return newID
}