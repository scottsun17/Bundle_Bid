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


//function to read products in the database to display
function renderProduct(doc) {

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
    productName.textContent = doc.data().product_name;

    if (productCount % 3 == 0) {
        let row = document.createElement('div');
        row.setAttribute('class', "row");
        productList.appendChild(row);
        productCount += 1;

    }

    gridItemNo = 1;


    let list = document.createElement('div');
    list.classList.add("item" + gridItemNo);
    list.setAttribute('class', "col s1");
    gridItemNo = +1;

    let productImg = document.createElement('img');
    productImg.setAttribute('style', "width: 300px; height: 300px;");


    //let productName = document.createElement('h3');
    let description = document.createElement('p');
    let quantity = document.createElement('p');
    let currentPrice = document.createElement('p');

    list.setAttribute('data-id', doc.id);
    productImg.textContent = doc.data().pruduct_picture_link;
    //productName.textContent = doc.data().product_name;
    description.textContent = "Description: " + doc.data().product_description;
    quantity.textContent = "Quantity: " + doc.data().product_quantity;
    currentPrice.textContent = "Current Bid: $" + doc.data().current_price;

    link = "productdetails.html#" + doc.id;
    list.setAttribute('onclick', "location.href ='" + link + "'")

    productImg.setAttribute('src', productImg.textContent)

    list.appendChild(productImg);
    list.appendChild(productName);
    list.appendChild(description);
    list.appendChild(quantity);
    list.appendChild(currentPrice);
    list.appendChild(bidEnd);

    productList.appendChild(list);

}

db.collection('product').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {

        if (doc.data().product_buy_now_price) {
            currentPrice = doc.data().current_price;
            maxPrice = doc.data().product_buy_now_price;

            let startTime = new Date();
            let endtime = new Date(doc.data().bid_end_time.toDate());
            let timeLeft = (endtime.getTime() - startTime.getTime());
            let diff = timeLeft / (1000 * 3600 * 24);
            let dayleft = calculateDaysLeft(diff);
            let hourleft = calculateHoursLeft(diff - dayleft);

            if (currentPrice != maxPrice && (dayleft > 0 || hourleft > 0)) {
                productList.push(doc);
                if (doc.data().product_category == 'appeal') {
                    appealList.push(doc);

                } else if (doc.data().product_category == 'cosmetic') {
                    cosmeticList.push(doc);

                } else if (doc.data().product_category == 'kitchen') {
                    kitchenList.push(doc);

                } else if (doc.data().product_category == 'furniture') {
                    furnitureList.push(doc);
                }
            }
        }
    })
}).then(() => {


    furnitureList.slice(0, 8).forEach(product => {
        let productImg = document.createElement('img');
        link = "https://bundlebid.web.app/productdetails.html#" + product.id;

        productImg.setAttribute('style', "width:300px; height:300px; display:inline-block;overflow:hidden; margin-top: 20px;");
        productImg.textContent = product.data().pruduct_picture_link;
        productImg.setAttribute('src', productImg.textContent);
        // productImg.setAttribute('onclick', "location.href ='" + link + "'");
        let jumpLink = document.createElement('a');
        jumpLink.setAttribute('href', link);
        jumpLink.appendChild(productImg);

        furnitureDiv.appendChild(jumpLink);
    });

    kitchenList.slice(0, 8).forEach(product => {

        let productImg = document.createElement('img');
        link = "https://bundlebid.web.app/productdetails.html#" + product.id;

        productImg.setAttribute('style', "width:300px; height:300px; display:inline-block;overflow:hidden; margin-top: 20px;");
        productImg.textContent = product.data().pruduct_picture_link;
        productImg.setAttribute('src', productImg.textContent);
        // productImg.setAttribute('onclick', "location.href ='" + link + "'");

        let jumpLink = document.createElement('a');
        jumpLink.setAttribute('href', link);
        jumpLink.appendChild(productImg);

        kitchenDiv.appendChild(jumpLink);
    });

    appealList.slice(0, 8).forEach(product => {

        let productImg = document.createElement('img');
        link = "https://bundlebid.web.app/productdetails.html#" + product.id;

        productImg.setAttribute('style', "width:300px; height:300px; display:inline-block;overflow:hidden; margin-top: 20px;");
        productImg.textContent = product.data().pruduct_picture_link;
        productImg.setAttribute('src', productImg.textContent);
        // productImg.setAttribute('onclick', "location.href ='" + link + "'");\

        let jumpLink = document.createElement('a');
        jumpLink.setAttribute('href', link);
        jumpLink.appendChild(productImg);

        appealDiv.appendChild(jumpLink);
    });

    cosmeticList.slice(0, 8).forEach(product => {

        let productImg = document.createElement('img');
        link = "https://bundlebid.web.app/productdetails.html#" + product.id;

        productImg.setAttribute('style', "width:300px; height:300px; display:inline-block;overflow:hidden; margin-top: 20px;");
        productImg.textContent = product.data().pruduct_picture_link;
        productImg.setAttribute('src', productImg.textContent);
        // productImg.setAttribute('onclick', "location.href ='" + link + "'");

        let jumpLink = document.createElement('a');
        jumpLink.setAttribute('href', link);
        jumpLink.appendChild(productImg);

        cosmeticDiv.appendChild(jumpLink);
    });

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