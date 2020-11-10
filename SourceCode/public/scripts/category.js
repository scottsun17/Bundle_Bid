// const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const kitchenDiv = document.querySelector('#kitchen-list');
const appealDiv = document.querySelector('#appeal-list');
const furnitureDiv = document.querySelector('#furniture-list');
const cosmeticDiv = document.querySelector('#cosmetic-list');
const searchProduct = document.querySelector('#search');
const mainPageConatinerDiv = document.querySelector('#main-page-container');
const productCategory = window.location.href.slice(window.location.href.lastIndexOf("#") + 1, window.location.href.length);

let newProductId = null;
let productCount = 0;
const appealList = [];
const cosmeticList = [];
const kitchenList = [];
const furnitureList = [];
const productList = [];


//search function
searchProduct.addEventListener('submit', (e) => {
    e.preventDefault();



    let keyWord = searchProduct['inline'].value;
    console.log(keyWord);

    if (keyWord) {
        mainPageConatinerDiv.innerHTML = null;

        let resultList = fuzzySearch(productList, keyWord);
        resultList.forEach(doc => {

            let bidEnd = document.createElement('p');

            let startTime = new Date();
            let endTime = new Date(doc.data() && doc.data().bid_end_time && doc.data().bid_end_time.toDate());
            let timeLeft = (endTime.getTime() - startTime.getTime());
            let diff = timeLeft / (1000 * 3600 * 24);
            let dayleft = calculateDaysLeft(diff);
            let hourleft = calculateHoursLeft(diff - dayleft);
            let end = dayleft + " days and " + hourleft + " hours left";
            bidEnd.textContent = end;

            let productName = document.createElement('h4');
            let description = document.createElement('p');
            let quantity = document.createElement('p');
            let currentPrice = document.createElement('p');
            let buyNowPrice = document.createElement('p');

            productName.textContent = doc.data().product_name;
            description.textContent = "Description: " + doc.data().product_description;
            quantity.textContent = "Quantity: " + doc.data().product_quantity;
            currentPrice.textContent = "Current Bid: $" + doc.data().current_price;
            buyNowPrice.textContent = "Buy It Now Price: $" + doc.data().product_buy_now_price;
            link = "productdetails.html#" + doc.id;

            //product image
            let productImg = document.createElement('img');
            productImg.setAttribute('style', "width: 100%; max-wdith:300px;");
            productImg.textContent = doc.data().pruduct_picture_link;
            productImg.setAttribute('src', productImg.textContent)


            let row = document.createElement('div');
            row.setAttribute('class', 'row');
            let imageList = document.createElement('div');
            imageList.setAttribute('class', "col s3 m3");

            let detailList = document.createElement('div');
            detailList.setAttribute('class', "col s7 m6");
            // detailList.setAttribute('style', "border-style: solid; border-color: coral;");

            imageList.setAttribute('onclick', "location.href ='" + link + "'");
            imageList.appendChild(productImg);
            detailList.appendChild(productName);
            detailList.appendChild(description);
            detailList.appendChild(quantity);
            detailList.appendChild(currentPrice);
            detailList.appendChild(buyNowPrice);
            detailList.appendChild(bidEnd);
            row.appendChild(imageList);
            row.appendChild(detailList);

            mainPageConatinerDiv.appendChild(row);

        });
    }



});

//search functions https://blog.csdn.net/Chengbin_Huang/article/details/84139425

function fuzzySearch(list, keyWord) {
    var reg = new RegExp(keyWord, 'i');
    // console.log("Ignore Case:? " + reg.ignoreCase);
    var arr = [];
    for (var i = 0; i < list.length; i++) {
        if (reg.test(list[i].data().product_name)) {
            arr.push(list[i]);
        }
    }
    return arr;
}


//function to init new product in the database and create a new product ID
function addNewProduct() {
    auth.onAuthStateChanged(user => {
        if (user) {
            db.collection('product').add({
                    product_name: "",
                    seller: user.uid,
                    product_category: "",
                    description: "",
                    quantity: "",
                    start_price: "",
                    buy_now_price: ""
                })
                .then(function(docRef) {
                    console.log(user.uid);
                    db.collection('users').doc(user.uid).collection("SellingHistory").doc(docRef.id).set({
                            product_name: "",
                            seller: user.uid,
                            product_category: "",
                            description: "",
                            quantity: "",
                            start_price: "",
                            buy_now_price: ""
                        })
                        //redirect to the new product page
                    window.location.href = "newproduct.html#" + docRef.id;
                })
        }
    });

}

window.onload = (event) => {

    db.collection('product').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {

            const productList = document.querySelector('#product-list');
            let category = doc.data().product_category;

            let currentPrice = doc.data().current_price;
            let buyNowPrice = doc.data().product_buy_now_price;

            let startTime = new Date();
            let endtime = new Date(doc.data() && doc.data().bid_end_time && doc.data().bid_end_time.toDate());
            let timeLeft = (endtime.getTime() - startTime.getTime());
            let diff = timeLeft / (1000 * 3600 * 24);
            let dayleft = calculateDaysLeft(diff);
            let hourleft = calculateHoursLeft(diff - dayleft);

            gridItemNo = 1;
            if (category == productCategory && (currentPrice != buyNowPrice) && (dayleft > 0 || hourleft > 0)) {
                let list = document.createElement('div');
                list.classList.add("item" + gridItemNo);
                gridItemNo =+ 1;

                let productImg = document.createElement('img');
                productImg.setAttribute('style', "width:300px; height:300px");

                let productName = document.createElement('b');
                productName.textContent = doc.data().product_name;

                productImg.textContent = doc.data().pruduct_picture_link;
                productImg.setAttribute('src', productImg.textContent)

                list.appendChild(productImg);
                list.appendChild(productName)

                productList.appendChild(list);
            }
            
        })
    })



}


//calculate days left
function calculateDaysLeft(time) {
    time = time.toString();
    time = time.slice(0, time.lastIndexOf('.'));
    return Number(time);
}

//calculate hours left
function calculateHoursLeft(time) {
    time = time * 24;
    time = time.toString();
    time = time.slice(0, time.lastIndexOf('.'));
    return Number(time);
}


const setupUI = (user) => {
    if (user) {
        //account info
        db.collection('users').doc(user.uid).get().then(doc => {


            var html = `
            <div>Email: ${user.email}</div>
            <div>Name: ${doc.data().name}</div>
            <div type="date">Date of Birth: ${new Date(doc.data().dob).toLocaleDateString()}</div>
            <div>Phone Number: ${doc.data().phone}</div>
            <br />
            <a class="waves-effect waves-light btn-large" href="account.html" style="width:250px; margin-bottom:5px;">Update User Information</a>
            <br />

            <a class="waves-effect waves-light btn-large" style="width:250px; margin-bottom:5px;" onclick="addNewProduct()">Sell a New Product</a>

            <br>

            <a class="waves-effect waves-light btn-large" style="width:250px; margin-bottom:5px;" href="sellinghistory.html">Selling History</a>

            <br>

            <a class="waves-effect waves-light btn-large" style="width:250px; margin-bottom:5px;" href="biddinghistory.html">Bidding History</a>

            <br>
            
            <a class="modal-close waves-light btn-large " style="width:250px; margin-bottom:5px;">CANCEL</a>
            `;
            accountDetails.innerHTML = html;

        })

        //toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');

    } else {
        //hide account info
        accountDetails.innerHTML = '';

        //toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
}






// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

});

//calculate days left
function calculateDaysLeft(time) {
    time = time.toString();
    time = time.slice(0, time.lastIndexOf('.'));
    return Number(time);
}

//calculate hours left
function calculateHoursLeft(time) {
    time = time * 24;
    time = time.toString();
    time = time.slice(0, time.lastIndexOf('.'));
    return Number(time);
}