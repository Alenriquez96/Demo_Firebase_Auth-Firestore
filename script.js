// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8gk8R9laPud5MwM1A24P8N75zZwBOuwU",
  authDomain: "auth-prueba-85c5c.firebaseapp.com",
  projectId: "auth-prueba-85c5c",
  storageBucket: "auth-prueba-85c5c.appspot.com",
  messagingSenderId: "168571272867",
  appId: "1:168571272867:web:83de718b410293135c0916"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();// db representa mi BBDD

//PASOS PARA QUE SALGA EL LOG CON GOOGLE
let provider = new firebase.auth.GoogleAuthProvider();

//Función de login con Auth
async function login (){
  try{
      const response = await firebase.auth().signInWithPopup(provider);
      console.log(response);

      let newUser = {
        email: response.user.email,
        name: response.user.displayName,
      }
      
      db.collection("users")
        .where("email", "==", response.user.email)
        .get()
        .then((querySnapshot) => {
          console.log(querySnapshot);
          if(querySnapshot.size == 0){
            db.collection("users")
            .add(newUser)
            .then((docRef) => console.log("Document written with ID: ", docRef.id))
            .catch((error) => console.error("Error adding document: ", error));
          } else{
            console.log(`usuario de nombre ${response.user.displayName} ya existe en la BBDD firestore.`);
          }
        });

      return response.user;

  }catch(error){  
      console.log(error);
  }
}

//DESLOGUEARSE AUTH
const signOutGoogle = async () => {
  try {
      let user = await firebase.auth().currentUser;
      await firebase.auth().signOut();
      console.log("Sale del sistema: "+user.email);
      localStorage.clear();
  } catch (error) {
      console.log("hubo un error: "+error);
  }
}
document.getElementById("logout").addEventListener("click", signOutGoogle);

const buttonLogin = document.getElementById("google");

buttonLogin.addEventListener("click", async (e)=>{
    try{
        await login();
    } catch(error) {}
});





const createUser = (user) => {
  db.collection("users")
    .add(user)
    .then((docRef) => console.log("Document written with ID: ", docRef.id))
    .catch((error) => console.error("Error adding document: ", error));
};

document.getElementById("crear").addEventListener("click", () => {
  const first = prompt("Introduce nombre");
  const last = prompt("introduce apellido");
  createUser({
    first,
    last,
    born: 2000,
    otro: "cafe",
  });
});

const readAllUsers = (born) => {
  db.collection("users")
    .where("born", "==", born)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
      });
    });
};
//readAllUsers(1224)

// Read ONE
function readOne(id) {
  db.collection("users")
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}
//readOne("690WYQfTZUoEFnq5q1Ov");

/**************Firebase Auth*****************/

const signUpUser = (email, password) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`se ha registrado ${user.email} ID:${user.uid}`)
      alert(`se ha registrado ${user.email} ID:${user.uid}`)
      // ...
      // Guarda El usuario en Firestore
      createUser({
        id:user.uid,
        email:user.email,
        message:"Hola que tal"
      });

    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log("Error en el sistema"+error.message);
    });
};

//"alex@demo.com","123456"

document.getElementById("form1").addEventListener("submit",function(event){
    event.preventDefault();
    let email = event.target.elements.email.value;
    let pass = event.target.elements.pass.value;
    let pass2 = event.target.elements.pass2.value;

    pass===pass2?signUpUser(email,pass):alert("error password");
})


const signInUser = (email,password) =>{
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in
        let user = userCredential.user;
        console.log(`se ha logado ${user.email} ID:${user.uid}`)
        alert(`se ha logado ${user.email} ID:${user.uid}`)
        console.log(user);
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
      });
}

const signOut = () => {
    let user = firebase.auth().currentUser;

    firebase.auth().signOut().then(() => {
        console.log("Sale del sistema: "+user.email)
      }).catch((error) => {
        console.log("hubo un error: "+error);
      });
}


document.getElementById("form2").addEventListener("submit",function(event){
    event.preventDefault();
    let email = event.target.elements.email2.value;
    let pass = event.target.elements.pass3.value;
    signInUser(email,pass)
})
document.getElementById("salir").addEventListener("click", signOut);

document.getElementById("loggedUsers").addEventListener("click", function(){
  // Listener de usuario en el ssitema
  // Controlar usuario logado
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(`Está en el sistema:${user.email} ${user.uid}`);
    } else {
      console.log("no hay usuarios en el sistema");
    }
  });
})

