const signupForm = document.querySelector('#signup-form');

//listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        db.collection('guides').onSnapshot(snapshot => {
            // setupGuides(snapshot.docs);
            setupUI(user);
        }, err => {
            console.log(err.message)
        });
    } else {
        setupUI();
        //setupGuides([]);
    }
});




// signup

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    //sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        db.collection('users').doc(cred.user.uid).set({
            email: signupForm['signup-email'].value,
            name: signupForm['signup-name'].value,
            dob: signupForm['signup-dob'].value,
            phone: signupForm['signup-phone'].value
        });

    }).then(() => {
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
        signupForm.querySelector('.error').innerHTML = "";
    }).catch(err => {
        signupForm.querySelector('.error').innerHTML = err.message;
    });
});

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
})

// login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        //close the login modal and reset the form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
        loginForm.querySelector('.error').innerHTML = '';
    }).catch(err => {
        loginForm.querySelector('.error').innerHTML = err.message
    })
})