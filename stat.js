// getting current noted from local storage
let totalNotes = localStorage.getItem('totalNotes');
// getting all ever written notes from localstorage
let totalNotesEverwritten = localStorage.getItem('notesNumber');
// assigning html id's where the statistics are going to go a variable
let circle = document.querySelector('#totalNotes');
let bar = document.querySelector('#everWritten');

// displaying the statistics in the html elements
circle.innerHTML = totalNotes;
bar.innerHTML = totalNotesEverwritten;