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
      insertTabeRow(result)
      const closeNewBlogModal = document.getElementById('clodeNewBlogModal')
      closeNewBlogModal.click()
    })
    .catch(error => {
      // throw an error pop up
      console.log(error)
    })
  })

  // functions to manipulate DOM
  function insertTabeRow(responseData) {
    var newTableRow = document.createElement('tr')

    newTableRow.innerHTML = `
      <td scope="row">${responseData.blog.dateCreated}</td>
      <td>${responseData.blog.title}</td>
      <td>${responseData.blog.views}</td>
      <td>${responseData.blog.comments}</td>
      <td>
        <div class="btn-group btn-group-sm" role="group" aria-label="Actions" id="buttonGroup-${responseData.blog.id}">
          <a class="btn btn-outline-secondary" href="/blogs/${responseData.blog.id}">
            <svg class="bi bi-eye" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path
                d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z">
              </path>
              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"></path>
            </svg>
          </a>
          <button class="btn btn-outline-secondary" type="button">
            <svg class="bi bi-trash"xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path
                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z">
              </path>
              <path fill-rule="evenodd"
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z">
              </path>
            </svg>
          </button>
        </div>
      </td>
    `
    var table = document.getElementById('table')
    table.appendChild(newTableRow)

    // add CIMRequest button if necessary
    if (responseData.ltiMessageType == "ContentItemSelectionRequest") {
      var actionButtons = document.getElementById(`buttonGroup-${responseData.blog.id}`)
      console.log(actionButtons)
      var CIMRequestButton = document.createElement('a')
      CIMRequestButton.classList.add("btn", "btn-outline-secondary")
      CIMRequestButton.href = `/CIMRequestConfirmation/${responseData.blog.id}`
      CIMRequestButton.innerHTML = `
        <svg class="bi bi-link-45deg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path
            d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z">
          </path>
          <path
            d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z">
          </path>
        </svg>
      `
      actionButtons.appendChild(CIMRequestButton)
    }
  }
});