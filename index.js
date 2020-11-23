// var quill = new Quill('#editor', {
//    theme: 'snow'
//   });


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