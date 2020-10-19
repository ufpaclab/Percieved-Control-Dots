const jsSheet = {
  CreateSession: function(onSuccess, onFailure = console.error) {
    google.script.run.withFailureHandler(onFailure).withSuccessHandler(CreateLocalSession).GetSessionID()

    function CreateLocalSession(id) {
      onSuccess({
        id: id,
        insert: function(data) {
          google.script.run.withFailureHandler(onFailure).Insert(id, data)
        }
      })
    }
  }
}