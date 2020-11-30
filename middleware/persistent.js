export default function ({app , redirect}) {
  app.$fireAuth.onAuthStateChanged((user) => {
    // If the user is not authenticated
    if(user){
      redirect("/dashboard")
    }else{
      redirect("/login")
    }
  })
}
