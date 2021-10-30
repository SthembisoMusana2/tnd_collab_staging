
let serverUrl = 'https://tnd-messaging.herokuapp.com/';

async function hash(string) {
    const utf8 = new TextEncoder().encode(string);
    return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
      return hashHex;
    });
  }

addEventListener('load', function(e){
    let login = document.getElementById('login');
    let loginLink = document.getElementById('login-link');
    let signup = document.getElementById('signup');
    let signupLink = document.getElementById('signup-link');
    const loginForm = document.getElementById('login-form');
    const signUpForm = document.getElementById('signup-form');
    const spinner = document.getElementsByClassName('spinner')[0];
    const spinner2 = document.getElementsByClassName('spinner')[1];
    const spinnerContainer = document.getElementsByClassName('spinner-cont')[0];
    const confirmPassowrd = document.getElementById('cpassword');
    let password1 = document.getElementById('pass');

    confirmPassowrd.addEventListener('input', (e)=>{
        console.log(password1.value)
        if(e.target.value != password1.value){
            confirmPassowrd.style.border = '1px solid red';
        }
        else{
            confirmPassowrd.style.border = '1px solid green';
        }
    })

    loginLink.addEventListener('click', function(e){
        e.preventDefault();
        login.style.display = 'none';
        signup.style.display = 'block';
        let avatarUrl = localStorage.getItem('avatar');
        if(avatarUrl == null){
            const overlay = document.getElementsByClassName('overlay')[0];
            overlay.style.display = 'flex';
        }
    });

    signupLink.addEventListener('click', function(e){
        e.preventDefault();
        signup.style.display = 'none';
        login.style.display = 'block';
    });

    loginForm.addEventListener('submit', function(e){
        e.preventDefault();

        const formData = new FormData(e.target);
        const email = formData.get('email');
        let password = formData.get('password');

        hash(password).then(res=>{
            password = res;
            console.log(password);

            spinnerContainer.innerHTML = `<div class="spinner verticalCenter center">
                                    </div>`
            const spinner2 = document.getElementsByClassName('spinner')[1];
            spinner2.style.visibility = 'visible';
            
            let tempObj = {email:email, password:password};

            fetch(serverUrl+'login', {
                method:'POST',
                // mode:'no-cors',
                body:JSON.stringify(tempObj)
            }).then(resp=>{
                resp.text()
                .then(data=>{
                    spinner2.style.visibility = 'hidden';
                    resp = data.split('$')
                    console.log(resp)
                    if(resp[0] == 'successful'){
                        //redirect to the user space...
                        let userObj = JSON.parse(resp[1]);//JSON.parse(resp[1]);
                        console.log(resp[1])
                        localStorage.setItem('username', userObj.username);
                        localStorage.setItem('email', userObj.email);
                        localStorage.setItem('id', userObj.id);
                        localStorage.setItem('password', tempObj.password);

                        let path = window.location.pathname.split('/');
                        path.pop();
                        path.push('messaging.html');
                        path = path.join('/');
                        window.location.pathname = path; 
                    }
                    else{
                        spinnerContainer.innerHTML = `<div class="verticalCenter center">
                                                    <p style="text-align:center;color:red;font-family:roboto;font-size:large; ">
                                                        Login Failed ... please try again!
                                                        </p>
                                                    </div>`
                    }
                });
            });
        })
        .catch(err=>{console.log('Error hashing the string -->', err.message)})

    });

    signUpForm.addEventListener('submit', function(e){
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const username = formData.get('username');
        let password = formData.get('password');
        const email = formData.get('email');  
        let cpassword =  formData.get('cpassword');
        
        if(cpassword == password){
            hash(password).then(res=>{
                    password = res;

                    spinner.style.visibility = 'visible';

                    let tempObj = {username:username, email:email, password:password, avatar:localStorage.getItem('avatar')};

                    fetch(serverUrl+'signup', {
                        method:'POST',
                        // mode:'no-cors',
                        body:JSON.stringify(tempObj)
                    }).then(resp=>{
                        resp.text()
                        .then(data=>{
                            spinner.style.visibility = 'hidden';
                            resp = data.split('$');
                            if(resp[0] == 'Sign Up Successful'){
                                //redirect to the user space...
                                let userObj = JSON.parse(resp[1]);
                                localStorage.setItem('username', userObj.username);
                                localStorage.setItem('email', userObj.email);
                                localStorage.setItem('id', userObj.id);
                                localStorage.setItem('password', tempObj.password);
                                
                                window.location.replace('messaging.html');
                            }
                            else{
                            }
                        })
                        .catch(err=>{

                        });
                    });
                })
                .catch(err=>{
                    console.log('Error Hashing the passowrd: ', err);
                })
            }
            else{
                alert("confirm passowrd doesn't match!");
            }
    });


});


