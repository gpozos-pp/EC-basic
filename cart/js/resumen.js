var app = {

	
	initialize: function() {
		app.renderItemsCheckout();
	},

	renderItemsCheckout: function() {

		if (app.supportLocalStorage()) {
	        	
        	// Checks if cartArray already exists
        	if (localStorage.getItem("cartArray") != null) {

        		// cartArray already exists

        		// get cartArray from local storage 
        		var cartArrayString = localStorage.getItem("cartArray");

        		// parse cartArray so that we can manipulate it
        		var cartArray = JSON.parse(cartArrayString);

        		var total = 0;

        		var itemsArrayPaypal = [];

        		for (var i = 0; i < cartArray.length; i++) {

        			var subTotal = parseInt(cartArray[i].quantity) * parseInt(cartArray[i].price);
        			var total = total + subTotal;

        			var item = '<tr>' +
        						  '<td><img src="' + cartArray[i].imgUrl + '" height="80px"></td>' +		
					              '<td>' + cartArray[i].title + '</td>' +
					              '<td>' + cartArray[i].quantity + '</td>' +
					              '<td>$ ' + cartArray[i].price + '</td>' +
					              '<td>$ ' + subTotal + '</td>' +
					            '</tr>';

					var itemPaypal = {
                                      "name": cartArray[i].title,
                                      "price": cartArray[i].price,
                                      "currency": "MXN",
                                      "quantity": cartArray[i].quantity
                                    };

					$('#tbody-items').append(item);

					itemsArrayPaypal.push(itemPaypal);

        		}

        		var totalItem = '<tr>' +
        						  '<td></td>' +		
					              '<td></td>' +
					              '<td></td>' +
					              '<td><strong>TOTAL</strong></td>' +
					              '<td><strong>$ ' + total + '</strong></td>' +
					            '</tr>';

				$('#tbody-items').append(totalItem);

				app.renderPaypalButton(total,itemsArrayPaypal);

        	} else {

        		// cartArray does NOT exist yet

        		console.log("You don't have anything in the cart");
        	}

        } else {
        	alert("Ups! This browser does not support local storage. Please try with one of the following: Chrome,Firefox,Internet Explorer,Safari,Opera");
        }

	},

	renderPaypalButton: function(amountTotal,itemsArray) {

		paypal.Button.render({

            env: 'sandbox', 

          	locale: 'es_MX',

          	style: {
             	label: 'pay',
              	size:  'large', 
              	shape: 'rect',   
              	color: 'silver'
          	},

          	client: {
             	sandbox: 'AdLP7TfHOHls5OU6jM-hxJtfJCJLF599FsAhkpCrkhKw5FOKNa1PrCJ8cbiyNurH97bM4T7Tf5OL5c_v'
          	},

          	commit: true, // Show a 'Pay Now' button

            // payment() is called when the button is clicked
            payment: function(data, actions) {

                // Make a call to the REST api to create the payment
              	return actions.payment.create({
                    payment: {
                        transactions: [
                            {
                                amount: { 
                                    total: amountTotal, 
                                    currency: 'MXN' 
                                },
                                description: "Compra desde Geenius Store",
                                item_list: {
                                    items: itemsArray
                                }
                            }
                        ]
                      }
                  });

            },
                  
            // onAuthorize() is called when the buyer approves the payment
            onAuthorize: function(data, actions) {
  
	           	return actions.payment.get().then(function(paymentDetails) {
                          return actions.payment.execute().then(function() {
                              window.alert('¡Pago Completado! Gracias por su compra, vuelva pronto.');
                              // El pago se ha completado
                              // Puede mostrar un mensaje de confirmación al comprador
                              
                              localStorage.removeItem("cartArray");
                              window.location = "index.html";
                          });
                      });

		    },

	        onCancel: function(data, actions) {
	            // Show a cancel page or return to cart
	            console.log("Error: " + data);
	        }
	                

	    }, '#paypal-button-container');


	},

	supportLocalStorage: function() {
		if(typeof(Storage) !== "undefined") {
			return true;
		} else {
			return false;
		}

	}

}

app.initialize();