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
    }
    updateMessageList(message){
        this.recentMessages.push(message);
        this.historyList.push(message);
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
            let tempObj = {length:this.recentListJSON.length};
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

const { time } = require('console');
const { Hash, createHash } = require('crypto');
let express = require('express');
const { endianness } = require('os');

// setting up the server
let app = express();
const PORT = 8090 || process.env.PORT;
const users = [];


app.listen(PORT, function(){
    console.log('Listening on port'+PORT);
});
app.use(express.text());
app.use(express.urlencoded({extended:true}));

app.post('/signin', (req, res)=>{ // register to the active users list

    if(JSON.parse(req.body)!= null){
        let resBody = JSON.parse(req.body);
        if(searchArray(users, resBody.username) == null){ // add them to the active users list
            let tempUser = new User(resBody.username,resBody.userEmail, resBody.userId);
            users.push(tempUser);
            res.end('Approved');
            return;
        }
    }  
});

app.post('/users', (req, res)=>{ // request for your friend list
    let user = JSON.parse(req.body);
    let userObj = searchArray(users, user.username);
    res.end(JSON.stringify(userObj.friendListToJSON()));    
});

app.post('/send', (req, res)=>{
    let messageRef = JSON.parse(req.body);
    console.log(messageRef) // route message from one user to the next
    if(messageRef.recipientType === 'single'){
        let recipient  = messageRef.recipient;
        let user = searchArray(users, recipient);
        user.appendMessageList(messageRef);
        messageRef.status = 'sent'
        res.end(JSON.stringify(messageRef));
        return;
    }
    else if(messageRef.recipientType === 'group'){
        let groupName = messageRef.group.name;
        let group = searchArray(groups, groupName);
        // route message to every user in the group ... 
        group.appendMessageList(messageRef);
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
            return;
        }
        else{
            res.end('empty');
            return;
        }
    }
    res.end('User not found!');
});

app.post('/addFriend', (req, res)=>{
    let user = JSON.parse(req.body);
    let userObj = searchArray(users, user.searchString);
    if(userObj == null){
        res.end({status:500});
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
