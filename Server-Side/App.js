class User{
    constructor(username, id, email, historyList = []){
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
        return null;
        
    }

    recentListJSON(){
        if(!this.isRecentEmpty()){
            let tempObj = {};
            for(let i=0; i<this.recentMessages.length; i++){
                tempObj['message'+i] = this.recentMessages[i]
            }
            return(tempObj);
        }
        return {};
        
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
    constructor(name, participants){
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
    }
}

const { time } = require('console');
const { Hash, createHash } = require('crypto');
let express = require('express');
const { endianness } = require('os');

// setting up the server
let app = express();
const PORT = 8090 || process.env.PORT;
const users = []
const testUser = new User('Sthembiso Musana', '12341241', 'sthembisomusana2@gmail.com');

const TestUsers =  []
for(let i = 0; i<10; i++){
    let tempUser = new User("Sthembiso"+i, "1234123123+"+i+"1212"+i+i, "sthembiso@"+i);
    TestUsers.push(tempUser);

}

testUser.friendsList = TestUsers;


TestUsers.sort((user1, user2)=>{
    if(user1.username > user2.username)return 1;
    else if(user1.username < user2) return -1;
    return 0;
});


app.listen(PORT, function(){
    console.log('Listening on port'+PORT);
});
app.use(express.text());
app.use(express.urlencoded({extended:true}));


app.post('/send', (req, res)=>{
    let messageRef = JSON.parse(req.body);
    console.log(messageRef)
    if(messageRef.recipientType === 'single'){

    }
});

app.get('/users', (req, res)=>{
    console.log(JSON.stringify(testUser.toJSON()));    
    res.end(JSON.stringify(testUser.toJSON()));    
});

app.post('/signin', (req, res)=>{

    if(JSON.parse(req.body)!= null){
        let resBody = JSON.parse(req.body);
        console.log(resBody);
        let tempUser = new User(resBody.username, resBody.userId, resBody.userEmail);
        users.push(tempUser);
    }
    
});

app.post('/poll', (req, res)=>{
    console.log(JSON.parse(req.body));
});


function searchArray(arrayObject = [], key){
    let tempObj = arrayObject[0];

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
