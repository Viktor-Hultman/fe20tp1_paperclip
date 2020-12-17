
//=========================
//quill editor setup section
//=========================

//Sets up the quill editor in the element with the id of "editor"
quill = new Quill('#editor', {
  modules: {
    toolbar: '#toolbar'//toolbarOptions
  },
  theme: 'snow'
});



//=========================
//global variables section
//=========================

//constants can come first, they do not change their value(cannot be reasigned new values)
// Saves the initial content of the editor. When one pushes on "Create new note" button, the content of the editor is set to this variable
const initialContent = quill.getContents();
const editingField = document.querySelector('.ql-editor');
const notesListContainer = document.querySelector('.saved-notes-list');
const saveNoteBtn = document.querySelector('.save-note-btn');
const newNoteButton = document.querySelector(".new-note-button");
const starButton = document.querySelector('#starred-button');
const closeBtn = document.querySelector('div.close-btn > button');
const editorContainer = document.querySelector('.toolbar-and-editor-container');
const trashBinBtn = document.querySelector('#trash-bin-button');
const emptyTrashBinBtn = document.querySelector('.clear-trash-bin');
const printBtn = document.querySelector('.printBtn');
const searchButton = document.getElementById('search-button');
const resetBtn = document.querySelector('#reset-btn');
const playfullBtn = document.querySelector('#playfull-btn');
const academicBtn = document.querySelector('#academic-btn');
const bigSizeBtn = document.querySelector('#big-size-btn');
const creepyBtn = document.querySelector('#creepy-btn');
const changeListButton = document.querySelectorAll('.ql-list');
// THIS IS NEEDED TO REMOVE THE QUILL-CREATED SPAN WITH THE SAME ID AS THE SELECT-ELEMENT
const spanTheme = document.querySelector('#themes');
const selectTheme = document.querySelector('select#themes');

// variables that change their value throughout the code
//unique identifyer for each note to act as a local storage key that is taken from local storage
let notesNumber = JSON.parse(localStorage.getItem('notesNumber'));
//variable that indicates when text will be edited starts false and becomes true on key upp in editor
let textWasEdited = false;
//variable to identify the clicked note for saving edited content
let clickedNoteId = 0;
//variable to identify the clicked element for saving edited content
let clickedNote = '';
let currentView = 'allNotes';
//if the user has visited the page before page visit variable will load from local storage, otherwise it will be null
let pageVisits = JSON.parse(localStorage.getItem('pageVisits'));
let templateData = "undefined";
//not very sure if it should be a constant, i think so though
let headingsPicker = document.querySelector('.ql-picker-options');
let searchStatus = false;
let totalNotes = 0;

//=========================
//event listeners section
//=========================
//on load event
document.addEventListener('DOMContentLoaded', e => {
  renderCurrentView();
  bindStarButton();
  //saves theme color in localStorage
  const savedTheme = localStorage.getItem("theme") || "auto";

  applyTheme(savedTheme);

  for (const optionElement of document.querySelectorAll("#theme option")) {
    optionElement.selected = savedTheme === optionElement.value;
  }

  document.querySelector("#theme").addEventListener("change", function () {
    localStorage.setItem("theme", this.value);
    applyTheme(this.value);
    if (this.value === "rainbow") {
      const confettiElement = document.querySelector(".logo")
      confetti(confettiElement, {
        angle: "10",
        spread: "150",
        elementCount: "100",
        startVelocity: window.innerWidth / 20
      })
    }
  });
  // loads localstorage counted saved notes for the statistics page
  totalNotes = localStorage.getItem('totalNotes');
})

//open editor when clicking on new note button
newNoteButton.addEventListener("click", function () {
  templateData = "undefined";
  resetAllTemplates();
  selectTheme.value = 'reset';
  openEditor();
  clickedNote = "";
});

// closes the editor when clicking on close button with both save and close option
closeBtn.addEventListener('click', confirmClose);

//track all thext changes in the editor
editorContainer.addEventListener('keyup', function () {
  textWasEdited = true;
})

/*almost all click functionalities from the notes container in an if else statement based on the event target*/
notesListContainer.addEventListener('click', e => {
  //1. first if targets the delete note buttons in the notes toolbar
  if (e.target.closest('.delete-note-btn')) {
    let deleteNoteBtn = e.target.closest('.delete-note-btn');
    let note = deleteNoteBtn.closest('li');
    deleteNote(note);
  }
  // 2. second if targets the restore notes buttons in the notes toolbar
  else if (e.target.closest('.restore-note-btn')) {
    let note = e.target.closest('li');
    restoreDeleted(note);
  }
  // 3. targets the permanently delete button in the deleted notes toolbar
  else if (e.target.closest('.permanently-delete')) {
    let note = e.target.closest('li');
    permanentlyDelete(note);
  }
  // 4. targets the favorite toggle button in the notes toolbar
  else if (e.target.closest('.favorite-toggle')) {
    const noteId = e.target.closest('li').dataset.noteid;
    toggleFavorite(noteId);
  }
  // 5. exits the function if clicked on everything else that is not a inside a note
  else if (!e.target.closest('.note-text')) {
    return
  }
  // 6. last else adds active class to note and opens it in editor
  else {
    if (e.target.closest('.note-text').parentElement.classList.contains('deleted')) {
      return
    }
    openEditor();
    removeFocus();

    //store the clicked note into a variable
    clickedNote = e.target.closest('.note-text');
    //store the clicked notes id in the global variable clickedNoteId
    clickedNoteId = clickedNote.parentElement.getAttribute('data-noteid');
    templateData = clickedNote.parentElement.getAttribute('data-template');
    if (window.innerWidth > 800) {
      if (templateData == "playfull") {
        changeToPlayfull();

      } else if (templateData == "academic") {
        changeToAcademic();

      } else if (templateData == "big-size") {
        changeToBigSize();

      } else if (templateData == "creepy") {
        changeToCreepy();

      } else {
        resetAllTemplates();
      }
      clickedNote.parentElement.classList.add('active-note');
    }
    editingField.innerHTML = clickedNote.innerHTML.trim();
    setTheme();
  }
});

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
    console.log()
    renderCurrentView();
  }
})

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

//toggle seen notes when navbar trash bin is clicked
trashBinBtn.addEventListener('click', function () {
  confirmClose();
  trashBinBtn.classList.toggle('selected');
  emptyTrashBinBtn.classList.toggle('hidden');
  //when current view is "deleted", view insted all notes on click"
  if (currentView == 'deleted') {
    currentView = 'allNotes'
  }
  //when current view is "favorites", view instead deleted on click
  else if (currentView == 'favorites') {
    currentView = 'deleted'
    starButton.classList.remove('selected')
  }
  //when current view is on all notes, view insted "favorites notes on click"
  else if (currentView == 'allNotes') {
    currentView = 'deleted'
  }
  renderCurrentView()
});

//permanently deletes all deleted notes in the trash bin
emptyTrashBinBtn.addEventListener('click', emptyTrashBin);

// saves and creates the note when clicking on the save button
saveNoteBtn.addEventListener('click', chooseSaveType);

// Eventlistener when headings are selected or changed
headingsPicker.addEventListener('click', checkTemplate);

// Listener for the 1,2,3 list button that changes text to an ordered list
changeListButton[0].addEventListener('click', checkTemplate);

// Listener for the list button that changes text to an unordered list
changeListButton[1].addEventListener('click', checkTemplate);

// Eventlistener when any key is pressed
document.addEventListener('keydown', (event) => {
  // Stores the value in a variable for further use
  let keyName = event.key;
  // Checks if both the enter key is pressed and the playfull template is "active"
  if (keyName === 'Enter' && editingField.classList.contains("playfull-note")) {
    // If they both are true then the playfull template function is executed
    changeToPlayfull();
  } else if (keyName === 'Enter' && editingField.classList.contains("academic-note")) {
    changeToAcademic();
  } else if (keyName === 'Enter' && editingField.classList.contains("big-size-note")) {
    changeToBigSize();
  } else if (keyName === 'Enter' && editingField.classList.contains("creepy-note")) {
    changeToCreepy();

  } else {
    return;
  }
  // Checks if both the backspace key is pressed and the playfull template is "active"
  if (keyName === 'Backspace' && editingField.classList.contains("playfull-note")) {
    // If they both are true then the playfull template function is executed
    changeToPlayfull();

  } else if (keyName === 'Backspace' && editingField.classList.contains("academic-note")) {
    changeToAcademic();

  } else if (keyName === 'Backspace' && editingField.classList.contains("big-size-note")) {
    changeToBigSize();

  } else if (keyName === 'Backspace' && editingField.classList.contains("creepy-note")) {
    changeToCreepy();

  } else {
    return;
  }
})

//removes quill editors built in theme element
spanTheme.remove();
// Change theme from dropdown menu
// Select the dropdown
selectTheme.addEventListener('change', function (event) {

  if (event.target.value === 'reset') {
    resetAllTemplates();
    textWasEdited = true;
  }
  if (event.target.value === 'academic') {
    changeToAcademic();
    textWasEdited = true;
  }
  if (event.target.value === 'playfull') {
    changeToPlayfull();
    textWasEdited = true;
  }
  if (event.target.value === 'big-size') {
    changeToBigSize();
    textWasEdited = true;
  }
  if (event.target.value === 'creepy') {
    changeToCreepy();
    textWasEdited = true;
  }
})

//Eventlistener for the reset button
resetBtn.addEventListener('click', function () {
  resetAllTemplates();
  textWasEdited = true;
});


//=========================
//functions section
//=========================
//new user redirect
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

//function that opens the editor
function openEditor() {
  confirmClose();
  //set the initial content in the editor
  quill.setContents(initialContent);
  // make editor visible after .3 seconds when note has expanded
  setTimeout(() => {
    editorContainer.classList.remove("hidden");
  }, 300);
}

//function that closes the editor
function closeEditor() {
  document.querySelector(".toolbar-and-editor-container").classList.add("hidden");
  removeFocus();
  textWasEdited = false;
}

// function that asks whether to save the note or simply close the or  closes 
function confirmClose() {
  //console.log(styleWhenNoteWasOpened, editingField.classList)
  if (clickedNote === "") {
    if (textWasEdited) {
      saveNewNote();
    } else closeEditor();
  } else if (clickedNote.innerHTML != editingField.innerHTML || textWasEdited) {
    saveNote();
  } else closeEditor();
}

//creating a note
function createNote() {
  //creates one list item in the saved notes div containing all of the html generated by the editor
  const buttonId = `favorite-button-${notesNumber}`;
  //data-noteid is used when clicking on favorite buttons in notes
  let note = `<li data-noteid=${notesNumber} data-template=${templateData} class="note">
                  <div class="note-text">${editingField.innerHTML}</div>
                  <div class="note-toolbar">
                    <span class="date">${date()}</span>
                    <button class="delete-note-btn" aria-label="move to trash">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" class="svg-inline--fa fa-trash fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <title>Delete</title>
                      <path fill="currentColor" d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"></path></svg>
                    </button>
                    <button class="favorite-toggle" id="${buttonId}" aria-label="mark as favorite">
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="star"
                        class="svg-inline--fa fa-star fa-w-18"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512">
                        <title>Mark as favorite</title>
                        <path
                          stroke="black" stroke-width="20" stroke-linecap="round"
                          d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </li>`;

  notesListContainer.insertAdjacentHTML("afterbegin", note);
  //notesListContainer.innerHTML += note;
  //saves the note html as a JSON string in Local Storage
  localStorage.setItem(notesNumber, JSON.stringify(note))

  // saves a number each time a note is created in localstorage to use in statistics page
  totalNotes++;
  localStorage.setItem('totalNotes', JSON.stringify(totalNotes))
}

function toggleFavorite(noteId) {
  //get note from localStorage
  const listItem = document.querySelector(`[data-noteid="${noteId}"]`)
  //toggle favorit class on listItem
  listItem.classList.toggle("favorite")
  //saving in localStorage
  localStorage.setItem(noteId, JSON.stringify(listItem.outerHTML))
}

//functionthat checks to see if you created a title
function hasTitle() {
  //select the first element in the editing field
  let firstElement = editingField.firstChild;
  if (firstElement.tagName.startsWith('H') && firstElement.textContent.trim() != "") {
    return true
  } else return false
}

//saving a note
function saveNewNote() {
  //only creates a note if first element is a heading(h1, h2...h6) and it is not empty
  if (hasTitle()) {
    //Checks if the note editor has the playfull template "active" when saving note
    if (editingField.classList.contains("playfull-note")) {
      //Sets the data-template to "playfull" if it has
      templateData = "playfull"

    } else if (editingField.classList.contains("academic-note")) {
      templateData = "academic"

    } else if (editingField.classList.contains("big-size-note")) {
      templateData = "big-size"

    } else if (editingField.classList.contains("creepy-note")) {
      templateData = "creepy"

    } else {
      //If none of the templates are "active" sets the data-template to "undefined"
      templateData = "undefined"
    }
    //the id increases by 1 for each created note
    notesNumber += 1;
    //saves the number in local storage for access
    localStorage.setItem('notesNumber', notesNumber);
    //creates the note
    createNote();
    //closes the editor
    closeEditor();
    //remove focus from list items
    //removeFocus();

    // Resets template buttons to "deactivated"
    removeAcademic();
    removePlayfull();

  } else alert("Please add a title or a subtitle at the begining of your note");
}

//function intended for updating a note already existent
/*This function was not called yet because it is dependant of making the notes content separated from the date and star content*/
function saveNote() {
  //Targets the "active" note
  activeNote = document.querySelector('.active-note');

  //Checks if the user has clicked the playfull button
  if (editingField.classList.contains("playfull-note")) {
    //If they have then the data template atribute sets to playfull
    activeNote.setAttribute('data-template', "playfull");

    //Checks if the user has clicked the academic button
  } else if (editingField.classList.contains("academic-note")) {
    //If they have then the data template atribute sets to academic
    activeNote.setAttribute('data-template', "academic");

    //Checks if the user has clicked the bigsize button
  } else if (editingField.classList.contains("big-size-note")) {
    //If they have then the data template atribute sets to bigsize
    activeNote.setAttribute('data-template', "big-size");

    //Checks if the user has clicked the creepy button
  } else if (editingField.classList.contains("creepy-note")) {
    //If they have then the data template atribute sets to creepy
    activeNote.setAttribute('data-template', "creepy");

  } else {
    //If the user clicked a note without a template then the note will get the "standard" atribute of "undefined"
    activeNote.setAttribute('data-template', "undefined");
  }

  if (hasTitle()) {
    //creates the note 
    clickedNote.innerHTML = editingField.innerHTML;
    //update the date
    clickedNote.nextSibling.innerHTML = date();
    //recreates the li item
    let editedNote = `<li data-noteid=\"${clickedNoteId}\" data-template=${templateData} class="note">${clickedNote.parentNode.innerHTML}</li>`;
    //updates the note in local storage for access
    localStorage.setItem(clickedNoteId, JSON.stringify(editedNote));
    //closes the editor
    closeEditor();
    //remove focus from list items
    removeFocus();
  } else alert("Please add a heading at the begining of your note, it will act as the note\'s title");

  resetAllTemplates();
}

//function that identyfies wether the note needs to be saved over an existing one or a new note should be created
function chooseSaveType() {
  if (clickedNote !== "") {
    saveNote();
  } else saveNewNote();
}

//loading all notes from local storage
function loadAllNotes() {
  for (let i = notesNumber; i >= 1; i--) {
    let note = JSON.parse(localStorage.getItem(i));
    if (note === null) {
      continue
    }
    notesListContainer.innerHTML += note;
  }
}

//render only notes that are not deleted
function loadNotes() {
  loadAllNotes();
  const deletedItems = notesListContainer.querySelectorAll('.deleted')
  deletedItems.forEach(function (deletedItem) {
    deletedItem.remove()
  })
}

// changes the types of notes that you see based on your choices (favorite, deleted and saved)
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
  // show deleted notes
  else if (currentView == 'deleted') {
    renderDeleted('deleted')
  }
}

//fills the notes container with all saved notes
function renderAllNotes() {
  loadNotes()
}

//fills the notes container with all deleted notes
function renderDeleted(classNameAsString) {
  loadAllNotes()
  //get all listItem that do not contain specified class name
  const allExeptSelected = notesListContainer.querySelectorAll(`.note:not(.${classNameAsString})`)
  allExeptSelected.forEach(function (note) {
    note.remove()
  })
}

//fills the notes container with all favorite notes
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
    confirmClose();
    //when starButton is selected, it gets gold
    starButton.classList.toggle('selected')
    //mekes the delete all notes button hidden again
    emptyTrashBinBtn.classList.add('hidden')
    //when current view is "favorites", view insted all notes on click"
    if (currentView == 'favorites') {
      currentView = 'allNotes'
    }
    //when current view is "deleted", view will be set to favorites
    else if (currentView == 'deleted') {
      currentView = 'favorites'
      trashBinBtn.classList.remove('selected')
    }
    //when current view is on all notes, view insted "favorites notes on click"
    else if (currentView == 'allNotes') {
      currentView = 'favorites'
    }
    renderCurrentView()
  })
}

//function that chooses theme color
function applyTheme(theme) {
  document.body.classList.remove("theme-auto", "theme-green", "theme-red", "theme-rainbow", "theme-dark");
  document.body.classList.add(`theme-${theme}`);
}

//remove focus from notes
function removeFocus() {
  let notes = document.querySelectorAll(".note");
  notes.forEach(note => {
    note.classList.remove('active-note');
  });
}

//function that deletes a note
function deleteNote(note) {
  //get the note's id to be able to change it in local storage
  let noteId = note.dataset.noteid;
  //remove eventual active class
  note.classList.remove('active-note');
  //add a new class of deleted to the note
  note.classList.add('deleted');
  //change delete SVG with restore SVG
  let deleteBtn = note.querySelector('.delete-note-btn');
  deleteBtn.outerHTML = `<button class="restore-note-btn" aria-label="restore">
  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash-restore" class="svg-inline--fa fa-trash-restore fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
  <title>Restore note</title>
  <path fill="currentColor" d="M53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32zm70.11-175.8l89.38-94.26a15.41 15.41 0 0 1 22.62 0l89.38 94.26c10.08 10.62 2.94 28.8-11.32 28.8H256v112a16 16 0 0 1-16 16h-32a16 16 0 0 1-16-16V320h-57.37c-14.26 0-21.4-18.18-11.32-28.8zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path>
  </svg>
  </button> 
  <button class="permanently-delete" aria-label="permanently delete">
  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash-alt" class="svg-inline--fa fa-trash-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
  <title>Permanently delete</title>
  <path fill="currentColor" d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path></svg>
</button>`;
  //add code to save new class in local storage before removing the note
  localStorage.setItem(noteId, JSON.stringify(note.outerHTML));
  note.remove();

  // removes note from totalNotes when a note is deleted
  totalNotes--;
  localStorage.setItem('totalNotes', totalNotes);
}

function restoreDeleted(note) {
  //get the note's id to be able to change it in local storage
  let noteId = note.dataset.noteid;
  //add a new class of deleted to the note
  note.classList.remove('deleted');
  //change restore SVG with delete SVG
  let restoreBtn = note.querySelector('.restore-note-btn');
  restoreBtn.outerHTML = `<button class="delete-note-btn">
   <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" class="svg-inline--fa fa-trash fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
   <title>Delete</title>
   <path fill="currentColor" d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"></path></svg>
 </button>`;
  //removes permanently delete button
  let permDelBtn = note.querySelector('.permanently-delete');
  permDelBtn.remove();
  //add code to save new class in local storage before removing the note
  localStorage.setItem(noteId, JSON.stringify(note.outerHTML));

  // restores a deleted note count to totalNotes for statistics
  totalNotes++;
  localStorage.setItem('totalNotes', totalNotes);
}

//permanently delete items in trash bin
function permanentlyDelete(note) {
  //make sure the user want's to permanently delete
  let areYouSure = confirm('Are you sure you want to permanently delete this note?');
  //stop running function if user does not want to permanently delete
  if (!areYouSure) { return }
  //get the note's id to be able to change it in local storage
  let noteId = note.dataset.noteid;
  //delete the note from local storage
  localStorage.removeItem(noteId);
  //delete the note from notes list
  note.remove();
}

//Clears the trash bin and permanently deletes all notes with delete class
function emptyTrashBin() {
  //make sure the user want's to permanently delete
  let areYouSure = confirm('Are you sure you want to permanently delete all the notes in the trash bin?');
  //stop running function if user does not want to permanently delete
  if (!areYouSure) { return }
  //select all notes with the class of deleted
  let deletedNotes = document.querySelectorAll('.note.deleted');
  //grab each note and delete it
  deletedNotes.forEach(note => {
    //get the note's id to be able to change it in local storage
    let noteId = note.dataset.noteid;
    //delete the note from local storage
    localStorage.removeItem(noteId);
    //delete the note from notes list
    note.remove();
  })
}

// print function
function printContent() {
  window.print();
  // https://benfrain.com/create-print-styles-using-css3-media-queries/
}

function searchNotes() {
  // Get the value of the search input and make lower case
  let searchValue = document.getElementById('searchInput').value.toLowerCase();
  //console.log(searchValue);

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

/* Date Function */
function date() {
  let date = new Date();
  return date.toLocaleString();
}

//Function for adding the academic template
function changeToAcademic() {
  resetAllTemplates();
  editingField.classList.add('academic-note')
  templateData = "academic";
};
//Function for removing the academic template
function removeAcademic() {
  editingField.classList.remove('academic-note')
  templateData = "undefined";
}

//Function for adding the playfull template
function changeToPlayfull() {
  resetAllTemplates();
  editingField.classList.add('playfull-note')
  templateData = "playfull";
};
//Function for removing the playfull template
function removePlayfull() {
  editingField.classList.remove('playfull-note')
  templateData = "undefined";
}

//Function for adding the bigsize template
function changeToBigSize() {
  resetAllTemplates();
  editingField.classList.add('big-size-note')
  templateData = "big-size";
};
//Function for removing the bigsize template
function removeBigSize() {
  editingField.classList.remove('big-size-note')
  templateData = "undefined";
}

//Function for adding the creepy template
function changeToCreepy() {
  resetAllTemplates();
  editingField.classList.add('creepy-note')
  templateData = "creepy";
};
//Function for removing the creepy template
function removeCreepy() {
  editingField.classList.remove('creepy-note')
  templateData = "undefined";
}


//Removes all template classes
function resetAllTemplates() {
  templateData = "undefined";
  editingField.classList.remove('playfull-note')
  editingField.classList.remove('academic-note')
  editingField.classList.remove('big-size-note')
  editingField.classList.remove('creepy-note')
};

//Function for checking after witch template is active
function checkTemplate() {
  // If statement that checks if the templates are "active or not"
  if (editingField.classList.contains("playfull-note")) {
    //If the playfull template is "active" then the playfull template function is executed
    changeToPlayfull();

    //If the active template is academic
  } else if (editingField.classList.contains("academic-note")) {
    //The academic template function runs
    changeToAcademic();

    //If the active template is bigsize
  } else if (editingField.classList.contains("big-size-note")) {
    //The academic template function runs
    changeToBigSize();

    //If the active template is bigsize
  } else if (editingField.classList.contains("creepy-note")) {
    //The academic template function runs
    changeToCreepy();

  } else {
    return;
  }
};

// function to update the theme in the toolbar so it shows the correct theme for the active note
function setTheme() {
  // get the data template of the active note
  const activeNoteTemplate = document.querySelector('.active-note').dataset.template

  // set the value of the select element in the toolbar to the current theme
  if (activeNoteTemplate == 'undefined') {
    selectTheme.value = 'reset';
  } else {
    selectTheme.value = activeNoteTemplate;
  }
}

//Chart button directing to chart html
document.getElementById('chart-bar-button').onclick = function () {
  confirmClose();
  location.href = "stat.html";
};