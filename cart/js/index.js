var app = {

	initialize: function() {
		app.renderItems();
	},

	renderItems: function() {

		Parse.$ = jQuery;
     	Parse.initialize("dVVty0n8MrhMhTusZHskFKJADY2HmG17KWW2TpQ9", "ZauyN5aDZHeWgWp5W73U4qL6yCMm66Hf67QZNy5q");
     	Parse.serverURL = 'https://parseapi.back4app.com';

      	var Product = Parse.Object.extend("Product");
      	var query = new Parse.Query(Product);
      	query.find({
        	success: function(results) {

          		for (var i = 0; i < results.length; i++) {

            		var object = results[i];

					var item = '<div class="col-sm-6 col-md-4">' +
			                        '<div class="thumbnail">' +
			                          '<img src="' + object.get("image").url() + '"alt="">' +
			                          '<div class="caption">' +
			                            '<h3>' + object.get("title") + '</h3>' +
			                            '<p>$' + object.get("price") + '</p>' + 
			                            '<input class="input-num-articles" id="' + object.id + '" type="text" value="1">'+
			                            '<button class="add-cart" itemId="' + object.id + '" title="' + object.get("title") + '" imageUrl="' + object.get("image").url() + '" price="' + object.get("price") + '">Agregar a carrito</button>'+
			                          '</div>' +
			                        '</div>' +
		                      	'</div>';		

                  
		           	$("#items-list").append(item);

		         }

	         	$(".input-num-articles").TouchSpin(
	         		{min: 0, 
	            	max: 100}
	          	);

	        },
	        error: function(error) {
		    	alert("Error: " + error.code + " " + error.message);
		    }
	    });      

	    app.setAddCartButtonsListener();
	},

	setAddCartButtonsListener: function() {

		$(document).on("click", ".add-cart", function (e) {

			var itemId = $(this).attr("itemId");
			var title = $(this).attr("title");
			var price = $(this).attr("price");
			var imgUrl = $(this).attr("imageUrl");
			var quantity = $('#' + itemId).val();

	        if (app.supportLocalStorage()) {
	        	
	        	// Checks if cartArray already exists
	        	if (localStorage.getItem("cartArray") != null) {

	        		// cartArray already exists

	        		// get cartArray from local storage 
	        		var cartArrayString = localStorage.getItem("cartArray");

	        		// parse cartArray so that we can manipulate it
	        		var cartArray = JSON.parse(cartArrayString);

	        		// create item to be added to cart
	        		var item = {
	        			id: itemId,
	        			title: title,
	        			imgUrl: imgUrl,
	        			price: price,
	        			quantity: quantity.toString()
	        		}

	        		// add item to cart
	        		cartArray.push(item);

	        		// save cart in local storage (array must be stringified before being saved)
	        		localStorage.setItem("cartArray",JSON.stringify(cartArray));
	        		alert("Artículo agregado al carrito.");

	        	} else {

	        		// cartArray does NOT exist yet

	        		// initialize cartArray
	        		var cartArray = [];

	        		// create item to be added to cart
	        		var item = {
	        			id: itemId,
	        			title: title,
	        			imgUrl: imgUrl,
	        			price: price,
	        			quantity: quantity.toString()
	        		}

	        		// add item to cart
	        		cartArray.push(item);

	        		// save cart in local storage (array must be stringified before being saved)
	        		localStorage.setItem("cartArray",JSON.stringify(cartArray));
	        		alert("Artículo agregado al carrito.");
	        	}

	        } else {
	        	alert("Ups! This browser does not support local storage. Please try with one of the following: Chrome,Firefox,Internet Explorer,Safari,Opera");
	        }

	    });

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