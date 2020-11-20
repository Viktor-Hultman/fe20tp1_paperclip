// var quill = new Quill('#editor', {
//    theme: 'snow'
//   });


  //new user redirect
  let pageVisits = localStorage.getItem('pageVisits'); 
  console.log(pageVisits);
  if (pageVisits == null) {
    pageVisits = 0;
  }

  function redirectToInfo(){
    window.location = "intro.html";
  }

  function redirectNewUser(){
   
   
   if (pageVisits == 0) {
      pageVisits += 1;
      localStorage.setItem("pageVisits", pageVisits);
      redirectToInfo();
    } else {
      pageVisits += 1;
      localStorage.setItem("pageVisits", pageVisits);
    }
    
  }