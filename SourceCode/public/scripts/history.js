const sellingHistory = document.querySelector('.selling-history-list');
const biddingHistory = document.querySelector('.bidding-history-list');
const currentLocation = window.location.href.slice(window.location.href.lastIndexOf('/') + 1, window.location.href.lastIndexOf('.'));


//display bidding history information here
const displayBiddingHistory = (user) => {
    if (user) {
        db.collection('users').doc(user.uid).collection('PurchaseHistory').get().then(function(querySnapshot) {
            querySnapshot.forEach(function(product) {
                db.collection('product').doc(product.id).get().then(doc => {

                    if (doc.data().product_name) {
                        let userBid = -1;
                        let statusGood = "Winning Bid";
                        let statusBad = "Out Bidded";
                        let statusWin = "It is yours!"
                        let status = "";
                        db.collection('users').doc(user.uid).collection('PurchaseHistory').doc(product.id).get().then(userdoc => {
                            userBid = userdoc.data().current_price;
                            uid = userdoc.uid;
                            buyerId = doc.data().last_bidder;
                            maxPrice = doc.data().product_buy_now_price;

                            if (userBid == doc.data().current_price) {

                                status = statusGood
                            } else {

                                status = statusBad;
                            }
                            console.log(userBid);
                            if (uid == buyerId && maxPrice == userBid) {
                                status = statusWin;
                            }

                        }).then(() => {
                            let startTime = new Date();
                            let endtime = new Date(doc.data().bid_end_time.toDate());

                            let timeLeft = (endtime.getTime() - startTime.getTime());
                            let diff = timeLeft / (1000 * 3600 * 24);

                            let dayleft = calculateDaysLeft(diff);
                            let hourleft = calculateHoursLeft(diff - dayleft);

                            let end = dayleft + " days and " + hourleft + " hours left";

                            currentPrice = doc.data().current_price;
                            maxPrice = doc.data().product_buy_now_price;

                            if (currentPrice == maxPrice) {
                                end = "SOLD";
                            }


                            let day = endtime.getDay() - startTime.getDay();
                            let hour = endtime.getHours() - startTime.getHours();
                            let minutes = endtime.getMinutes() - startTime.getMinutes();
                            // console.log(endtime);
                            biddingHistory.innerHTML += `
                            
                            <tr>
                            <td><a href="productdetails.html#${product.id}">${doc.data().product_name}</a></td>
                                 <td>${doc.data().product_quantity}</td> 
                                <td>${doc.data().current_price}</td>
                                <td>${userBid}</td>
                                <td>${doc.data().product_buy_now_price}</td>
                                <td>${end}</td>
                                <td>${status}</td>
                            </tr>
      
                            `;

                        });







                    }
                })
            });


        }).catch(function(error) {
            console.log("Error getting documents: ", error);
        });



    } else {
        sellingHistory.innerHTML = `
        <div> Please log in first</div>
        `;
    }
}


//display selling history information here
const displaySellingHistory = (user) => {
    if (user) {


        db.collection('users').doc(user.uid).collection('SellingHistory').get().then(function(querySnapshot) {
            querySnapshot.forEach(function(product) {
                db.collection('product').doc(product.id).get().then(doc => {

                    if (doc.data().product_name) {

                        lastBidder = doc.data().last_bidder;
                        currentPrice = doc.data().current_price;
                        maxPrice = doc.data().product_buy_now_price;

                        if (!lastBidder) {
                            lastBidder = "No Bids";
                        } else {
                            lastBidder = "Yes";

                        }

                        let startTime = new Date();
                        let endtime = new Date(doc.data().bid_end_time.toDate());

                        let timeLeft = (endtime.getTime() - startTime.getTime());
                        let diff = timeLeft / (1000 * 3600 * 24);

                        let dayleft = calculateDaysLeft(diff);
                        let hourleft = calculateHoursLeft(diff - dayleft);

                        let end = dayleft + " days and " + hourleft + " hours left";
                        if (currentPrice == maxPrice) {
                            end = "SOLD";
                        }

                        console.log(end);
                        sellingHistory.innerHTML += `
                    <tr>
                        <!-- <td><a href="productdetails.html#${product.id}">${product.id}</a></td> -->
                        <td><a href="productdetails.html#${product.id}">${doc.data().product_name}</a></td>
                        <td>${doc.data().product_quantity}</td>
                        <td>${doc.data().product_start_price}</td>
                        <td>${doc.data().current_price}</td>
                        <td>${lastBidder}</td>
                        <td>${doc.data().product_buy_now_price}</td>
                        <td>${end}</td>
                        <td><button class="btn-small" onclick="modifyProduct('${product.id}')">Modify</button>  <button class="btn-small" onclick="deleteProduct('${product.id}', '${user.uid}')">Delete</button></td>
                    </tr>

                    `;

                    }


                }).then((doc) => {

                });
            });


        }).catch(function(error) {
            console.log("Error getting documents: ", error);
        });



    } else {
        sellingHistory.innerHTML = `
        <div> Please log in first</div>
        `;
    }
}


auth.onAuthStateChanged(user => {

    if (currentLocation == "biddinghistory") {

        displayBiddingHistory(user);
    } else {

        displaySellingHistory(user);
    }

});

//delete a listed product
function deleteProduct(productID, uid) {

    // console.log(productID);
    // console.log(uid);


    db.collection('users').doc(uid).collection('SellingHistory').doc(productID).delete().then(function() {
        // console.log("Product Delete in U DB");
    }).catch(function(error) {
        console.log("Error removing product in the user db:", error);
    }).then(function() {
        db.collection('product').doc(productID).delete().then(function() {
            // console.log("Product Delete in P DB");

        }).catch(function(error) {
            console.log("Error removing product in the product db:", error);
        });
    }).then(function() {
        window.location.reload();
    });
}

//Redirect to the modifying product page
function modifyProduct(productID) {
    window.location.href = "modifyproduct.html#" + productID;
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