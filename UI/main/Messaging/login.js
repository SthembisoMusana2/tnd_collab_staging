

addEventListener('load', function(e){
    let login = document.getElementById('login');
    let loginLink = document.getElementById('login-link');
    let signup = document.getElementById('signup');
    let signupLink = this.document.getElementById('signup-link')

    console.log(login)

    loginLink.addEventListener('click', function(e){
        // alert('click')
        e.preventDefault();
        login.style.display = 'none';
        signup.style.display = 'block';
    });

    signupLink.addEventListener('click', function(e){
        e.preventDefault();
        signup.style.display = 'none';
        login.style.display = 'block';
    });
});


