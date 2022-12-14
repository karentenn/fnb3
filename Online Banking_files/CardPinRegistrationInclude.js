$(function() {
	function genericPageObject() {
		this.configObject = {};
	}
	genericPageObject.prototype = {

		init : function(dataSource) {

			var parent = this;
			parent.configObject = dataSource;
			parent.pageLoad();	
		}, 
		pageLoad :function(){
			var parent = this;
		},
		validateCardAndPinCrypto : function(){
			if (this.validateCardAndPin()) {
				this.submitCardAndPin("CRYPTO_FORM");
			}
			
			return false;
		},
		validateCardAndPinOld : function (){
			var crdLength=$("#card").val().length;
			var pnLength=$("#pin").val().length;
			
			
			if (crdLength != 16) {
				this.errorMessage("Please enter the 16 digit card number as it appears on the card without spaces");
					return false;
				}
				if (pnLength!= 4) {
	
	            this.errorMessage("Please enter a valid 4 digit PIN");
					return false;
				}

				$("#simple").val("true");
				$("#formname").val("CRYPTO_FORM");
				
				//alert('before subm');
				//this.submitCardAndPin("CRYPTO_FORM");
				fnb.functions.submitFormToWorkspace.submit('CRYPTO_FORM','',this, {alternateUrl: ''});

				return true;
			
			
		},
		
		validateCardAndPin : function (){
			var crdLength=$("#card").val().length;
			var pnLength=$("#pin").val().length;
			
			if (crdLength != 16) {
				this.errorMessage("Please enter the 16 digit card number as it appears on the card without spaces");
					return false;
				}
				if (pnLength!= 4) {
	
	            this.errorMessage("Please enter a valid 4 digit PIN");
					return false;
				}
//			if ($.trim($("#captue").val()) || 
//				$("#capture").val().length == 0) {
//					this.errorMessage("Please enter the verification code displayed onscreen or try another. Note that the code is case sensitive.");
//					return false;
//				}
				$("#simple").val("true");
				$("#formname").val("CRYPTO_FORM");
				return true;
			
			
		},
		
		errorMessage : function(errorMessage){
			fnb.controls.controller.eventsObject.raiseEvent('navError',{height:'134px',message: 'Some errors have occurred...', errors:[{error: errorMessage}]});
		},
		
		checkResponse : function(){
			var parent = this;
			clearTimeout(timer);
			
			fnb.functions.submitFormToWorkspace.submit('CRYPTO_FORM','',this, {alternateUrl: ''});
		},
		
		submitCardAndPin : function(me){
			var cardNumLength = 0;
			var errorMessage = "";
			var success = true;
			formName = me;
			if ($('#card').val()) {
				cardNumLength = $('#card').val().length;
			}
			
			if ((cardNumLength > 16) || (cardNumLength < 16) || (cardNumLength == 0) || !$.isNumeric($('#card').val())) {
				errorMessage = "Please enter the 16 digit card number as it appears on the card without spaces.";
				this.errorMessage(errorMessage);

				success = false;
			}
			
			if (!$.isNumeric($('#pin').val())) {
				errorMessage = "Please enter a valid 4 digit PIN.";
				//alertO(errorMessage);
				this.errorMessage(errorMessage);

				success = false;
			} else if ($('#pin').val().length > 4 || $('#pin').val().length < 4) {
				errorMessage = "Please enter a valid 4 digit PIN";
				//alertO(errorMessage);
				this.errorMessage(errorMessage);

				success = false;
			}
			
			if (!success) {
				//resetMultiple();
				return false;
			}
			
			this.getTicket();
			
			return false;
		},
		
		getTicket : function (me){
			var me=this;
			var cntr=$('#country').val();
			var crd=$('#card').val();
			$("#ticketDiv").html("");
			var capture = $('#g-recaptcha-response').val();
			var urlTick="/banking/Controller?nav=cardpin.crypto.navigator.CardPinCryptoRegistrationTickectNoOTP&formname=CRYPTO_FORM&action=getticket&countryID="+cntr+"&cardNumber="+crd+"&g-recaptcha-response="+capture;
            fnb.controls.controller.eventsObject.raiseEvent('loadUrlToTarget',{url:urlTick, target:"#ticketDiv",postLoadingCallback:pages.fnb.card.crypto.CardPinRegistrationInclude.checkTicket()});
		},
		
		checkTicket : function (){
			setTimeout(function(){
					var isLoaded = pages.fnb.card.crypto.CardPinRegistrationInclude.executeGetTicket();
					console.log(isLoaded)
					if(isLoaded==false) pages.fnb.card.crypto.CardPinRegistrationInclude.checkTicket();
				}
				,2000)
		},
		
		executeGetTicket : function(){
			var tic = $("#ticketDiv").html();
			var secureUrl = this.configObject.cryptoUrl;
			if (tic.length === 64) {
			 	var data = {
						operation : 'authenticatepin',
						ticket : tic,
						pin : $("#pin").val(),
						cardno : $("#card").val().substring(3, 15)
					};
				$('#tick').val(tic);			
				//create temp form for post
				$('body')
						.append('<form action="' + secureUrl + '" method="post" target="res" id="postToIframe"></form>');
				$.each(data, function(n, v) {
					$('#postToIframe').append('<input type="hidden" name="' + n + '" value="' + v + '" />');
				});
				$('#postToIframe').submit().remove();
				$("#pin").val("");
				timer=setTimeout(this.checkResponse,2000);
				return true;
			}
			return false;
		}   
	}
	namespace("fnb.card.crypto.CardPinRegistrationInclude",genericPageObject); 	
});