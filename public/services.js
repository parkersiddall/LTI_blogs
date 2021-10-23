window.addEventListener('DOMContentLoaded', (event) => {

  console.log('This is LTI Blogs.')

  // handle submission of new blog
  var newBlogForm = document.getElementById('newBlogForm')
  newBlogForm.addEventListener('submit', (event) => {
    event.preventDefault()

    var title = document.getElementById('newBlogTitle').value
    var content = document.getElementById('newBlogContent').value

    fetch('/api/blog', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        title: title,
        content: content
      })
    })
    .then(response => response.json())
    .then((result) => {
      const closeNewBlogModal = document.getElementById('clodeNewBlogModal')
      closeNewBlogModal.click()
      window.location.replace(`/blogs/${result.id}`)
    })
    .catch(error => {
      // throw an error pop up
      console.log(error)
    })
  })
});