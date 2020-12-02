
let toolbarOptions = [
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'font': [] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  ['blockquote', 'code-block'],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'align': [] }],
  [{ 'indent': '-1' }, { 'indent': '+1' }, { 'direction': 'rtl' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  ['link', 'image'],
  ['clean']                                         // remove formatting button
];

//Sets up the quill editor in the element with the id of "editor"
quill = new Quill('#editor', {
  modules: {
    toolbar: toolbarOptions
  },
  theme: 'snow'
});

// Saves the initial content of the editor. When one pushes on "Create new note" button, the content of the editor is set to this variable
const initialContent = quill.getContents();

//new user redirect
let pageVisits = JSON.parse(localStorage.getItem('pageVisits'));

function redirectToInfo() {
  window.location = "intro.html";
}

function redirectNewUser() {
  if (pageVisits == null) {
    pageVisits += 1;
    localStorage.setItem("pageVisits", pageVisits);
    redirectToInfo();
  }
}

//global variables
let editingField = document.querySelector(".ql-editor");
let notesListContainer = document.querySelector('.saved-notes-list');
let saveNoteBtn = document.querySelector('.save-note-btn');
let newNoteButton = document.querySelector(".new-note-button");
let starButton = document.querySelector('#starred-button')
let currentView = 'allNotes'
let closeBtn = document.querySelector('body > main > section.toolbar-and-editor-container > div.close-btn > button');

//function that opens the editor
function openEditor() {
  document.querySelector(".toolbar-and-editor-container").classList.remove("hidden");
  quill.setContents(initialContent);
}

//open editor when clicking on new note button
newNoteButton.addEventListener("click", openEditor);

//function that closes the editor
function closeEditor() {
  document.querySelector(".toolbar-and-editor-container").classList.add("hidden");
}

//close the editor when clicking on close button with both save and close option
closeBtn.onclick = function confirmClose() {
  if (confirm("Do you want to save your note before closing?")) {
    saveNote();
  } else closeEditor();
}

//unique identifyer for each note to act as a local storage key that is taken from local storage
let notesNumber = JSON.parse(localStorage.getItem('notesNumber'));


//creating a note
function createNote() {
  //creates one list item in the saved notes div containing all of the html generated by the editor
  const buttonId = `favorite-button-${notesNumber}`
  //data-noteid is used in bindFavoriteButtons function
  let note = `<li data-noteid=${notesNumber} class="note">
                  ${editingField.innerHTML}<span>${date()}</span>
                  <button class="favorite-toggle" id="${buttonId}">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="star"
                      class="svg-inline--fa fa-star fa-w-18"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512">
                      <path
                        stroke="black" stroke-width="20" stroke-linecap="round"
                        d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                      ></path>
                    </svg>
                  </button>
                </li>`;

  notesListContainer.insertAdjacentHTML("afterbegin", note);
  //notesListContainer.innerHTML += note;
  //saves the note html as a JSON string in Local Storage
  localStorage.setItem(notesNumber, JSON.stringify(note))
  bindFavoriteButtons()
}

function bindFavoriteButtons() {
  //get all notes
  const allNotes = document.querySelectorAll(".note")
  //for each note 
  allNotes.forEach(function (note) {
    //bind click event for all favorite buttons
    note.querySelector(".favorite-toggle").addEventListener("click", function () {
      const noteId = note.dataset.noteid
      toggleFavorite(noteId)
    })
  })
}

function toggleFavorite(noteId) {
  //get note from localStorage
  const listItem = document.querySelector(`[data-noteid="${noteId}"]`)
  //toggle favorit class on listItem
  listItem.classList.toggle("favorite")
  //saving in localStorage
  localStorage.setItem(noteId, JSON.stringify(listItem.outerHTML))
}

//saving a note
function saveNote() {
  //select the first element in the editing field
  let firstElement = editingField.firstChild;
  //only creates a note if first element is a heading(h1, h2...h6) and it is not empty
  if (firstElement.tagName.startsWith('H') && firstElement.textContent.trim() != "") {
    //the id increases by 1 for each created note
    notesNumber += 1;
    //saves the number in local storage for access
    localStorage.setItem('notesNumber', notesNumber);
    //creates the note
    createNote();
    //closes the editor
    closeEditor();
  } else alert("Please add a heading at the begining of your note, it will act as the note\'s title");
}

// saves and creates the note when clicking on the save button
saveNoteBtn.onclick = saveNote;

//loading notes from local storage
function loadNotes() {
  for (let i = notesNumber; i >= 1; i--) {
    //console.log(i);
    //console.log(localStorage.getItem(i));
    let note = JSON.parse(localStorage.getItem(i));
    notesListContainer.innerHTML += note;
  }
}

// NOTES LIST CONTAINER SHOW:
function renderCurrentView() {
  notesListContainer.innerHTML = '';
  // show all notes
  if (currentView == 'allNotes') {
    renderAllNotes()
  }
  // show favorit notes
  else if (currentView == 'favorites') {
    renderFavorites()
  }
  bindFavoriteButtons()
}


function renderAllNotes() {
  loadNotes()
}

function renderFavorites() {
  loadNotes()
  //get all non-favorite-listItem
  const nonFavoriteItems = notesListContainer.querySelectorAll('.note:not(.favorite)')
  nonFavoriteItems.forEach(function (nonFavoriteItem) {
    nonFavoriteItem.remove()
  })
}

function bindStarButton() {
  starButton.addEventListener('click', function () {
    //when starButton is selected, it gets gold
    starButton.classList.toggle('selected')
    //when current view is "favorites", view insted all notes on click"
    if (currentView == 'favorites') {
      currentView = 'allNotes'
    }
    //when current view is on all notes, view insted "favorites notes on click"
    else if (currentView == 'allNotes') {
      currentView = 'favorites'
    }
    renderCurrentView()
  })

}

document.addEventListener('DOMContentLoaded', e => {
  renderCurrentView();
  bindFavoriteButtons();
  bindStarButton();
})

//remove focus from notes
function removeFocus(notes) {
  notes.forEach(note => {
    note.classList.remove('active-note');
  });
}
//add active class to note    
notesListContainer.addEventListener('click', e => {

  if (!e.target.closest('.note')) {
    return
  } else {
    let myNotes = document.querySelectorAll(".note");
    removeFocus(myNotes);
    e.target.closest('.note').classList.add('active-note');
    openEditor();
    editingField.innerHTML = e.target.closest('.note').innerHTML.trim();
  }
});


// print function
let printBtn = document.querySelector('.printBtn');

function printContent() {
  var myWindow = window.open('', '', 'width=800,height=600');
  //open the window
  myWindow.document.open();
  myWindow.document.write('<html><head><title>Print it</title><link rel="stylesheet" type="text/css" href="reset.css"><link rel="stylesheet" type="text/css" href="style.css"></head><body>');
  myWindow.document.write(document.querySelector(".ql-editor").innerHTML);
  myWindow.document.write('</body></html>');
  myWindow.document.close();
  myWindow.focus();
  setTimeout(function () {
    myWindow.print();
    // myWindow.close();
  }, 100);
}

let searchStatus = false;
const searchButton = document.getElementById('search-button');

// Creates a search input field
searchButton.addEventListener('click', function () {
  searchButton.classList.toggle('selected');
  if (searchStatus === false) {
    // create input element, add ID and placeholder
    const searchInput = document.createElement('input');
    searchInput.setAttribute('id', 'searchInput');
    searchInput.setAttribute('placeholder', 'Search among notes...')

    // Add event listener with search function to input element
    searchInput.addEventListener('keyup', searchNotes);

    // insert input element above the notes list and focus on it
    notesListContainer.insertAdjacentElement('beforebegin', searchInput).focus();
    searchStatus = true;
  } else {
    // if the search input is already there, it is removed when one clicks on the search button
    const searchInput = document.getElementById('searchInput');
    searchInput.remove();
    searchStatus = false;
    loadNotes();
  }
})

function searchNotes() {
  // Get the value of the search input and make lower case
  let searchValue = document.getElementById('searchInput').value.toLowerCase();
  console.log(searchValue);

  // Grab all notes and save them
  const notes = notesListContainer.querySelectorAll('li.note');

  // Loop through collection of LIs
  for (let i = 0; i < notes.length; i++) {
    // grab the inner text of each note, and make lower case
    const content = notes[i].innerText.toLowerCase();
    // if the content contains the search value, it is displayed. Else, it is not displayed
    if (content.indexOf(searchValue) !== -1) {
      notes[i].style.display = '';
    } else {
      notes[i].style.display = 'none';
    }
  }
}


/* ADDITIONAL FUNCTIONS NOT IMPLEMENTED */
/* Date Function */
function date() {
  let now = new Date();

  let dd = now.getDate();
  let m = now.getMonth() + 1;
  let yyyy = now.getFullYear();
  let hh = now.getHours();
  let mm = now.getMinutes();
  let ss = now.getSeconds();

  if (dd < 10) {
    dd = `0${dd}`;
  }
  if (m < 10) {
    m = `0${m}`;
  }
  if (hh < 10) {
    hh = `0${hh}`;
  }
  if (mm < 10) {
    mm = `0${mm}`;
  }
  if (ss < 10) {
    ss = `0${ss}`;
  }

  now = `${dd}/${m}/${yyyy} ${hh}:${mm}`;
  return now;
}



/* Read only mode */
// To turn the editor into "read-only-mode" - the toolbar is hidden and the content of the editor is non-editable. When clcked on again, it is made into "edit-mode" and the toolbar is shown again.
// Activate function from e.g. a button with a event listener that activates the function
// Also need to create a class of "hide-toolbar" with a "display: none; property"
function editToggle(e) {
  // Add the class "edit-button" to the html element that activates this function
  if (!e.target.classList.contains('edit-button')) {
    return;
  }

  const editor = document.querySelector('.ql-editor');
  const toolbar = document.querySelector('.ql-toolbar.ql-snow');

  if (editor.getAttribute('contenteditable') === 'true') {
    // makes the editor non-editable
    editor.setAttribute('contenteditable', false);
    // adds the class "hide-toolbar" containing a "dsplay: none;" to hide the toolbar
    toolbar.classList.toggle('hide-toolbar');
  } else {
    // the opposite
    editor.setAttribute('contenteditable', true);
    toolbar.classList.toggle('hide-toolbar');
  }
}

//Eventlistener for removing the "placeholder text" in the editor when creating a new note
editingField.addEventListener('click', () => {
  //First does a check to see if the editor has any "children"
  if (editingField.firstChild.innerHTML == null) {
    //If not then nothing should be executed when clicking inside of the editing field
    return false;
  } else {
    //If there are "children" such as h1- or p-tags then the while loop will begin it´s two checks to see if the "placeholders" are displayed
    while (editingField.firstChild.innerHTML == "Please add a title here" ||
      editingField.firstChild.innerHTML == "Here is where you can write your cool note text") {

      //If they are then the innerHTML of the editor will be erased to BLANK
      editingField.innerHTML = "";
      //Then a h1 will be created and put in a variable
      let h = document.createElement("H1");
      //Then the h1 will be appended to the editor so the user can begin to write a title for their note
      editingField.appendChild(h);
    }

  }
});

