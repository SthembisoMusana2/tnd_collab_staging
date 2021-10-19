
const{getFirestore,  getDocs, collection, addDoc } = require('firebase/firestore/lite');
const {getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword } = require("firebase/auth");
const { initializeApp } = require("firebase/app");

const firebaseConfig = {
  apiKey: "AIzaSyBcKUcXgtiKgou2rh7IDRbFqOA3gqm7gkw",
  authDomain: "tshepiso5562.firebaseapp.com",
  projectId: "tshepiso5562",
  storageBucket: "tshepiso5562.appspot.com",
  messagingSenderId: "250406312502",
  appId: "1:250406312502:web:f2161fb9608700d1625697"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const data_base = getFirestore(app);


const prompt = require('prompt-sync')();

const gotAccount =prompt('You got an account (Y/N): ');

if(gotAccount === 'N'){
    const username = prompt('Username: ');
    const email = prompt('Email Address: ');
    const password = prompt('Password: ');


    createUserWithEmailAndPassword(auth,email,password)
    .then(async ()=>{ 
        try {
            const docRef = await addDoc(collection(data_base, "users"), {
            username: username,
            email: email,
            password: password
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        
    })
    .then(signInWithEmailAndPassword(auth,email,password))
}else{
    const email = prompt('Email Address: ');
    const password = prompt('Password: ');

    signInWithEmailAndPassword(auth,email,password)

}

async function userList(){
    const users = collection(data_base, 'users');
    const user_doc= await getDocs(users);
    const users_array = user_doc.docs.map(doc => doc.data());
    console.log(users_array);
    return users_array;
}



   
    


