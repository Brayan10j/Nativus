export default function ({app , redirect}) {
  app.$fireAuth.onAuthStateChanged((user) => {
    // If the user is not authenticated
    if(!user){
      console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    }else{
      console.log("si auth");
    }
  })
}
