function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index')
  template.survey_code = e.parameter.survey_code
  return template.evaluate()
}

function Insert(id, data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheetName = 'Results'
  var sheet = ss.getSheetByName(sheetName)
  if (sheet == null) {
    sheet = ss.insertSheet(sheetName)
  }
  sheet.appendRow(data)
}

function GetSessionID() {
  var lock = LockService.getScriptLock()
  lock.waitLock(30000)
  var documentProperties = PropertiesService.getDocumentProperties()
  var currentID = documentProperties.getProperty('sessionID')
  if (currentID == "NaN") {
    documentProperties.setProperty('sessionID', '0')
    currentID = '0'
  }
  var newID = parseInt(currentID) + 1
  documentProperties.setProperty('sessionID', newID.toString())
  lock.releaseLock()
  return newID
}