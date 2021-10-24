

addEventListener('load', function(e){
    let login = document.getElementById('login');
    let loginLink = document.getElementById('login-link');
    let signup = document.getElementById('signup');
    let signupLink = this.document.getElementById('signup-link');
    const loginForm = document.getElementById('login-form');
    const signUpForm = document.getElementById('signup-form');
    const spinner = document.getElementsByClassName('spinner')[0];
    const spinner2 = document.getElementsByClassName('spinner')[1];

    loginLink.addEventListener('click', function(e){
        e.preventDefault();
        login.style.display = 'none';
        signup.style.display = 'block';
    });

    signupLink.addEventListener('click', function(e){
        e.preventDefault();
        signup.style.display = 'none';
        login.style.display = 'block';
    });

    loginForm.addEventListener('submit', function(e){
        e.preventDefault();

        spinner2.style.visibility = 'visible';
        

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        let tempObj = {email:email, password:password};

        fetch('http://127.0.0.1:8090/login', {
            method:'POST',
            body:JSON.stringify(tempObj)
        }).then(resp=>{
            resp.text()
            .then(data=>{
                spinner2.style.visibility = 'hidden';
                resp = data.split('$')
                if(resp[0] == 'successful'){
                    //redirect to the user space...
                    let userObj = {username:'sthe', email:email, id:'nothing'}//JSON.parse(resp[1]);
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
            });
        });

    });

    signUpForm.addEventListener('submit', function(e){
        e.preventDefault();
        spinner.style.visibility = 'visible';

        console.log(spinner);
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');
        const email = formData.get('email');

        let tempObj = {username:username, email:email, password:password};


        fetch('http://127.0.0.1:8090/signup', {
            method:'POST',
            body:JSON.stringify(tempObj)
        }).then(resp=>{
            resp.text()
            .then(data=>{
                spinner.style.visibility = 'hidden';
                resp = data.split('$')
                if(resp[0] == 'Sign Up Successful'){
                    //redirect to the user space...
                    let userObj = JSON.parse(resp[1]);
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
            });
        });
        // send the data to Firebase and await response ...
    });


});


