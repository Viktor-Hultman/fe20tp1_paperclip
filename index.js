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
    } else {
      pageVisits += 1;
      localStorage.setItem("pageVisits", pageVisits);
    }
  }