const jsSheet = {
  CreateSession: function(onSuccess = console.log, onFailure = console.error) {
    google.script.run.withFailureHandler(onFailure).withSuccessHandler(CreateLocalSession).GetSessionID()

    function CreateLocalSession(id) {
      let keyLookup = new Map()
      onSuccess({
        id: id,
        insert: function(data) {
          let keys = Object.keys(data)
          for (const key of keys) {
              keyLookup.set(key, true)
          }

          let paddedData = []
          for (const key of keyLookup.keys()) {
              paddedData.push(data.hasOwnProperty(key) ? data[key] : '')
          }

          google.script.run.withFailureHandler(onFailure).withSuccessHandler(onSuccess).Insert(id, paddedData)
        }
      })
    }
  }
}