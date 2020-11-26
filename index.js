let newNoteButton = document.querySelector(".new-note-button")
let titleInputContainer = document.querySelector(".titel-input-container")
let submitTitleBtn = document.querySelector("#submit-title-button")
let titleInputValue = document.querySelector("#input-title").value

//Event listeners
newNoteButton.addEventListener("click", createNewNote)

//Global variable for click checks
let clicked = 0;

//Sets up the quill editor in the element with the id of "editor"
var quill = new Quill('#editor', {
  theme: 'snow'
  });

//Function for opening the input field for creating a new note
function createNewNote() {
  //First checks the global check variable
  if(clicked < 1){
    //Removes the "hidden" css class from the input field container
    titleInputContainer.classList.remove("hidden")
    //Adds the "hidden" css class to the entire editor container to only show the input field container
    document.querySelector(".toolbar-and-editor-container").classList.add("hidden")
    //Removes the first child (previous title) so a new first child can be used
    document.querySelector(".ql-editor").removeChild(document.querySelector(".ql-editor").childNodes[0])
    //Adds value to the global variable so the "Create new note" button does nothing while the input container is used
    clicked ++;
  } 
}

//Function for submiting the input value as the title for the editor
function submitTitle() {
  //Sets the value of the input field to a vatiable
  let inputValue = document.querySelector("#input-title").value;

  //Creates a h1 element and sets it to a variable
  let h = document.createElement("h1");
  h.classList.add('title');

  //Creates text that uses the value of the input field and sets it to a variable
  var t = document.createTextNode(inputValue);

  //Appends the text with the value to the h1 element
  h.appendChild(t);

  //"Getting" the element that is the parent were we want to place the title
  let parentElement = document.querySelector(".ql-editor")
  //"Getting" the current first child element (an empty "p" tag that comes with the editor when created)
  let theFirstChild = parentElement.firstChild
  //Places the new title before the empty "p" tag
  parentElement.insertBefore(h, theFirstChild)
  //Resets the value of the input field to blank
  document.querySelector("#input-title").value = ""
  //Adds the "hidden" class to the input container
  titleInputContainer.classList.add("hidden")
  //Removes the "hidden" class from the editor container
  document.querySelector(".toolbar-and-editor-container").classList.remove("hidden")
  //Removes value from the global "check" variable so the "Create new note" button can be used again
  clicked --;
}

  //new user redirect
  let pageVisits = JSON.parse(localStorage.getItem('pageVisits')); 
  console.log(pageVisits);

  function redirectToInfo(){
    window.location = "intro.html";
}

  function redirectNewUser(){   
   if (pageVisits == null) {
      pageVisits += 1;
      localStorage.setItem("pageVisits", pageVisits);
      redirectToInfo();
    } 
}



const notesListContainer = document.querySelector('.saved-notes-list');

function addNote(e) {

  // Note DIV
  const noteDiv = document.createElement('div');
  guestDiv.classList.add('guest');
  guestDiv.setAttribute('id', Date.now());

  // Create H2 & append to DIV
  const newGuest = document.createElement('h2');
  newGuest.innerText = guestInput.value;
  newGuest.classList.add('guest-heading');
  guestDiv.appendChild(newGuest);

  // Create PARAGRAPH & append to DIV
  const newComment = document.createElement('p');
  newComment.innerText = guestText.value;
  newComment.classList.add('guest-comment');
  guestDiv.appendChild(newComment);

  // Create DATE-paragraph & append to div
  const currentDate = document.createElement('p');
  currentDate.innerText = date();
  currentDate.classList.add('guest-date');
  guestDiv.appendChild(currentDate);

  // Create guest object and ADD TODO TO LOCAL STORAGE
  const note = {
      name: guestInput.value,
      comment: guestText.value,
      date: date(),
      id: Date.now()
  };

  saveLocalGuests(guest);

  //APPEND TO CONTAINER
  guestContainer.appendChild(guestDiv);
}



function saveLocalNotes(note) {
  //CHECK IF THERE IS ITEMS IN LOCAL STORAGE
  let notes;
  if(localStorage.getItem('notes') === null) {
      notes = [];
  } else {
      notes = JSON.parse(localStorage.getItem('notes'));
  }

  notes.push(note);
  localStorage.setItem('notes', JSON.stringify(notes));
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



// EXAMPLE OF TOOLBAR CUSTOMIZATION
var toolbarOptions = [
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'font': [] }],

  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  ['blockquote', 'code-block'],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'align': [] }],
  [{ 'indent': '-1' }, { 'indent': '+1' }, { 'direction': 'rtl' }],          // outdent/indent
  [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  ['clean']                                         // remove formatting button
];

// IN ORDER TO WORK THE FOLLOWING NEEDS TO BE WRITTEN WHEN INITIALIZING THE EDITOR
/* 

quill = new Quill('.editor', {
    modules: {
        toolbar: toolbarOptions
    },
    theme: 'snow'
});

*/