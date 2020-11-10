const newProductImgFile = document.getElementById("product-img-file");
const newProductImgDisplay = document.getElementById("myimg");

const addProductForm = document.querySelector('#add-product-form');
const storage = firebase.storage();
const storageRef = storage.ref();

var userinfo = null;
var filename = null;
var productId = null;
var finalImgUrl = null;
const uploader = document.getElementById("uploader");
const productPicUpload = document.getElementById("product-img-file");


//This function handles updating product picture to the firebase storage, creating img URL, loading the pciture to the page, handling progress bar, add img URL to the input file(the filed is under display:none and the img url will be saved into database)
productPicUpload.addEventListener("change", function(e) {
    //get file
    var file = e.target.files[0];
    //create storage reference
    filename = Date.now() + file.name;
    var imgRef = storage.ref("product_img/" + userinfo.uid +"/" + filename);
    
    //upload file
    var task = imgRef.put(file);

    //update progress bar
    task.on('state_changed',
          function progress(snapshot){
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploader.value = percentage;
          },
          function error(err){
            consolee.log(err);
          },
          function complete(){
            var url = "https://firebasestorage.googleapis.com/v0/b/bundlebid.appspot.com/o/product_img%2F" + userinfo.uid + "%2F" + filename;
            
            $.getJSON(url, function(data) {
                url = url + "?alt=media&token=" + data.downloadTokens;
                //console.log(url);
                newProductImgDisplay.src = url; 
                document.getElementById('picture-link').value = url;
                //document.getElementById('productPictureAdded').src = url;
            });
          }
    )
});

//Listen for auth status changes and save user information to the constant userinfo
auth.onAuthStateChanged(user => {
    if (user) {
        userinfo = user;
    } else {
        document.getElementById("content-area").innerHTML=`
            <div> Please log in first</div>
        `;
    }
});

//Add product information to the product database
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    var startprice = parseFloat(addProductForm['product-start-price'].value);
    var buynowprice = parseFloat(addProductForm['product-buy-now-price'].value);
    if(buynowprice <= startprice){
        document.getElementById("product-buy-now-price").className = "validate invalid";
        return;
    }
    if(userinfo){
        var str = window.location.href;
        var start = str.lastIndexOf("#");
        productId = str.slice(start + 1, str.length);
        var category = getSelectedOption();
        
        var startDate = new Date();
        var endDate = new Date();
        endDate.setDate(startDate.getDate() + 30);



        db.collection('product').doc(productId).set({
            product_name : addProductForm['product-name'].value,
            pruduct_picture_link : addProductForm['picture-link'].value,
            product_description : addProductForm['product-description'].value,
            product_category : category,
            product_quantity : addProductForm['product-quantity'].value,
            product_start_price : addProductForm['product-start-price'].value,
            product_buy_now_price : addProductForm['product-buy-now-price'].value,
            product_seller : userinfo.uid,
            current_price : addProductForm['product-start-price'].value,

            bid_start_time : startDate,
            bid_end_time : endDate

        }).then(() => {
            //redirect to listing history page
            
            window.alert("Product Added!");
            window.location.href = "sellinghistory.html";
        })
    }
});

//init for the selection input in the add product form
$(document).ready(function(){
    $('select').formSelect();
});

//get the selected item from dorp down box
function getSelectedOption() { 
    selectElement = document.querySelector('#product-category'); 
    return selectElement.value;
} 


