export default function ({ store, redirect }) {
  // If the user is not authenticated
  //let email = localStorage.getItem("email");
  if (!store.auth) {
    console.log("no auth")
    //return redirect('/login')
  }else{
    console.log("si auth")
  }
}
