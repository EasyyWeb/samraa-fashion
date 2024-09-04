/**
 * bundle.js
 * 
 * This file consolidates all JavaScript code for the website into a single bundle.
 * 
 * Objective:
 * - Improve load times by reducing the number of HTTP requests.
 * - Streamline script management with a single reference point.
 * 
 * Usage:
 * - Update or add functionality in the individual JavaScript files.
 * - Rebuild this bundle after changes to ensure the latest code is included.
 * 
 * Notes:
 * - Keep dependencies correctly ordered during the build process.
 * - Regularly review and optimize code for performance.
 * 
 * Author: Abdelrhman
 * Date:  Launched on Stardate 2024 
 */

// When using modules, functions and variables are not automatically made global
// so this is to Export and Access Function Globally
 window.sendOrderWhatsApp = sendOrderWhatsApp;
 window.removeFromCart = removeFromCart;
 window.addToCart = addToCart;


 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
 import { getDatabase, ref, child, get} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
 
 const firebaseConfig = {
  apiKey: "AIzaSyDP3eGeyB2GVnJkw0IK0aqcFWu2rB90fSI",
  authDomain: "samraa-fashion-3bf32.firebaseapp.com",
  databaseURL: "https://samraa-fashion-3bf32-default-rtdb.firebaseio.com",
  projectId: "samraa-fashion-3bf32",
  storageBucket: "samraa-fashion-3bf32.appspot.com",
  messagingSenderId: "365684307049",
  appId: "1:365684307049:web:a6c2b24697f894291bdef8",
  measurementId: "G-DNDG4BHW58"
 };
 
 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const db = getDatabase(app);
 
let productsArray = [];
let cart = [];


 async function loadProducts() {
     const dbRef = ref(db, 'products');
     try {
         const snapshot = await get(dbRef);
         if (snapshot.exists()) {
             console.log(snapshot.val().length);
             productsArray = snapshot.val() ? Object.values(snapshot.val()) : [];
         } else {
             console.log("No data available");
         }
     } catch (error) {
         console.error("Error loading products:", error);
     }
     initializePage();
 }
 
 
// Call functions to initialize data 
loadProducts();
loadCart();



function loadCart() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
        cart = JSON.parse(cartData);
    }
}

function initializePage() {
    const pageName = document.querySelector('meta[name="page-name"]').content;
    const pageFunctions = {
        'Home': Home,
        'Product-details': Productdetails,
        'Cart': Cart,
        'All':All
    };
    const pageFunction = pageFunctions[pageName];
    if (pageFunction) {
        pageFunction();
    }
}

// Call methods 
function Home() {
  //display the last 5 items
  const latestProducts = productsArray.reverse().slice(-5);
  
  displayProducts(latestProducts);
}

function Productdetails() {
    console.log(productsArray.length);
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    displaySingleProduct(findItemById(id, productsArray));
}

function Cart() {
    CreateCart();
}

function All(){
  filterAndDisplayProducts();
}

//Initializes common functionalities across all website pages.
// #region Product Card
// Creates a product card element and populates it with product information.
// This method is used to generate a card for displaying product details on
//the home page as well as related products on the product details page.

function createProductCard(product) {
    return `
        <div class="card">
            <div class="child-card">
                <a href="productDetails.html?id=${product.Id}" class="img-link">
                    <img src="${product.ImagePath1}" alt="${product.Name} id="product-image"">
                </a>
                <a href="productDetails.html?id=${product.Id}">
                    <h3  id="product-name">${product.Name}</h3>
                </a>
                <p class="price" id="product-price">${product.Price} ج.م</p>
                <p class="end-card">
                    <button onclick="addToCart(${product.Id})">
                        <svg class="cart-left" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            fill="currentColor" viewBox="0 0 16 16">
                            <path
                                d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0" />
                        </svg>
                        <span>أضف الي السلة</span>
                    </button>
                    <!--Heart-->
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="heart">
                        <path
                            d="M12 5.50063L11.4596 6.02073C11.463 6.02421 11.4664 6.02765 11.4698 6.03106L12 5.50063ZM8.96173 18.9109L8.49742 19.4999L8.96173 18.9109ZM15.0383 18.9109L14.574 18.3219L15.0383 18.9109ZM7.00061 16.4209C6.68078 16.1577 6.20813 16.2036 5.94491 16.5234C5.68169 16.8432 5.72758 17.3159 6.04741 17.5791L7.00061 16.4209ZM2.34199 13.4115C2.54074 13.7749 2.99647 13.9084 3.35988 13.7096C3.7233 13.5108 3.85677 13.0551 3.65801 12.6917L2.34199 13.4115ZM13.4698 8.03034C13.7627 8.32318 14.2376 8.32309 14.5304 8.03014C14.8233 7.7372 14.8232 7.26232 14.5302 6.96948L13.4698 8.03034ZM2.75 9.1371C2.75 6.98623 3.96537 5.18252 5.62436 4.42419C7.23607 3.68748 9.40166 3.88258 11.4596 6.02073L12.5404 4.98053C10.0985 2.44352 7.26409 2.02539 5.00076 3.05996C2.78471 4.07292 1.25 6.42503 1.25 9.1371H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55955 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.1371H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.1371C22.75 6.42503 21.2153 4.07292 18.9992 3.05996C16.7359 2.02539 13.9015 2.44352 11.4596 4.98053L12.5404 6.02073C14.5983 3.88258 16.7639 3.68748 18.3756 4.42419C20.0346 5.18252 21.25 6.98623 21.25 9.1371H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219ZM9.42605 18.3219C8.63014 17.6945 7.82129 17.0963 7.00061 16.4209L6.04741 17.5791C6.87768 18.2624 7.75472 18.9144 8.49742 19.4999L9.42605 18.3219ZM3.65801 12.6917C3.0968 11.6656 2.75 10.5033 2.75 9.1371H1.25C1.25 10.7746 1.66995 12.1827 2.34199 13.4115L3.65801 12.6917ZM11.4698 6.03106L13.4698 8.03034L14.5302 6.96948L12.5302 4.97021L11.4698 6.03106Z"
                            fill="#56b0f2" />
                    </svg>

                    <!--Quick View-->
                    <svg fill="#000000" viewBox="-3.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"
                        class="show-svg">
                        <title>view</title>
                        <path
                            d="M12.406 13.844c1.188 0 2.156 0.969 2.156 2.156s-0.969 2.125-2.156 2.125-2.125-0.938-2.125-2.125 0.938-2.156 2.125-2.156zM12.406 8.531c7.063 0 12.156 6.625 12.156 6.625 0.344 0.438 0.344 1.219 0 1.656 0 0-5.094 6.625-12.156 6.625s-12.156-6.625-12.156-6.625c-0.344-0.438-0.344-1.219 0-1.656 0 0 5.094-6.625 12.156-6.625zM12.406 21.344c2.938 0 5.344-2.406 5.344-5.344s-2.406-5.344-5.344-5.344-5.344 2.406-5.344 5.344 2.406 5.344 5.344 5.344z">
                        </path>
                    </svg>
                </p>
            </div>
        </div>
    `;
}

function displayProducts(products) {
    const productsArea = document.querySelector('.products-area');
    productsArea.innerHTML = products.map(product => createProductCard(product)).join('');
}
// #endregion
//#region Selected
function filterAndDisplayProducts() {
  const selectedOption = document.getElementById('productSelector').value;

  let filteredProducts = [];

  if (selectedOption === 'second') {
    console.log('latest');
      filteredProducts = productsArray.slice(-5); // Last 5 items
      
  } else if (selectedOption === 'first') {
    console.log('dndn');
      filteredProducts = productsArray.filter(product => product.bestSeller);
  }
  filteredProducts.reverse();
  displayProducts(filteredProducts);
}


// Initial display of latest products
//filterAndDisplayProducts();
//#endregion
// #region addToCart
// Adds the specified product to the shopping cart.
// The method is used on both the home page and the product details page to allow users to add products to their cart from either page.
function addToCart(id) {

    // Find the product with the given id in the jsonProducts array
    let product = productsArray.find(item => item.Id == id);

    // Check if the product was found
    if (product) {
        // Extract product details
        let Id = product.Id;
        let ImagePath1 = product.ImagePath1;
        let Name = product.Name;
        let Price = product.Price;

        // Check if the product is already in the cart
        let cartProduct = cart.find(item => item.Id == Id);

        if (cartProduct) {
            // If the product is already in the cart, increment the quantity
            cartProduct.quantity++;
        } else {
            // If the product is not in the cart, add it with quantity 1
            let quantity = 1;
            const productViewModel = { Id, ImagePath1, Name, Price, quantity };
            cart.push(productViewModel);
        }

        // Save the updated cart array back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        successNotify();
    } else {
        console.error(`Product with Id ${id} not found.`);
    }
}
// #endregion

// #region remove
// Removes an item from a specified list based on its ID.
function remove(id, list) {
    list = list.filter(item => item.Id != id);
    return list;
}
//#endregion

// #region findItemById
// Finds and returns an item from a list based on its ID.

function findItemById(id, list) {
    return list.find(item => item.Id == id);
}

// #region initialize Productdetails page
// Initializes the product details page by fetching and displaying product information.
function displaySingleProduct(product) {
    if (product) {
        // Image in large size 
        document.getElementById('featured-image').src = `${product.ImagePath1}`;

        // Images in small size
        const smallImagesContainer = document.querySelector('.small-Card');

        // Clear any existing small images
        smallImagesContainer.innerHTML = '';

        // Array of small image paths
        const smallImagePaths = [
            product.ImagePath1,
            product.ImagePath2,
            product.ImagePath3,
            product.ImagePath4
        ];

        // Iterate over small image paths and add non-null images
        smallImagePaths.forEach(imagePath => {
            if (imagePath) { // Check if imagePath is not null or undefined
                const imgElement = document.createElement('img');
                imgElement.src = `${imagePath}`;
                imgElement.alt = 'image not found';
                imgElement.className = 'small-Img';
                smallImagesContainer.appendChild(imgElement);
            }
        });

        // Get references to the small images
        let smallImgs = document.getElementsByClassName('small-Img');

        // Function to handle click events on small images
        function handleSmallImgClick(event) {
            // Update the featured image source
            document.getElementById('featured-image').src = event.target.src;

            // Remove the 'sm-card' class from all small images
            for (let img of smallImgs) {
                img.classList.remove('sm-card');
            }

            // Add the 'sm-card' class to the clicked small image
            event.target.classList.add('sm-card');
        }

        // Add click event listeners to all small images
        for (let img of smallImgs) {
            img.addEventListener('click', handleSmallImgClick);
        }

        // product name and price 
        document.querySelector('.product-info h3').textContent = product.Name;
        document.querySelector('.product-info h5').innerHTML = `${product.Price} ج.م`;
        // First and second description 
        document.querySelector('.product-info p.description-main').textContent = product.Description;
        displayDescriptions(product.Description2);


        let matchedRelated = [];
        for (let i = 0; i < product.relatedproducts.length; i++) { // length = n
            for (let j = 0; j < productsArray.length; j++) { // length = n+1
                if (product.relatedproducts[i] == productsArray[j].Id) {
                    matchedRelated.push(productsArray[j])
                    break;
                }
            }
        }
        displayProducts(matchedRelated);
        // Create the quantity div and its contents
        const quantityDiv = document.createElement('div');
        quantityDiv.className = 'quantity';

        const inputElement = document.createElement('input');
        inputElement.type = 'number';
        inputElement.value = 1;
        inputElement.min = 1;

        const buttonElement = document.createElement('button');
        buttonElement.textContent = 'اضف الي العربة';
        buttonElement.setAttribute('onclick', `addToCart(${product.Id})`);

        quantityDiv.appendChild(inputElement);
        quantityDiv.appendChild(buttonElement);

        // Append the quantity div to wherever you want it in the document
        // For example, assuming there's a container with class 'product-info'
        document.querySelector('.product-info').appendChild(quantityDiv);

    } else {
        document.querySelector('.product-container').textContent = 'Product not found';
    }
}
//#endregion

// #region displayDescriptionWithPoints
// Displays a formatted description on the product details page.
function displayDescriptions(descriptions) {
  const container = document.getElementById('description-container');
  if (container) {
      container.innerHTML = ''; // Clear existing descriptions
      descriptions.forEach(descriptionObj => {
          const p = document.createElement('p');
          const span = document.createElement('span');
          const dotDiv = document.createElement('div');
          dotDiv.className = 'dot';
          const textNode = document.createTextNode(descriptionObj.phrase);
          span.appendChild(dotDiv);
          span.appendChild(textNode);
          p.appendChild(span);
          container.appendChild(p);
      });
  }
}

//#endregion

// #region initialize Cart page
// display Cart 
function CreateCart() {
    const cartTable = document.getElementById('cart-table');
    const totalPriceElement = document.getElementById('total-price');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const totalpricediv = document.getElementById('totalprice-hide');
    const orderbtn = document.getElementById('orderbtn');
    let totalPrice = 0;


    if (cart.length === 0) {
        emptyCartMessage.style.display = 'flex'; // Show empty cart message
        cartTable.style.display = 'none';
        totalpricediv.style.display = 'none';
        orderbtn.style.display = 'none';

    } else {
        // Clear any existing content
        cartTable.innerHTML = `
    <tr>
        <th>العنصر</th>
        <th>الكمية</th>
        <th>السعر الكلي</th>
    </tr>
`;
        cart.forEach(product => {
            const totalProductPrice = product.Price * product.quantity;
            totalPrice += totalProductPrice;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                  <div class="cart-info">
                    <img src="${product.ImagePath1}" alt="Product Image">
                    <div>
                      <p>${product.Name}</p>
                      <small>السعر: ${product.Price}ج.م</small>
                      <br>
                      <a href="#" onclick="removeFromCart('${product.Id}')">حذف</a>
                    </div>
                  </div>
                </td>
                <td><input type="number" value="${product.quantity}" min="1" onchange="updateQuantity('${product.Id}', this.value)"></td>
                <td id="product-total-${product.Id}">$${totalProductPrice}</td>
            `;

            cartTable.appendChild(row);
        });

        totalPriceElement.innerText = `$${totalPrice}`;
    }
}


//updateQuantity 
function updateQuantity(productId, newQuantity) {
    // Update the quantity for the specified product
    const product = cart.find(item => item.Id == productId);
    if (product) {
        product.quantity = parseInt(newQuantity);
    }

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Recalculate the total product price and update the DOM
    const totalProductPrice = product.Price * product.quantity;
    document.getElementById(`product-total-${productId}`).innerText = `$${totalProductPrice}`;

    // Recalculate the total cart price
    let totalPrice = 0;
    cart.forEach(item => {
        totalPrice += item.Price * item.quantity;
    });
    document.getElementById('total-price').innerText = `$${totalPrice}`;
}

// Remove from cart 
function removeFromCart(id) {
    localStorage.setItem('cart', JSON.stringify(remove(id, cart)));
    location.reload();
}

// send Order via whatsApp
function sendOrderWhatsApp() {
    let message = "Order Summary:\n\n";
    cart.forEach(product => {
        message += `${product.Name} -- Quantity:{ ${product.quantity} }\n`;
    });
    message += `\nTotal Price: $${document.getElementById('total-price').innerText}`;

    // Replace spaces and line breaks with URL-encoded equivalents
    message = encodeURIComponent(message);

    // Replace with your WhatsApp number
    const phoneNumber = "+201204448660";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    // Open WhatsApp with the message
    window.open(whatsappUrl, '_blank');
    localStorage.removeItem('cart');
}
//#endregion

function createFooter(){
    const footer = document.createElement('footer');
    footer.innerHTML = `<div class="row">
    <div class="col">
      <img src="images/Untitled.pdf4 (2)-1.png" class="logo-footer" style="border-radius: 50%;">
      <p class="portfolio-p">
     
أهلاً بكم عملاءنا الكرام، يسعدنا أن نقدم لكم أرقى الموديلات الراقية والمحتشمة بجودة عالية وأفضل الأسعار. مع سمراء، تميزي بأناقتك وتألقك في جميع مناسباتك. شكراً لثقتكم بنا ونتمنى لكم تجربة تسوق رائعة ومميزة.
      🤍
      </p>
    </div>
    <div class="col">
      <h3>location <div class="underline"><span></span></div></h3>
      <p><i class="fa-solid fa-location-dot" style="margin-left:10px"></i>Cairo, Egypt</p>
      <p class="email-id"> <i class="fa-solid fa-envelope" style="margin-left:10px"></i>easyweb@gmail.com</p>
      <h4 class="phone-number"> <i class="fa-solid fa-phone" style="margin-left:10px">
      </i>+2 01204448660</h4>
    </div>
    <div class="col">
      <h3>الصفحات <div class="underline"><span></span></div></h3>
      <ul>
        <li class="footer-li"><a href="index.html" class="footer-li-a">الرئيسية</a></li>
        <li class="footer-li"><a href="cart.html" class="footer-li-a">عربة التسوق</a></li>
        <li class="footer-li"><a href="https://www.facebook.com/profile.php?id=61564011337948" class="footer-li-a">من نحن</a></li>
        <li class="footer-li"><a href="" class="footer-li-a">تواصل</a></li>
      </ul>
    </div>
    <div class="col">
      <h3>موقع المكتب <div class="underline"><span></span></div></h3>
      <div class="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.9234923116764!2d-122.08424968469447!3d37.422065679825115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb24d8a3d5a39%3A0x57a0c7b39df3c0a9!2sGoogleplex!5e0!3m2!1sen!2sus!4v1622569625971!5m2!1sen!2sus"
          
          height="200"
          style="border:0; border-radius: 4%; box-shadow: 0 0 10px 5px rgb(255 241 241 / 75%); margin-bottom: 20px;"
          allowfullscreen=""
          loading="lazy"></iframe>
      </div>
      <div class="footer-social-icons" style="width:110%">
        <a href="https://www.facebook.com/profile.php?id=100066471291451"><i class="fab fa-facebook-f"></i></a>
        <i class="fab fa-whatsapp"></i>
        <a href="https://www.instagram.com/fatmaabd689?igsh=MTlxZXhydG8wajJkaQ%3D%3D&utm_source=qr"><i class="fab fa-instagram"></i></a>
        <a href="https://www.tiktok.com/@samrafashion?_t=8pQyZAZCovk&_r=1"><i class="fab fa-tiktok"></i></a>
      </div>
    </div>
  </div>
  <hr class="footer-hr">
  <p class="copyright"><a href="https://www.facebook.com/profile.php?id=61564348695353">EasyWeb </a> All rights reserved © </p>`;
  document.body.appendChild(footer);
}
createFooter();

// Notification 
function successNotify(){
    Command: toastr["success"]("تم اضافة العنصر الي السلة")

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "2000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}
}


//#region Create Header 
document.addEventListener('DOMContentLoaded', function() {
    const headerHTML = `
      <header>
        <div class="navbar">
          <div class="logo"><a href="index.html">Samra'a Fashion</a></div>
          <ul class="links">
            <li><a href="index.html">الرئيسيه</a></li>
            <li><a href="about">الاكثر مبيعا</a></li>
            <li><a href="productDetails.html">احدث الاضافات</a></li>
            <li><a href="contact">من نحن</a></li>
          </ul>
          <a href="cart.html" class="action_btn">اتصل</a>
          <div class="quick-links">
            <a href="#">
              <i class="fas fa-search" style="margin-left: 15px;" id="search-icon"></i>
            </a>
            <input type="text" id="search-input" placeholder="...Search by name" style="display: none; margin-left: 15px;">
            <a href="cart.html">
              <i class="fa-solid fa-cart-shopping" style="margin-left: 15px;"></i>
            </a>
            <div class="toggle_btn">
              <i class="fa-solid fa-bars"></i>
            </div>
          </div>
        </div>
        <div class="dropdown_menu">
          <li><a href="index.html">الرئيسيه</a></li>
          <li><a href="about">الاكثر مبيعا</a></li>
          <li><a href="productDetails.html">احدث الاضافات</a></li>
          <li><a href="contact">من نحن</a></li>
          <a href="cart.html" class="action_btn">اتصل</a>
        </div>
      </header>
      <div id="search-results" class="search-results"></div>
    `;
  
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
  
    // DROPDOWN LIST 
    const toggleBtn = document.querySelector('.toggle_btn');
    const toggleBtnIcon = document.querySelector('.toggle_btn i');
    const dropDownMenu = document.querySelector('.dropdown_menu');
  
    toggleBtn.onclick = function () {
      dropDownMenu.classList.toggle('open');
  
      // change the menu icon to X mark
      const isOpen = dropDownMenu.classList.contains('open');
      toggleBtnIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    };
  
    //#region Search 
    document.getElementById('search-icon').addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default action of the anchor tag
      const searchInput = document.getElementById('search-input');
      const navbar = document.querySelector('.navbar');
    
      if (!navbar.classList.contains('search-active')) {
        navbar.classList.add('search-active');
        searchInput.style.display = 'inline-block';
        searchInput.focus(); // Focus on the input field
      } else {
        navbar.classList.remove('search-active');
        searchInput.style.display = 'none';
        document.getElementById('search-results').style.display = 'none';
      }
    });
  
    document.getElementById('search-input').addEventListener('input', function() {
      const query = this.value.toLowerCase(); // Works for English, may not be needed for Arabic
      const results = searchDocuments(query);
      displayResults(results);
    });
  
    document.addEventListener('click', function(event) {
      const searchInput = document.getElementById('search-input');
      const searchResults = document.getElementById('search-results');
      const navbar = document.querySelector('.navbar');
  
      if (!searchResults.contains(event.target) && !searchInput.contains(event.target) && !event.target.matches('#search-icon')) {
        navbar.classList.remove('search-active');
        searchInput.style.display = 'none';
        searchResults.style.display = 'none';
      }
    });
  
    function searchDocuments(query) {
      return productsArray.filter(doc => doc.Name.includes(query)); // Direct string comparison
    }
  
    function displayResults(results) {
      const resultsContainer = document.getElementById('search-results');
      resultsContainer.innerHTML = '';
  
      if (results.length === 0) {
        resultsContainer.innerHTML = '<p>لم يتم العثور علي عناصر مماثلة.</p>';
        resultsContainer.style.display = 'block';
        return;
      }
  
      results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `
          <a href="productDetails.html?id=${result.Id}">
            <img src="${result.ImagePath1}" alt="خطأ في تحميل الصورة">
            <h3>${result.Name}</h3>
            <p>${result.Price}</p>
          </a>
        `;
        resultsContainer.appendChild(resultItem);
      });
  
      resultsContainer.style.display = 'block';
    }
    //#endregion
  });

//#endregion  

// i have to allocate this code at the bottom of page so it doesn't make problems if there is no select list like if we are in the cart page 
document.getElementById('productSelector').addEventListener('change', filterAndDisplayProducts);


