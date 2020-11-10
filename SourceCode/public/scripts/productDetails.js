const productId = window.location.href.slice(window.location.href.lastIndexOf("#") + 1, window.location.href.length);
const submitBid = document.querySelector('#submit-bid-form');
let currentUser;
var startBiddingTime;
var endBiddingTime;
var product_curent_price;

function myFunction() {
    var startDate = new Date();
    var endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);



    document.getElementById("demo").innerHTML = "Start Date: " + startDate;
    document.getElementById("demo2").innerHTML = "End Date: " + endDate;
}


window.onload = (event) => {

    if (productId) {
        db.collection('product').doc(productId).get().then(doc => {
            if (doc.data()) {

                let currentPrice = doc.data().current_price;
                let buyNowPrice = doc.data().product_buy_now_price;

                if (currentPrice == buyNowPrice) {
                    document.getElementById('containerDIV').innerHTML = `
                    <H2>The product you are searching for is sold out</hr>
                  `;


                } else {

                    let startTime = new Date();
                    let endtime = new Date(doc.data().bid_end_time.toDate());

                    let timeLeft = (endtime.getTime() - startTime.getTime());
                    let diff = timeLeft / (1000 * 3600 * 24);

                    let dayleft = calculateDaysLeft(diff);
                    let hourleft = calculateHoursLeft(diff - dayleft);

                    let end = dayleft + " days and " + hourleft + " hours left";



                    var product_name = document.getElementById('product-name');
                    var product_description = document.getElementById('product-description');
                    var product_quantity = document.getElementById('product-quantity');
                    // var product_start_price = document.getElementById('product-start-price');
                    var product_buy_now_price = document.getElementById('product-buy-now-price');
                    product_curent_price = document.getElementById('current_price');
                    var product_img = document.getElementById('product-Img');
                    var time_left = document.getElementById("auction-time-left");
                    product_name.innerHTML = doc.data().product_name;

                    product_curent_price.innerHTML = doc.data().current_price;
                    product_description.innerHTML = doc.data().product_description;
                    product_quantity.innerHTML = doc.data().product_quantity;
                    //product_start_price.innerHTML = doc.data().product_start_price;
                    product_buy_now_price.innerHTML = doc.data().product_buy_now_price;

                    startBiddingTime = doc.data().bid_start_time;
                    endBiddingTime = doc.data().bid_end_time;
                    time_left.innerHTML = end;

                    var url = doc.data().pruduct_picture_link;
                    product_img.src = url;
                }



            } else {
                document.getElementById('containerDIV').innerHTML = `
                <H2>The product you are searching for is not found</hr>
                `;
            }
        })
    } else {

    }
}

submitBid.addEventListener('submit', (e) => {
    e.preventDefault();
    var submitedPrice = parseFloat(submitBid['make-a-bid'].value);
    var currPrice = parseFloat(product_curent_price.innerHTML);

    if (submitedPrice <= currPrice) {
        window.alert("You must submit a price higher than the current bid!");
    } else {
        auth.onAuthStateChanged(user => {
            if (user) {
                db.collection('product').doc(productId).update({

                    current_price: submitedPrice,
                    last_bidder: user.uid

                }).then(() => {
                    db.collection('users').doc(user.uid).collection('PurchaseHistory').doc(productId).set({
                        current_price: submitedPrice,
                        ending_bid_time: endBiddingTime
                    })
                }).then(() => {
                    window.alert("You have successfully submitted your bid!");
                    window.location.href = "biddinghistory.html";
                })


            } else {
                window.alert("Please log in first");
            }
        });



    }
});


function buyItNow() {

    if (productId) {
        let maxPrice = 0;
        db.collection('product').doc(productId).get().then(doc => {
            maxPrice = doc.data().product_buy_now_price;
        }).then(() => {
            db.collection('product').doc(productId).update({
                current_price: maxPrice,
                last_bidder: currentUser.uid
            }).then(() => {
                db.collection('users').doc(currentUser.uid).collection('PurchaseHistory').doc(productId).set({
                    current_price: maxPrice,
                    ending_bid_time: endBiddingTime

                }).then(() => {
                    window.alert("You have placed max Bid on this product! It is yours now!");
                    window.location.href = "biddinghistory.html";
                });
            })
        })




    } else {
        document.getElementById('containerDIV').innerHTML = `
        <H2>The product you are searching for is not found</hr>
      `;
    }
}

auth.onAuthStateChanged(user => {

    currentUser = user;
    // console.log(currentUser.uid);
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