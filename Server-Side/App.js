let express = require('express');
const {signIn, createUser, usersList} = require('./signupLogin');

const mongoose = require('mongoose');
const UserModel = require('./UserSchema');


class User{
    constructor(username, email, id, historyList = []){
        this.username = username;
        this.id = id;
        this.email = email;
        this.historyList = historyList; // the message History
        this.currentUser = null; // the current friend you are talking to
        this.cachedUsersList = []; // a short list of recent friends you've been talking to
        this.recentMessages = []; // recent messages sent to you by others
        this.friendsList = [] // list of friends you have on your account
        this.groupMessageList = [];
    }

    appendFriendList(user){
        this.friendsList.push(user);
        if(this.friendsList.length>0){
            this.friendsList.sort((user1, user2)=>{
                if(user1.username > user2.username)return -1;
                else if (user1.username < user2.username) return 1;
                return 0;
            });
        }
    }
    updateMessageList(message){
        this.recentMessages.push(message);
        this.historyList.push(message); // doesnt matter who the message is coming from just add it.
    }
    clearRecentList(){
        this.recentMessages.splice(0, this.recentMessages.length);
    }

    isRecentEmpty(){
        return (this.recentMessages.length === 0);
    }

    friendListToJSON(){
        let tempObject = {length:this.friendsList.length};
        if(tempObject.length > 0){
            for(let i=0; i<tempObject.length; i++){
                tempObject['friend '+i] = this.friendsList[i].toJSON();
            }
            return(tempObject);
        }
        return {length:0};
        
    }

    recentListJSON(){
        if(!this.isRecentEmpty()){
            let tempObj = {};
            tempObj.length = this.recentMessages.length;
            for(let i=0; i<this.recentMessages.length; i++){
                tempObj['message'+i] = this.recentMessages[i]
            }
            return(tempObj);
        }
        return {length:0}; 
    }

    toJSON(){
        return({
            username:this.username,
            email:this.email,
            id:this.id,
            messages:this.recentListJSON(),
            friends:this.friendListToJSON()
        });
    }
}

class Group{
    constructor(name, participants = []){
        this.name = name;
        this.participants = participants; // list of participants
        this.id = null;
        this.messageHistory = [];
    }

    setMessageHistory(historyList){
        this.messageHistory= historyList;
    }
    appendMessage(message){
        this.messageHistory.push(message);
        for(let i = 0; i<this.participants.length; i++){
            this.participants[i].updateMessageList(message);
        }
    }
}

function searchArray(arrayObject = [], key){
    let tempObj = arrayObject[0];
    if(arrayObject.length > 0){
        if(tempObj.username === key){
            return tempObj;
        }
        else{ // binary search algorithm
            
            if(arrayObject.length > 1){
                let middle = arrayObject[Math.floor(arrayObject.length/2)];
    
                if(middle.username === key)
                    return middle;
                else if(key > middle.username) // it means we should look from the second half
                    return searchArray(arrayObject.slice(Math.floor(arrayObject.length/2+1), 
                            arrayObject.length), key); // looking from the middle of the array
                
                else
                    // search the second half
                    return searchArray(arrayObject.slice(0, Math.floor(arrayObject.length/2)), key); 
            }else 
                return null;
        }
    }
}

function sortArrayUsers(array=[], scheme){
    array.sort((user1, user2)=>{
        if(user1[scheme]> user2[scheme])return -1;
        else if(user1[scheme] < user2[scheme])return 1;
        return 0;
    });
}

async function signUp(user={username:username, email:email, password:password}){
    let userObj = {}
    await createUser(user.email, user.password, user.username)
    .then(data=>{
        userObj = data;
        // console.log(data);
    });
    return userObj;
}

async function login(user={email:'', password:''}){
   return await signIn(user.email, user.password);
}

// setting up the server
let app = express();
const PORT = 8090 || process.env.PORT;
const users = [];

const url = "mongodb+srv://Sthembiso:Stheshboi2C@cluster0.2hrhj.mongodb.net/TND?retryWrites=true&w=majority";

mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology:true})
.then(res=>{
    console.log('db connected')
    app.listen(PORT, function(){
        console.log('Listening on port'+PORT);
    });
}).catch(err=>{})



app.use(express.text());
app.use(express.urlencoded({extended:true}));

app.post('/signin', (req, res)=>{ // register to the active users list
    console.log('I run')
    if(JSON.parse(req.body)!= null){
        let resBody = JSON.parse(req.body);
        if(searchArray(users, resBody.username) == null){ // add them to the active users list
            let tempUser = new User(resBody.username,resBody.userEmail, resBody.userId);
            users.push(tempUser);
            res.end('Approved');
            console.log("I'm in");
            return;
        }
    }  
});

app.post('/users', (req, res)=>{ // request for your friend list
    let user = JSON.parse(req.body);
    let userObj = searchArray(users, user.username);
    if(userObj!= null) res.end(JSON.stringify(userObj.friendListToJSON()));    
    else res.end(JSON.stringify({length:0}))

    // console.log(users);
});

app.post('/send', (req, res)=>{
    let messageRef = JSON.parse(req.body);
    // route message from one user to the next
    if(messageRef.recipientType === 'single'){
        let recipient  = messageRef.recipient;
        let user = searchArray(users, recipient);
        user.updateMessageList(messageRef);
        messageRef.status = 'sent'
        res.end(JSON.stringify(messageRef));
        return;
    }
    else if(messageRef.recipientType === 'group'){
        let groupName = messageRef.group.name;
        let group = searchArray(groups, groupName);
        // route message to every user in the group ... 
        group.updateMessageList(messageRef);
        messageRef.status = 'sent';
        res.end(JSON.stringify(messageRef));
        return;
    }
});

app.post('/poll', (req, res)=>{
    let userRef = JSON.parse(req.body);
    let user = searchArray(users, userRef.username);
    if(user != null){
        if(!user.isRecentEmpty()){
            res.end(JSON.stringify(user.recentListJSON()));
            user.clearRecentList();
            return;
        }
        else{
            res.end(JSON.stringify({length:0}));
            return;
        }
    }
    res.end(JSON.stringify({status:'User not found!'}));
});

app.post('/addFriend', (req, res)=>{
    let user = JSON.parse(req.body);
    let userObj = searchArray(users, user.searchString);
    if(userObj == null){
        res.end(JSON.stringify({status:500}));
        return;
    }
    else{
        let friend = searchArray(users, user.username);
        friend.appendFriendList(userObj);
        let userJSON = userObj.toJSON();
        userJSON.status = 0;
        res.end(JSON.stringify(userJSON));
        return;
    }
});

app.post('/search', (req, res)=>{
    let searchData = JSON.parse(req.body);

    let userObj = searchArray(users, searchData.name);
    console.log(userObj)

    if(userObj != null){
        let tempJSON = userObj.toJSON();
        tempJSON.length = 1;
        res.end(JSON.stringify(tempJSON));
        return;
    }
    else{
        res.end(JSON.stringify({length:0}));
        return;
    }
});

app.post('/signup', (req, res)=>{
    let userFormData = JSON.parse(req.body);
    signUp(userFormData, res)
    .then(user=>{
        console.log('Evaluating response');
        if(user.status == 'Firebase: Error (auth/email-already-in-use).'){
            console.log(user)
            res.write('Email already in use $');
            res.end(JSON.stringify(user));
        }
        else if( user.status == 'Firebase: Error (auth/invalid-email).'){
            console.log(user)
            res.write('Invalid Email address$');
            res.end(JSON.stringify(user));
        }
        else if(user.status === ''){
            console.log('I run')
            res.write('Sign Up Successful$');
            res.end(JSON.stringify(user));
            let tempUser = new User(user.username, user.email, user.id, []);
            users.push(tempUser); // add the user to the local list
            console.log(users);
            let UserMod = new UserModel(tempUser.toJSON());
            UserMod.save()
            .then(()=>{
                
            }).catch(err=>{console.log(err)})
            console.log(user)
            // back up the user information in the database
        }

        console.log(user)
    });
});

app.post('/login', (req, resp)=>{
    let userFormData = JSON.parse(req.body);
    
    login(userFormData)
    .then(res=>{
        if(res.status == ''){ // the login was successful
            resp.write('successful$');
            resp.end(JSON.stringify({}));
            console.log('Login Successful');
            let userSearch = searchArray(users, res.username);
            if(userSearch == null){
                UserModel.findOne({email:userFormData.email})
                .then((dbRes)=>{
                    let tempUser = new User(dbRes.username, dbRes.email, dbRes._id, messages);
                    tempUser.cachedUsersList.push(dbRes.friends);
                    users.push(tempUser);
                    console.log(users);
                })
                .catch(err=>{})
            }
            
        }
        else{
            resp.write('failed$');
            resp.end(JSON.stringify({}));
            console.log('Login failed')
        }
    })
    .catch(err=>{})
    
});

