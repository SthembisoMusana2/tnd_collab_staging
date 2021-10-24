

const resultsContainer = document.getElementsByClassName('search-results')[0];
const overlay = document.getElementsByClassName('add-user-overlay')[0];
const closeOverlay = document.getElementById('close-overlay-t');
const addUserButton = document.getElementById('add-user');
const searchField = document.getElementById('search-string');
const searchButton = document.getElementById('search-button');


function resultTemplate(user={username:'', email:'', id:0}){
    return(
        ` <div class="friend-object">
        <img src="../TND-Logo_-Unpacked-Parts-VC.svg" alt="user-avatar" class="responsive-img circle result-avatar"/>
        <div class="user-information">
            <span class="result-username">${user.username}</span>
            <span class="result-email">${user.email} </span>
        </div> 
        
        <input type="button" value="Add" class="browser-default search-button add-friend-button" />
    </div>`
    );
}

async function searchFriend(friend = {name:''}){
    return fetch('http://127.0.0.1:8090/search', {
        method:'POST',
        body:JSON.stringify(friend)
    });
}

window.addEventListener('load', function(e){
   
    
    addUserButton.addEventListener('click', function(e){
        overlay.style.display = 'block'; 
    });
    closeOverlay.addEventListener('click', function(e){
        resultsContainer.innerHTML = ''
        overlay.style.display = 'none';
    });

    let result;
    searchField.addEventListener('keydown', (e)=>{
        if(e.key == 'Enter'){
            let searchString = searchField.value;
            if(searchString.length > 0){
                resultsContainer.innerHTML = `<div class="spinner center"></div><br/>`;
                const spinner = document.getElementsByClassName('spinner')[0];
                spinner.style.visibility = 'visible';
                searchFriend({name:searchString})
                .then(res=>{
                    res.text()
                    .then(data=>{
                        result = JSON.parse(data);
                        if(result.length > 0){
                            result = JSON.parse(data);
                            resultsContainer.innerHTML = resultTemplate(result);
                            const addFriendButtons = document.getElementsByClassName('add-friend-button');
                            for(let i=0; i<addFriendButtons.length; i++){
                                addFriendButtons[i].addEventListener('click', function(e){
                                    let usersList = document.getElementsByClassName('friend-object');
                                    let thisUser = usersList[i];
                                    let userInfo = thisUser.innerText.split('\n');
                                    let userName = userInfo[0];
                                    let email = userInfo[1];
                                    console.log(userName);
                                    user.appendFriend(new User(userName.trim(), email, 0, []));
                                    contactList.innerHTML = user.refreshFriendList();
                                    overlay.style.display = 'none';
                                    resultsContainer.innerHTML = '';
                                    updateUserClick();
        
                                });
                            }
                        }
                        else{
                            resultsContainer.innerHTML = `<div class=""><p style="text-align:center;color:grey">No user found with that username,<br /> 
                                                            please check the name and try again</p></div>`;
                        }
                        spinner.style.visibility = 'hidden';
                    });
                });
            }
            searchField.value = '';
        }
    })

    searchButton.addEventListener('click', function(e){
        let searchString = searchField.value;
        if(searchString.length > 0){
            resultsContainer.innerHTML = `<div class="spinner center"></div><br/>`;
            const spinner = document.getElementsByClassName('spinner')[0];
            spinner.style.visibility = 'visible';
            searchFriend({name:searchString})
            .then(res=>{
                res.text()
                .then(data=>{
                    result = JSON.parse(data);
                    if(result.length > 0){
                        result = JSON.parse(data);
                        resultsContainer.innerHTML = resultTemplate(result);
                        const addFriendButtons = document.getElementsByClassName('add-friend-button');
                        for(let i=0; i<addFriendButtons.length; i++){
                            addFriendButtons[i].addEventListener('click', function(e){
                                let usersList = document.getElementsByClassName('friend-object');
                                let thisUser = usersList[i];
                                let userInfo = thisUser.innerText.split('\n');
                                let userName = userInfo[0];
                                let email = userInfo[1];
                                console.log(userName);
                                user.appendFriend(new User(userName.trim(), email, 0, []));
                                contactList.innerHTML = user.refreshFriendList();
                                overlay.style.display = 'none';
                                resultsContainer.innerHTML = '';
                                updateUserClick();
    
                            });
                        }
                    }
                    else{
                        resultsContainer.innerHTML = `<div class=""><p style="text-align:center;color:grey">No user found with that username,<br /> 
                                                        please check the name and try again</p></div>`;
                    }
                    spinner.style.visibility = 'hidden';
                });
            });
        }
        searchField.value = '';
    });

});