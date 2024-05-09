import {cart, removeFromCart} from '../data/cart.js';//(Named exports)
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'; //don't use squiggly brackets around dayjs (default exports)
import {deliveryOpts} from '../data/deliveryOpt.js';

/*const today = dayjs();
const dldate = today.add(7, 'days');//parm1 - time+ parm2 - ln_time+
console.log(dldate.format('dddd, MMMM D')); //easy to read date*/

let cartSummaryHTML = '';
let matchingProduct;

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
    //console.log(matchingProduct);
  });
  //console.log(matchingProduct);
  const today_HTML = dayjs();
  const def_DATE = today_HTML.add(7, 'days');
  const def_DATE_read = def_DATE.format('dddd, MMMM D');

  cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Estimated delivery date: ${def_DATE_read}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
  `;
});
function deliveryOptHTML(matchingProduct, cartItem) {
  let html = ' ';

  deliveryOpts.forEach((deliveryOptfn) => {
    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOptfn.deliveryDays,
      'days'
    );
    const dateRead = deliveryDate.format('dddd, MMMM D'); //day, MONTH DATE
    const priceString = deliveryOptfn.priceCents === 0 
      ? 'FREE'//if
      : `$${formatCurrency(deliveryOptfn.priceCents)} -`;//else
    html +=`
      <div class="delivery-option">
        <input type="radio"
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}
        ">
        <div>
          <div class="delivery-option-date">
            ${dateRead}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `;
  })
  return html;
}

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.remove();
    });
  });