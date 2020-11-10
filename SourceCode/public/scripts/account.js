const accountInfo = document.querySelector('.account-info');



const updateAccountInfo = (user) => {
    if (user) {
        db.collection('users').doc(user.uid).get().then(doc => {
            var email = document.getElementById('update-email');
            var name = document.getElementById('update-name');
            var dob = document.getElementById('update-dob');
            var phone = document.getElementById('update-phone');
            email.value = user.email;
            name.value = doc.data().name;
            dob.value = doc.data().dob;
            phone.value = doc.data().phone;

        })

    } else {
        accountInfo.innerHTML = `
    <div> Please log in first</div>
    `;

    }
}

//listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        updateAccountInfo(user)
    } else {
        updateAccountInfo()
    }
});

const updateForm = document.querySelector('#update-form');
updateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    auth.onAuthStateChanged(user => {
        //console.log(user.uid);
        if (user) {
            db.collection('users').doc(user.uid).update({

                email: updateForm['update-email'].value,
                name: updateForm['update-name'].value,
                dob: updateForm['update-dob'].value,
                phone: updateForm['update-phone'].value
            }).then(function(){
                
                window.location.href ="index.html";
            })

        } else {
            updateAccountInfo();
        }

        
    })
});