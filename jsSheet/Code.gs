function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index')
  template.survey_code = e.parameter.survey_code
  return template.evaluate()
}

function GetSessionID() {
  var lock = LockService.getScriptLock()
  lock.waitLock(30000)
  
  var scriptProperties = PropertiesService.getScriptProperties()
  var newID
  do {
    newID = Math.floor(Math.random() * 1000000).toString()
  } while (scriptProperties.getProperty(newID) != null)
  scriptProperties.setProperty(newID, true)
    
  lock.releaseLock()
  
  return newID
}

function Insert(id, data) {  
  var scriptProperties = PropertiesService.getScriptProperties()
  
  var lock = LockService.getScriptLock()
  lock.waitLock(30000)
  
  var keyCount = ReadOrCreateProperty_(scriptProperties, 'keyCount', '1')
  keyCount = parseInt(keyCount)
  
  var paddedData = [id]
  var keys = Object.keys(data)
  for (var key of keys) {
    var keyIndex = ReadOrCreateProperty_(scriptProperties, key, keyCount)
    if (keyIndex == keyCount)
      keyCount++

    paddedData[keyIndex] = data[key]
  }
  scriptProperties.setProperty("keyCount", keyCount.toString())
  
  lock.releaseLock()
  
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheetName = 'Results'
  var sheet = ss.getSheetByName(sheetName)
  if (sheet == null) {
    sheet = ss.insertSheet(sheetName)
  }
  sheet.appendRow(paddedData)
}
  
function ReadOrCreateProperty_(properties, key, defaultValue) {
  var value = properties.getProperty(key)
  if (value == null) {
    value = defaultValue.toString()
    properties.setProperty(key, value)
  }
  return value
}