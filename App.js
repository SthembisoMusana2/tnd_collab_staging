
class Message{
    constructor(sender="server",recipient="you", messageTime = null, messageBody = null, group={flag:false, groupName:""}){
        this.sender = sender;
        this.recipient = recipient;
        this.messageTime = messageTime;
        this.messageBody = messageBody;
        this.group = group;
    }
    toJSON(){
        return({
            sender:this.sender,
            recipient:this.recipient,
            messageTime:this.messageTime,
            messageBody:this.messageBody,
            group:this.group
        })
    }

}


class User{
    constructor(username, id, email, historyList = []){
        this.username = username;
        this.id = id;
        this.email = email;
        this.historyList = historyList; // the message History
        this.currentUser = null; // the current friend you are talking to
        this.cachedUsersList = null; // a short list of recent friends you've been talking to
        this.recentMessages = null; // recent messages sent to you by others
        this.friendsList = null // list of friends you have on your account
    }

    appendMessageHistory(message){
        this.historyList.push(message);
    }
    updateRecentList(message){
        this.recentMessages.push(message);
    }
    recentListJSON(){
        return({
            data:this.recentMessages.map((message)=>{
                return(message.toJSON());
            })
        });
    }
}

const { time } = require('console');
const { Hash, createHash } = require('crypto');
let express = require('express');

// setting up the server
let app = express();
const PORT = 8090 || process.env.PORT;

app.listen(PORT, function(){
    console.log('Listening on port'+PORT);
});
app.use(express.text());
app.use(express.urlencoded({extended:true}));



app.get('/', (req, res)=>{
    // console.log(req);
});

app.post('/', (req, res)=>{
    console.log(JSON.parse(req.body));
})



