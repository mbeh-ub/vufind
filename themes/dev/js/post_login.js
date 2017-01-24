$(document).ready(function(){
  var cartItems = VuFind.cart.getFullItems();
  
  if (cartItems.length > 0) {
    $('#modal').attr('data-backdrop',"static");
    $('#modal').attr('data-keyboard',"false");
    $('#modal .close').addClass('hidden');
    
    VuFind.lightbox.refreshOnClose = true;
    VuFind.lightbox.ajax({url:'/bootstrap3/Cart/PostLogin'});
  }
});  