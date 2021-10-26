window.addEventListener("DOMContentLoaded", (event) => {
  // handle add comment
  var newCommentForm = document.getElementById('newCommentForm')
  console.log(newCommentForm)
  newCommentForm.addEventListener('submit', (event) => {
    event.preventDefault()

    var comment = document.getElementById('comment').value
    var blogId = document.getElementById('idSource').value

    fetch(`/api/comment/${blogId}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        comment: comment
      })
    })
    .then(response => response.json())
    .then((result) => {
      insertComment(result)
      newCommentForm.reset()
      var commentTab = document.getElementById('comments-tab')
      commentTab.click()
    })
    .catch(error => {
      // throw an error pop up
      console.log(error)
    })
  })  

  function insertComment (comment) {
    var newComment = document.createElement('div')
    newComment.classList = 'col-8'
    newComment.innerHTML = `
    <div class="card mb-3">
      <div class="card-header">${comment.creator.fullName}</div>
      <div class="card-body">
        <div class="card-text">${comment.comment}</div>
      </div>
    </div>
    `
    var comments = document.getElementById('commentsContainer')
    comments.append(newComment)
  }
})