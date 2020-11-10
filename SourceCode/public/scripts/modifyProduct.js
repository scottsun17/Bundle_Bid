var userinfo = null;
const productInfoForm = document.querySelector('#product-update-form');
const productId = window.location.href.slice(window.location.href.lastIndexOf("#") + 1, window.location.href.length);



//this function retrives data from db and display to the page
const modifyProductInfo = (user) => {
    if (user) {
        db.collection('product').doc(productId).get().then(doc => {
            //var product_category = document.getElementById('update-name');
            var product_name = document.getElementById('product-name');
            var product_description = document.getElementById('product-description');
            var product_quantity = document.getElementById('product-quantity');
            var product_start_price = document.getElementById('product-start-price');
            var product_buy_now_price = document.getElementById('product-buy-now-price');
            var product_img = document.getElementById('product-Img');

            product_name.value = doc.data().product_name;
            product_description.value = doc.data().product_description;
            product_quantity.value = doc.data().product_quantity;
            product_start_price.value = doc.data().product_start_price;
            product_buy_now_price.value = doc.data().product_buy_now_price;
            var url = doc.data().pruduct_picture_link;
            product_img.src = url;
            // console.log(product_img.src);
        })

    } else {
        accountInfo.innerHTML = `
    <div> Please log in first</div>
    `;

    }
}

//this function takes updated data from the form and update to the db
productInfoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    var startprice = parseFloat(productInfoForm['product-start-price'].value);
    var buynowprice = parseFloat(productInfoForm['product-buy-now-price'].value);
    var startDate = new Date();
    var endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);


    if (buynowprice <= startprice) {

        document.getElementById("product-buy-now-price").className = "validate invalid";
    } else {
        auth.onAuthStateChanged(user => {
            if (user) {
                db.collection('product').doc(productId).update({

                    product_name: productInfoForm['product-name'].value,
                    product_description: productInfoForm['product-description'].value,
                    product_quantity: productInfoForm['product-quantity'].value,
                    product_start_price: productInfoForm['product-start-price'].value,
                    product_buy_now_price: productInfoForm['product-buy-now-price'].value,
                    current_price : productInfoForm['product-start-price'].value,
                    bid_start_time : startDate,
                    bid_end_time : endDate

                }).then(function () {
                    window.location.href = "sellinghistory.html";
                })

            } else {
                updateAccountInfo();
            }
        });
    }




});




//Listen for auth status changes and save user information to the constant userinfo
auth.onAuthStateChanged(user => {
    if (user) {
        userinfo = user;
        modifyProductInfo(user);
    } else {
        document.getElementById("content-area").innerHTML = `
            <div> Please log in first</div>
        `;
    }
});
