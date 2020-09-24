const jsSheet = {
  CreateSession: function(onSuccess = console.log, onFailure = console.error) {
    google.script.run.withFailureHandler(onFailure).withSuccessHandler(onSuccess).GetSessionID()
  },

  Insert: function(id, data, onSuccess = console.log, onFailure = console.error) {
    google.script.run.withFailureHandler(onFailure).withSuccessHandler(onSuccess).Insert(id, data)
  },

  InsertBulk: function(id, data, onSuccess = console.log, onFailure = console.error) {
    google.script.run.withFailureHandler(onFailure).withSuccessHandler(onSuccess).InsertBulk(id, data)
  }
}

/* Debug jsSheet
const jsSheet = {
  CreateSession: function(callback) {
    callback(1)
  },

  Insert: function(id, data, callback) {}
}*/