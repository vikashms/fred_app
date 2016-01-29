/*
 This file would include all the common directives and their controllers if required.

*/

loadCommonDirectives = function(){
	
	var handlePasteEvent = function($element){
			$element.on("paste" , function(event){
			 	var item = event.originalEvent.clipboardData.getData('Text');
				$element.val(item).trigger("input");
			});
	};

	angular.module("common.directives", ['/directive/uploadFile.htm'] )
	.controller("jdLoadImageController",function($scope){
		$scope.updateImageData = function(attrs,element){
			$scope.element = element;
			$scope.attrs = attrs;
			if(attrs.ngModel){
				$scope.$watch(attrs.ngModel,function(){
					$scope.loadImage();
				});
			}
			else{
				$scope.loadImage();
			}
		};
		
		$scope.loadImage = function(){
			$scope.element.html('<div class="jd-image-loader-icon inventoryImg marginR10 txt-center"><i class="icon-camera"></i></div>');
			if($scope.element && $scope.attrs.path && $scope.attrs.path!= "[]"){
					var path = "/marketplace/upload/products/imgURL=" + $scope.attrs.path + "&imgDim=" + $scope.attrs.dimension;
					var img = $("<img />").attr({'data-rel':$scope.attrs.path,'src':path})
						.load(function() {
							if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
								alert('broken image!');
							} else {
								$scope.element.find("inventoryImg").removeClass("inventoryImg");
								$scope.element.find("inventoryImg").css("background", "transparent");
								var height = $scope.attrs.height,
									width  = $scope.attrs.width,
									originalHeight = this.naturalHeight,
									originalWidth = this.naturalWidth;
								
								var data = Utills.getImageAspectRatio({
									imgHeight:originalHeight,
									imgWidth:originalWidth,
									maxHeight:height,
									maxWidth:width
								});
								
								var marginLeft = ((width - data.width)/2) + "px",
									marginTop = ((height - data.height)/2) + "px";
								
								img.attr({"height":data.height,"width":data.width})
									.css({"margin-top":marginTop,"margin-left":marginLeft});
								$scope.element.html(img);
							}
					});
				}
		};
		
	})

	/*
		To replace HTML with the desired value
		Using two values Replace RegEx and Replace-With RegEx
	*/
	.directive("jdHtmlConverter",function($timeout){
		return {
			link: function ($scope, element, attrs) {
				var strHtml = attrs.jdHtmlConverter;
				if(attrs.replace){
					var regEx = new RegExp(attrs.replace, "g")
					strHtml = strHtml.replace(regEx,attrs.replaceWith);
				}
				$(element).html(strHtml);
			}
		};
	})
	/*
		It will load image in given element and element declaration must be in following format.
		<div jd-load-image data-path="{{imgPath}}(path of the image)" data-dimension="100X100(image dimensions of which ajax would be fired)" (data-height="50" data-width="50")(maximum height or width of which you would like to maintain aspect ratio) ng-controller="jdLoadImageController" ng-model="defaultImage"(this is optional unless your image is keep on changing)>
	
	*/
	.directive("jdLoadImage",function($timeout){
		return {
			link: function ($scope, element, attrs) {
				element.addClass("jd-image-holder");
				$scope.updateImageData(attrs,element);
			}
		};
	})
	/*.directive("jdInputRegexValidation", function($parse) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                ngModel.$parsers.push(parseUserInput);
				var regEx = App.RegEx[attr.jdInputRegexValidation];
                function parseUserInput(text) {
                    if (text) {
                        var newValue = text.replace(regEx, '');

                        if (newValue !== text) {
                            ngModel.$setViewValue(newValue);
                            ngModel.$render();
                        }
                    }
                }
				ngModel.$viewChangeListeners.push(function(){
					$parse(attr.ngModel).assign(scope, ngModel.$viewValue);
				});
            }
        };
    })*/
	.directive('jdOnlyNumeric', ['$timeout', function ($timeout) {
		return {
			link: function ($scope, element, attrs) {
				
					element.on("keypress",function(event){
						var charCode = (event.which) ? event.which : event.keyCode;
						if (event.ctrlKey != true && charCode != 8 && charCode !=9 && (charCode < 48 || charCode > 57)){
							event.preventDefault();
						}
					});
				var $element = $(element);
				$element.on("paste" , function(event){
					var maxLength = attrs.maxlength;
					var curVal = $element.val();
				 	var item = event.originalEvent.clipboardData.getData('Text');
				 	var curLength = curVal.length + item.length;
				 	if(!(isNaN(item) == false && !(maxLength && curLength > Number(maxLength)))){
						//$element.val(item).trigger("input");
						event.preventDefault();
					}
					
				});
			}
		};
	}])
	.directive('jdDatePicker', ['$timeout', function ($timeout) {
		return {
			link: function ($scope, element, attrs) {
				var $element = $(element);
				var loadDatePicker = function () {
					$element.datetimepicker({
						pickTime: false
					});
                                        if(attrs.setDate){
                                            $element.datepicker("setDate", new Date(attrs.setDate));
                                        }
				};
				if($element.datetimepicker){
					loadDatePicker();
				}else{

					require(["bootstrapDatepicker"],function(){
						loadDatePicker();
					});
				}
			}
		};
	}]) 
	.directive('jdDateRangePicker', ['$timeout', function ($timeout) {
		return {
			link: function ($scope, element, attrs) {
				require(["dateRangePickerJs"],function(){
					var startDate = moment().subtract(6, 'days').format('D-MMM-YYYY'),
				   	      endDate = moment().subtract(0, 'days').format('D-MMM-YYYY');
					$(element).find('span').html(moment().subtract(6, 'days').format('DD-MMM-YYYY') + ' - ' + moment().subtract(0, 'days').format('DD-MMM-YYYY'));
					$(element).daterangepicker({
						maxDate: moment(),
						startDate: startDate,
					    endDate: endDate,
						ranges: {
							'Today':  [moment(), moment()],
							'Yesterday': [moment().subtract(1,'days'),  moment().subtract(1, 'days')],
							'Last 7 Days': [moment().subtract(6,'days'), new Date()],
							'Last 30 Days': [moment().subtract(29,'days'), new Date()],
//							'Last Week': [moment().subtract(8,'days'), new Date()],
							'Last Week': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
							'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
//							'Last 3 Month': [moment().subtract(89, 'days'), moment()]
//							'Last Year': [moment().subtract(12,'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
						},
						opens: 'right',
						buttonClasses: ['btn'],
						applyClass:'btn-primary',
						cancelClass:'btn-default',
						locale: {
							daysOfWeek: ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri','Sat'],
							firstDay: 1
						},
						format: 'D-MMM-YYYY',
					},cb);
					function cb(start, end) {
						$(element).find('span').html(start.format('D-MMM-YYYY') + ' - ' + end.format('D-MMM-YYYY'));
					}
					if(attrs.option){
						var dateRangePickerVar = $(element).data('daterangepicker');
				   		$scope[attrs.option].reset = function(){
				   			var startDate = moment().subtract(6,'days'),
				   				endDate = moment();
				   		//	$(element).find('span').html(startDate.format('D-MMM-YYYY') + ' - ' + endDate.format('D-MMM-YYYY'));
				   			dateRangePickerVar.cb(startDate,endDate)
				   			dateRangePickerVar.setStartDate(startDate);
				   			dateRangePickerVar.setEndDate( endDate);
				   		}
				   	}                  
				});
			}
		};
	}])
	.directive('jdPopover', function ($timeout) {

		return {
			restrict: "A",
			link: function ($scope, element, attrs) {
				var popOverContent;
				var options = {
						placement: "bottom",
						html: true,
						content:"hello"
					};
				
				$(element).popover(options);
				
				$($scope).on("jdPopover.updateData",function(event,data){
					$(element).data('bs.popover').options.content = data.content;
				});
				
				$scope.$watch(attrs.jdPopover,function(){
					$(element).data('bs.popover').options.content = $scope[attrs.jdPopover];
				});
			}
		};
	})
	.directive('jdOnlyDecimal', ['$timeout', function ($timeout) {
		return {
			link: function ($scope, element, attrs) {
				$timeout(function(){
					element.on("keypress",function(evt){

						var charCode = (evt.which) ? evt.which : evt.keyCode;

						if (charCode != 37 && charCode != 38 &&charCode != 39 &&charCode != 40 &&charCode != 8 && charCode !=9 && (charCode != 46 || $(this).val().indexOf('.') != -1) && (charCode < 48 || charCode > 57)){
							return false;
						}
						return true;
					}); 
				},0,false);			
			}
		};
	}])
	.directive('jdProductName', ['$timeout', function ($timeout) {
		return {
			link: function ($scope, element, attrs) {
				$timeout(function(){
					element.on("keypress",function(evt){

						var charCode = (evt.which) ? evt.which : evt.keyCode;

						if (charCode == 60 || charCode == 62 ){
							return false;
						}
						return true;
					}); 
				},0,false);			
			}
		};
	}])
	.directive('jdAlternateNumber', ['$timeout', function ($timeout) {
		return{
			link: function ($scope, element, attrs){
				$(element).on("keypress",function(evt){
					var charCode = (evt.which) ? evt.which : evt.keyCode,
						codes = [8,9,32,45,46,47];
					if((charCode<48 || charCode>57) && codes.indexOf(charCode)==-1){
						evt.preventDefault();
					}
                     
					return true;
				});
				var $element = $(element);
				$element.on("paste" , function(event){
				 	var item = event.originalEvent.clipboardData.getData('Text');
				 	var temp = RegExp("^[0-9\-\. ]+$");
				 	if(temp.test(item) == true){
						$element.val(item).trigger("input");
					}
					else{
						event.preventDefault();
					}
				});
			}
		};
	}])
	.directive('jdAlternatePhoneno', function () {
		return{
			link: function ($scope, element, attrs){
				$(element).on("keypress",function(event){
					var charCode = (event.which) ? event.which : event.keyCode,
					strValue = event.currentTarget.value,// the value inserted inside the input
					codes =[8,9,32,45,46,47], // backspace: 8,tab:9,space:32,insert:45,delete:46,37:left-arrow,39:right-arrow;
					restrictTwice = [32,45,46,47],
					currentCursorPosition = this.selectionStart;// to check the current position of the cursor
					if((restrictTwice.indexOf(charCode)!=-1 && restrictTwice.indexOf(strValue.charCodeAt(currentCursorPosition-1))!= -1) || ((charCode<48 || charCode>57) && codes.indexOf(charCode)==-1)){ //first condition is used to check two spaces are entered together and second condition is used to allow user to enter only number
						event.preventDefault();
					}
					return true;
				});
				var $element = $(element);
				$element.on("paste" , function(event){
				 	var item = event.originalEvent.clipboardData.getData('Text');
				 	var temp = RegExp("^[0-9\-\. ]+$");
				 	if(temp.test(item) !== true){
				 		event.preventDefault();
					}
				});
			}
		};
	})
     
	.directive('jdFraction',['$timeout',function($timeout){
		return {
			link: function ($scope, element, attrs){
				$timeout(function(){
				element.on("keypress",function(evt){
					var charcode = (evt.which) ?evt.which : evt.keyCode;
					if(charcode == 45){
						if($(this).val() != ''){
							evt.preventDefault();
						}
						return true;
					}
					if( charcode ==	46){
						if($(this).val().indexOf('.') == -1){
							return true;
						}
						evt.preventDefault();
					}
					if(charcode >= 48 && charcode <= 57 ){
						return true;
					}
					evt.preventDefault();
				});
				},0,false);	
			}
		};
	}])
	/********
		for textbox to have decimal values with PARTICULAR LENGTH before and after the decimal points
		directive name "jd-decimal-value-with-range" ------ intrange and decimalrange are the attribute which needs to be defined along with the directive
		add intrange="your value before decimal point" 
		decimalrange="your value after decimal point"	
	*********/
	//TODO to use the ng-pattern then this directiv in future and also replace this directive from  existing code
	//eg <input type="text"  ng-model="myText" name="inputName" ng-pattern="onlyNumbers">
	//$scope.onlyNumbers = /^\d+$/;
	.directive('jdDecimalValueWithRange', ['$timeout', function ($timeout) {
		return {
			link: function ($scope, element, attrs) {
				
				$timeout(function(){
					var intRange = Number(attrs.intrange),
						decimalRange = Number(attrs.decimalrange);
					element.on("keyup",function(evt){
						var charCode = (evt.which) ? evt.which : evt.keyCode;
						if(charCode !=37 && charCode !=38 && charCode !=39 && charCode !=40 && charCode !=35 && charCode !=36){
							var elementValue = $(element).val(),
								newValue,
								decimalValue,
								elementVal = elementValue.split('.'),
								str1 = elementVal[0],
								str2 = elementVal[1];
							
							if ((elementVal[0].length >= intRange)){
								newValue = elementVal[0].slice(0, intRange); 
								console.log(newValue);
								str1 = newValue;
							}
							
							if(elementVal[1] != undefined){
								str2 = elementVal[1];
								if (elementVal[1].length >= decimalRange){
									decimalValue = elementVal[1].slice(0,decimalRange);
									str2 = decimalValue;
								}
							}
							if(elementValue != '.'){
								var strNewValue = str2 !== undefined ? str1 + "." + str2 :str1;
							}
							else{
								strNewValue = "0.";
							}
							
							if(elementValue != strNewValue){
								$(element).val(strNewValue);
								$timeout(function() {
									  element.trigger('input');
				                    }, 0);
							}
							return true;
						}
					}); 
				},0,false);			
			}
		};
	}])
	.directive('jdCurrencyInput', function ($timeout) {
		return {
			link: function ($scope, element, attrs) {
				var intRange = attrs.intRange ? attrs.intRange : 6,
					decimalRange = 2,
					totalLength = intRange+decimalRange+1,
					allowNegative = attrs.allowNegative,
					options = {
						allowZero:true,
						thousands:'',
						decimal:'.',
						allowNegative:allowNegative?true:false
					},
					$element = $(element);
				
				$element.maskMoney(options);
				var handleLengthValidation = function(keyCode){
					var strValue = $element.val(),
							array = strValue.split("."),
							strInt = array[0],
							strDecimal = typeof array[1] !== 'undefined' ?("." + array[1]):"",
							newValue = "",
							intMaxLength = Number(intRange),
							floatMaxLength = decimalRange + 1;
						
						strDecimal = strDecimal.replace("-","");
						if(keyCode == 8 && !Number(strValue) && strInt.indexOf("-") == 0){
							strInt = strInt.replace("-","");
						}
						if(strInt.indexOf("-") > 0){
							strInt = strInt.replace("-","");
						}
						else if(strInt.indexOf("-") == 0){
							intMaxLength += 1;
						}
						strInt = strInt.substr(0,intMaxLength);
						strDecimal = strDecimal.substr(0,floatMaxLength);
						newValue = strInt + strDecimal;
						if(newValue !== strValue){
							$element.val(newValue);
							
						}

						$timeout(function() {
						  $element.trigger('input');
						}, 0);
				};
				
				$element.on("keyup blur",function(evt){
					var keyCode = 0;
					if(evt.type == "keyup"){
						keyCode = evt.which?evt.which:evt.keyCode;
					}
					handleLengthValidation(keyCode);
				}); 
			}
		};
	})
	
	.directive('limitCharacter', function(){
		return {
			require: 'ngModel',
			link: function ($scope, element, attrs, ngModel){
				var $element = $(element),
					charRange = attrs.charRange?attrs.charRange:500,
					lineRange = attrs.lineRange?attrs.lineRange:5,
					type =attrs.limitCharacter,
					keyDownKeys = {
						controlKeys : [8,9,35,37,38,39,40,46],//8:backspace, 35:End, 37-40: arrow,46 delete
						functionKeys : [65,86],//Ctrl+a , Ctrl+v.
					};
					
					var addresCharCountValidation = function(text,isKeyDown) {
						var tempCharRange = isKeyDown?charRange-1:charRange;
							if(text.length > tempCharRange) {
								if(type === "customMessage"){
									$scope[attrs.errorVar] = "Message cannot be more than 500 characters";
								}else{
									$scope[attrs.errorVar] = "Address cannot be more than 500 characters";
    								
								}
    							
    						}
    					return true;
    				};

   					var addresRowCountValidate = function(text,isKeyDown) {
    					var noOfLines = text.split('\n'),
    						tempRowRange = isKeyDown?lineRange-1:lineRange;
    						if(noOfLines.length > tempRowRange) {
    							if(type === "customMessage"){
    								$scope[attrs.errorVar] = "Message cannot be more than 9 rows";
    							}else{
    								$scope[attrs.errorVar] = "Address cannot be more than 5 rows";
               		 				
    							}
            					return false;
            				}
            				return true;
    				};
					

					$element.on('keydown',function(event){
						
        					var keycode = (event.which) ? event.which : event.keyCode,
           					text = $(event.target).val(),
           					result = false;
           					
           					if(this.selectionStart != this.selectionEnd) {
           						text = text.substring(0,this.selectionStart)+ '' + text.substring(this.selectionEnd,text.length);// truncate the selected text.
           					}
           					else {
           						if(keycode == 8)
           							text = text.substring(0,this.selectionStart-1)+ '' + text.substring(this.selectionStart,text.length);
           						if(keycode == 46)
           							text = text.substring(0,this.selectionStart)+ '' + text.substring(this.selectionStart+1,text.length);
           					}
           					
           					
           					if(keyDownKeys.controlKeys.indexOf(keycode) != -1 ||(event.ctrlKey && (keycode == 65 || keycode == 86))){//ctrl+a
    							//console.log("Ctrl+a");
    							result = true;
    						}
    						$scope[attrs.errorVar] = null;
    						if(addresRowCountValidate(text,keycode == 13) && (keycode == 13)){
        							result = true;
    						}else if(addresCharCountValidation(text,true) && keycode != 13){
    							result = true;
    						}
    						if(result){
    						return true;	
    						} 
    						
    						event.preventDefault();
    						$scope.$apply();
						});

        			$element.on('paste',function(event){
        				$scope[attrs.errorVar] = null;
        				var clipBoardText = event.originalEvent.clipboardData.getData('Text'),
        					textBoxText = $(event.target).val(),
        					text = textBoxText +''+ clipBoardText;
        				//console.log("paste 0  >>"+$scope[attrs.errorVar]);
        				addresRowCountValidate(text);
        				//console.log("paste1  >>"+$scope[attrs.errorVar]);
						addresCharCountValidation(text);
						//console.log("paste2  >>"+$scope[attrs.errorVar]);

					//	event.preventDefault();
						$scope.$apply();
        			});
			}
		}
	})

	.directive('jdPastePrevent', function() {
		return {
			link: function ($scope, element, attrs){
				var $element = $(element);
				$element.on('paste',function(event){
					var clipBoardText = event.originalEvent.clipboardData.getData('Text');
		      		var reg = $scope[attrs.jdPastePrevent];
		        	var isTextValid = (reg.test(clipBoardText));
		        	if(!isTextValid){
		            	event.preventDefault();
		        	}
				});
			}
		}
	})

	/**
	 * 	@intRange range for integer, default 7
	 *  @allowNegative allow negative default false.
	 *  @onValueUpdate function called on change of value
	 * 
	 * 	this directive allow 3 digit after decimal, on blur round off to 2 decimal point.
	 * 	allow "," to enter in text box, but set the value of ngModel without ",".
	 * 	remove "," on blur (from view).
	 * 
	 * */
	.directive('jdWebMoney', function($parse) {
		return {
			require: 'ngModel',
			link: function ($scope, element, attrs, ngModel){
				var $element = $(element);
				if($element[0] && $element.attr("type") !== "text"){
					 $element.attr("type","text"); // as this.selectionStart property is supported by input type = "text" only
					}
					var intRange = attrs.intRange ? attrs.intRange : 7,
						DECIMAL_RANGE = 2,
						DECIMAL_ALLOWED_TO_ENTER = 2,
						allowNegative = attrs.allowNegative?true:false,
						anyChangeToPropagate = false,
						keydownCodes = {
								numbers : [48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105],//0-9 upper:48 57, 0-9 numLock: 96 105.
								controlKeys : [8,37,39,46,9],//back space:8, arrow keys: 37 39, delete: 46, tab: 9.
								dot : [110,190],
								negative : [109,189,173],//173 for firefox.189 for chrome
								positive : [61,107,187],//61 firefox,187 chrome with shift.
								comma : 188
						};
					
					var getNumberValue = function(strValue){
						var newValue = strValue.replace(/,/g,"");
						newValue = parseFloat(newValue);
						if(!isNaN(newValue)){
							newValue = Math.round(newValue*100)/100;
						}else{
							newValue = 0;
						}
						return newValue;
					};
					
					
					$element.on('keydown',function(event){
						var keyCode = (event.which) ? event.which : event.keyCode,
								strValue = $(event.target).val(),
								splitValue = strValue.split("."),
								decimalLength = splitValue[1]?splitValue[1].length:0,
								integerLength = splitValue[0]?splitValue[0].length:0,
								actualIntegerVal = splitValue[0].replace(/[^\d]/g,""),
								noOfDigitInIntegerPart = decimalLength?actualIntegerVal.length:0,
								currentCursorPosition = this.selectionStart;//current cursor index (start from zero) from left.
								splitValue[1] = splitValue[1]?splitValue[1]:'';
								var isPlusSignPressed = (keydownCodes.positive.indexOf(keyCode) != -1);
								if(event.ctrlKey && [65,86].indexOf(keyCode) != -1){//Ctrl + a, Ctrl + v. 
									return true;
								}
								if(event.shiftKey && keyCode == 9){
									return true;
								}
								if(!event.shiftKey||(event.shiftKey && (isPlusSignPressed || keyCode == 37 || keyCode == 39))){
									anyChangeToPropagate = true;
									var dontDeleteDot = null;
									if(decimalLength){
										dontDeleteDot = Utills.Directive.restrictDotDeletion(event,keyCode,[8,46],strValue.replace(/,/g,""),currentCursorPosition,integerLength,intRange);
									}
									if(!dontDeleteDot){
									
										if(keydownCodes.numbers.indexOf(keyCode) != -1){
											var allowedDigit = Utills.Directive.restrictDigitEntry(keyCode,keydownCodes.numbers,strValue,currentCursorPosition,intRange,DECIMAL_ALLOWED_TO_ENTER,[48,96],noOfDigitInIntegerPart);
											if(allowedDigit){
												return true;
											}
										}
										if(keydownCodes.controlKeys.indexOf(keyCode) != -1){
											return true;
										}else if(keydownCodes.dot.indexOf(keyCode) != -1 && strValue.indexOf('.') == -1){
											if(currentCursorPosition != strValue.length){//if currser is not at end
												var decimalText = strValue.substring(currentCursorPosition,strValue.length);
												if(decimalText.indexOf(',') == -1 && decimalText.length <= DECIMAL_ALLOWED_TO_ENTER){
													return true;
												}
											}else
												return true;
										}else if(keydownCodes.comma == keyCode && currentCursorPosition <= integerLength){
											if(currentCursorPosition && strValue.charAt(currentCursorPosition) != ',' && strValue.charAt(currentCursorPosition-1) != ','){
												return true;
											}
										}else if(allowNegative && (keydownCodes.negative.indexOf(keyCode) != -1 || isPlusSignPressed)){
											if(isPlusSignPressed || strValue.indexOf('-') != -1){
												strValue = strValue.replace(/\-/g,"");
											}else{
												strValue = '-' + strValue;
											}
											ngModel.$setViewValue(strValue);//for updating view values (cause a '-' sign is implemented on UI.
											ngModel.$render();
											ngModel.$setViewValue(getNumberValue(strValue));//setting ngModel vlue, but not updating the view value of the ngModel.
											$scope.$apply(function (){
												$scope.$eval(attrs.onValueUpdate);
											});
										}
									}
									propagateChanges();
									anyChangeToPropagate = false;
								}
						anyChangeToPropagate = false;
						event.preventDefault();
					});
					
					$element.on('keyup',function(){
						propagateChanges();
					});
					function propagateChanges(){
						if(anyChangeToPropagate){
							var strValue = $(element).val(),
							newValue = strValue;
							ngModel.$setViewValue(getNumberValue(newValue));//setting ngModel vlue, but not updating the view value of the ngModel.
							$scope.$apply(function (){
								$scope.$eval(attrs.onValueUpdate);
			                });
						}
					}
					
					$element.on('paste',function(event){
						var strValue = event.originalEvent.clipboardData.getData('Text');
						strValue = Utills.Directive.onPasteRemoveNonNumber(strValue,intRange,DECIMAL_RANGE,allowNegative);
							ngModel.$setViewValue(strValue);
                            ngModel.$render();
                            event.preventDefault();//prevent paste event.
                            $scope.$apply(function (){
								$scope.$eval(attrs.onValueUpdate);
			                });
					});
					
					element.unbind('blur').bind('blur', function(event) {
						var strValue = $(element).val(),
						newValue = getNumberValue(strValue);
						newValue = newValue.toFixed(2);
						if(newValue !== strValue){
							ngModel.$setViewValue(newValue);
	                        ngModel.$render();
	                        $scope.$apply(function (){
								$scope.$eval(attrs.onValueUpdate);
			                });
						}
					});
					
					if(attrs.ngBlur){
						var fn = $parse(attrs['ngBlur']);
						element.bind('blur', function(event){
							$scope.$apply(function() {
								fn($scope, {$event:event});
							});
						});
					}
					
			}
		};
	})
	
	/**
	 * jdWebWeight not allow decimal for UOM pc, pkt, pr. For all other UOM it allow 3 decimal place velue.
	 * NOTE :- only use with type="text" box, not use for type="number".
	 * @intRange no of integer allowed, default value is 4.
	 * @allowDecimal allow Decimal if true, default is false.
	 * @decimalRange no of integer allowed, default value is 3.(work only if attr allowDecimal is true)
	 * @allowNegative allow Negative, default value is false.
	 * @nozeroOnBlur dont replace blank value with zero, if set to true.
	 * @jdWebWeight if uom changes dinemically, to change the fraction.
	 * @disableUpDownKey : To prevent value from changing on UP/DOWN arrow key press
	 * 				value to whole no on changing UOM, assign this attr scope variable of UOM. eg. on product page.
	 */
	.directive('jdWebWeight', function($parse){
		return {
			require: 'ngModel',
			link: function($scope,element,attrs,ngModel){
				var $element = $(element);
				if($element[0] && $element.attr("type") !== "text"){
				 $element.attr("type","text"); // as this.selectionStart property is supported by input type = "text" only
				}
					var intRange = attrs.intRange ? attrs.intRange : 6,
						decimalRange = attrs.decimalRange?attrs.decimalRange:3,
						allowNegative = attrs.allowNegative?true:false,
						keydownCodes = {
								numbers : [48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105],//0-9 upper:48 57, 0-9 numLock: 96 105.
								controlKeys : [8,37,39,46,9],//back space:8, arrow keys: 37 39, delete: 46, tab: 9.
								dot : [110,190],
								upDownArrow : [38,40],//up arrow key code 38, down arrow key code 40.
								negative : [109,189,173],//173 for firefox.189 for chrome
								positive : [61,107,187]//61 firefox,187 chrome with shift.
						},
						maxIntVal = '9';// Number to compare the value on increasing and descring with up and down arrow keys.
					maxIntVal = Number(maxIntVal.repeat(intRange));
					if(attrs.jdWebWeight){
						$scope.$watchCollection(attrs.jdWebWeight, function(){//to change value dynamically from decimal to non decimal on change of UOM.
							formatFraction();
						});
					}
					
					$element.on("keydown",function(event){
						var keyCode = event.which?event.which:event.keyCode,
							strValue = $(element).val(),
							splitValue = strValue.split("."),
							integerLength = splitValue[0]?splitValue[0].length:0,
							decimalLength = splitValue[1]?splitValue[1].length:0,
							allowDecimal = attrs.allowDecimal && attrs.allowDecimal != "false"?true:false,
							currentCursorPosition = this.selectionStart;//current cursor index (start from zero) from left.
							if(event.ctrlKey && [65,86].indexOf(keyCode) != -1){//Ctrl + a, Ctrl + v. 
								return true;
							}
							var dontDeleteDot = null;
							var isPlusSignPressed = (keydownCodes.positive.indexOf(keyCode) != -1);
							if(event.shiftKey && keyCode == 9){
								return true;
							}
							if(decimalLength && [8,46].indexOf(keyCode) != -1){
								dontDeleteDot = Utills.Directive.restrictDotDeletion(event,keyCode,[8,46],strValue,currentCursorPosition,integerLength,intRange);
							}
							if((!event.shiftKey ||(event.shiftKey && (isPlusSignPressed || keyCode == 37 || keyCode == 39))) && !dontDeleteDot){
								if(keydownCodes.numbers.indexOf(keyCode) != -1){
									var allowedDigit = Utills.Directive.restrictDigitEntry(keyCode,keydownCodes.numbers,strValue,currentCursorPosition,intRange,decimalRange,[48,96]);
									if(allowedDigit){
										return true;
									}
								}
								if(keydownCodes.controlKeys.indexOf(keyCode) != -1){
									return true;
								}else if(allowDecimal && keydownCodes.dot.indexOf(keyCode) != -1 && strValue.indexOf('.') == -1){
									if(currentCursorPosition != strValue.length){//if currser is not at end
										var decimalText = strValue.substring(currentCursorPosition,strValue.length);
										if(decimalText.length <= decimalRange){
											return true;
										}
									}else
										return true;
								}else if(allowNegative && (keydownCodes.negative.indexOf(keyCode) != -1 || isPlusSignPressed)){
									Utills.Directive.handleNegativeSign(strValue,ngModel,isPlusSignPressed);
								}
							}
							if(keydownCodes.upDownArrow.indexOf(keyCode) != -1 && !attrs.disableUpDownKey){// increasing and descring value on pressing up and down arrow keys.
								if(keydownCodes.upDownArrow[0] == keyCode){
									if(Number(splitValue[0]) < maxIntVal){
										strValue =(Number(strValue)+1);
									}
								}else{
									if(Number(splitValue[0]) > 0){
										strValue = (Number(strValue)-1);
									}else if(allowNegative && Number(splitValue[0]) > -maxIntVal){
										strValue = (Number(strValue)-1);
									}else{
										strValue = Number(strValue);
									}
								}
								if(allowDecimal){
									strValue = strValue.toFixed(decimalRange);
								}
								ngModel.$setViewValue(strValue);
								ngModel.$render();
							}
							
							event.preventDefault();
					});
					
					
					$element.on('paste',function(event){
						var strValue = event.originalEvent.clipboardData.getData('Text'),
							allowDecimal = attrs.allowDecimal && attrs.allowDecimal != "false"?true:false;
						strValue = Utills.Directive.onPasteRemoveNonNumber(strValue,intRange,decimalRange,allowNegative);
						if(!allowDecimal){
							strValue = strValue.split(".")[0];
						}
						event.preventDefault();//prevent paste event.
						ngModel.$setViewValue(strValue);
						ngModel.$render();
					});
					
					element.unbind('blur').bind('blur', function(event) {
						formatFraction();
					});
					
					function formatFraction(){
							var strValue = $(element).val(),
							allowDecimal = attrs.allowDecimal && attrs.allowDecimal != "false"?true:false,
							nozeroOnBlur = attrs.nozeroOnBlur?true:false;
							if(!nozeroOnBlur || nozeroOnBlur && strValue !== ''){
								strValue = Number(strValue).toFixed(3);
								if(isNaN(strValue)){
									strValue = '0.000';
								}
								if(!allowDecimal){
									strValue = strValue.split(".")[0];
								}
								ngModel.$setViewValue(strValue);
								ngModel.$render();
							}
					}
					
					if(attrs.ngBlur){
						var fn = $parse(attrs['ngBlur']);
						element.bind('blur', function(event){
							$scope.$apply(function() {
								fn($scope, {$event:event});
							});
						});
					}
			}
		};
	})
	
	/**
	 * @jdRegexValidation@   restrict value being entered, on based on the Regex provided.
	 * @jdRegexValidation should have regex in scope variable.
	 * @jdRegexValidation (optional) should have a negative Regex of allowed char, to remove the unallowed char,
	 * @jdRegexValidation ng-model is mandatory.
	 * @jdRegexValidation maxlength should be specified to allow the required number of char.
	 * Allow copy paste if text being pasted valisate Regex, else paste event prevented.
	 * 
	 */
	.directive('jdRegexValidation',function(){
		return {
			require:'ngModel',
			link: function($scope, element, attrs, ngModel){
				var $element = $(element),
					removeOnPasteRegex = attrs.removeRgex?$scope[attrs.removeRgex]:false;
				
				$element.on('keypress',function(event){
					var strValue = $(event.target).val();
					if(attrs.maxlength != strValue.length){
				//		console.log('key  :-  '+event.key);
						var validationRegex = $scope[attrs.jdRegexValidation];
						if(event.key){//handling for Firefox browser. Firefox genrate 'keypress' event also on thes key ("Del","Backspace","Right","Left","Home","End","Up","Down") (not expected behaviour).
							if(Utills.Directive.isKeypressControlKey(event))
								return true;
						}
						var keyCode = event.which?event.which:event.keyCode,
								currentCursorPosition = this.selectionStart,
								enteredChar = String.fromCharCode(keyCode),
								newValue = '';
						if(this.selectionStart != this.selectionEnd){
							newValue = strValue.substring(0,currentCursorPosition) + enteredChar + strValue.substring(this.selectionEnd,strValue.length);
						}else{
							newValue = strValue.substring(0,currentCursorPosition) + enteredChar + strValue.substring(currentCursorPosition,strValue.length);
						}
						if(validationRegex){
							if(validationRegex.test(newValue)){
								return true;
							}else
								event.preventDefault();
						}
					}
				});
				
				$element.on("paste" , function(event){
				 	var item = event.originalEvent.clipboardData.getData('Text'),
				 		strValue = $(event.target).val();
						maxlength = attrs.maxlength?attrs.maxlength:20;
				 	var validationRegex = $scope[attrs.jdRegexValidation];
				 	
				 	if(validationRegex && !removeOnPasteRegex){
						    if(validationRegex.test(item)){
								return true;
							}else
								event.preventDefault();
						}else if(removeOnPasteRegex){
							item = item.replace(removeOnPasteRegex,"");
							item = strValue.substring(0,this.selectionStart) + item + strValue.substring(this.selectionEnd);
							item = item.substring(0,maxlength);
							event.preventDefault();
							ngModel.$setViewValue(item);
							ngModel.$render();
						}
				});
			}
		}
	})
	
	/**
	 * @@jdUploadFile@@ upload file.
	 * @uploadOptions have following litrals:
	 * 		fieldName : name of the file fiels (as on server)
	 * 		validExtentions : Array of all the MIME typr (Extentions) allowed.
	 * 		url : url for uploadinf file.
	 * 		
	 * 		uploadFile() : FUNCTION to call at 'SAVE' button click.
	 * 		clear() : FUNCTION to reset directive.
	 * 		errorMsg : error message, if any, other wise NULL.(null in case of successfuly upload of file).
	 * 		fileStatus : Status for the fiel field. :: null,'selected','invalid','uploading','success','error' // null: if no file selected,
	 * 						'selected': if file a valid file selected, 'uploading' when ajax for upload start, 'success': if upload complete
	 * 						 with succes, 'error': if any error occur.
	 * 
	 */
	.directive('jdUploadFile',function(){
		return {
			restrict: 'E',
	        transclude: true,
	        replace: true,
	        scope: true,
			controller: 'SellerAdmin.Common.Controller.UploadFile',
			templateUrl:Manager.getFilePath('/directive/uploadFile.htm'),
			link: function($scope, element, attrs){
				var options = $scope.$parent[attrs.uploadOptions];
				$scope.initialize(options);
			}
		};
	})
	
	.directive('jdWebQuantity', ['$timeout', function ($timeout) {
		return {
			link: function ($scope, element, attrs) {
				var $element = $(element);
				$timeout(function(){
					var intRange = attrs.intRange ? attrs.intRange : 6,
						decimalRange = 2,
						totalLength = intRange+decimalRange+1,
						isShiftPressed = false,
						allowNegative = attrs.allowNegative;
					
					if(allowNegative){
						allowNegative = true;
						totalLength +=1;
					}
						
					$element.on("keydown",function(event){
						var keyCode = event.which?event.which:event.keyCode;
						if(keyCode == 16){
							isShiftPressed = true;
						}
					});
					
					$element.on("keypress",function(event){
						var charCode = (event.which) ? event.which : event.keyCode,
							strValue = $(event.target).val(),
							indexOfMinus =  strValue.indexOf('-'),
							indexOfDecimalPoint =  strValue.indexOf('.'),
							arraySplit = strValue.split("."),
							integerLength = arraySplit[0].length,
							decimalLength = arraySplit[1]?arraySplit[1].length:0,
							allowNegative = attrs.allowNegative;
							
							if(!isShiftPressed && (charCode == 37 || charCode == 39)){
								return true;
							}
							
							if ((charCode != 45 || strValue.indexOf('-') != -1 || allowNegative != "true") && charCode != 8 && charCode !=9 && (charCode != 46 || 
							
							strValue.indexOf('.') != -1) && (charCode < 48 || charCode > 57)){
								return false;
							}
							   
							if(strValue.length > totalLength || integerLength > (intRange + 1) || decimalLength > decimalRange){
								return false;
							}
						
					});
					$element.on("keyup",function(evt){
						var strValue = $(element).val(),
							array = strValue.split("."),
							strInt = array[0],
							strDecimal = typeof array[1] !== 'undefined' ?("." + array[1]):"",
							newValue = "",
							intMaxLength = intRange,
							floatMaxLength = decimalRange + 1;
						
						var keyCode = evt.which?evt.which:evt.keyCode;
						if(keyCode == 16){
							isShiftPressed = false;
						}
							
						strDecimal = strDecimal.replace("-","");
						if(strInt.indexOf("-") > 0){
							strInt = strInt.replace("-","");
						}
						else if(strInt.indexOf("-") == 0){
							intMaxLength += 1;
						}
						strInt = strInt.substr(0,intMaxLength);
						strDecimal = strDecimal.substr(0,floatMaxLength);
						newValue = strInt + strDecimal;

						if(newValue !== strValue){
							$element.val(newValue);
							$timeout(function() {
							  $element.trigger('input');
							}, 0);
						}
					}); 
				},0,false);			
			}
		};
	}])
	//directive to limit persentage value
	//if only integer values are required add a attribute noDecimal="true"
	.directive('jdPercentage' ,['$timeout',function($timeout){
		return {
			link: function ($scope, element, attrs) {
				$timeout(function(){
				element.on("keyup",function(evt){
					// Todo need to refactor it
					var elementValue = $(element).val(),
					noDecimal = attrs.noDecimal?true:false,
					elementVal = elementValue.split('.'),
					str1 = parseInt(elementVal[0])?parseInt(elementVal[0]):0;
					str1 = str1 > 100? parseInt(str1/10) :str1;
					var result = str1;
					if(!noDecimal && elementVal[1]){
						var str2 = parseInt(elementVal[1]) || parseInt(elementVal[1])==0?parseInt(elementVal[1]):'';
						str2 = str2 > 99? parseInt(str2/10) :str2;
						result = result +"."+ str2;
					}
					if(elementValue != result){
						$(element).val(result);
						$timeout(function() {
							  element.trigger('input');
		                    }, 0);
					}
				});
				},0,false);
			}
		};
	}])
	//directive to limit persentage value
	//if only integer values are required add a attribute noDecimal="true"
	.directive('jdWebBarcode' ,['$timeout',function($timeout){
		return {
			link: function ($scope, element, attrs) {
				
                            element.on("blur",function(evt){
                                var mBarcode = $(element).val();
                                var rbarcode = '';
                                var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;
//                                mBarcode.substring(0, 1).replace(/[*]/g, "");
//                                console.log(mBarcode);.replace(/[*]/g, "")
                                var fbarcode = mBarcode.replace(/^[-]*/, "");
                                rbarcode = fbarcode.replace(/[*]/g, "");
                                console.log(rbarcode);
                                $(element).val(rbarcode);
                            });
			}
		};
	}])
	.directive('jdDisableEvents', ['$timeout', function ($timeout) {
		return {
			link: function ($scope, element, attrs) {
				var eventLists = attrs.eventLists?attrs.eventLists:"cut copy paste";
				$timeout(function(){
					element.on(eventLists,function(event) {
						event.preventDefault();
					});
				},0,false);			
			}
		};
	}])
	.directive('jdPasteHandling',function($timeout){
		return{
			link: function($scope, element){
				var $element = $(element);
				$timeout(function() {
					$element.on("paste" , function(event){
						//var strValue = ""
					 	//$element.val(strValue).trigger("input");	
					 	var item = event.originalEvent.clipboardData.getData('Text');
							$element.val(item).trigger("input");
					});

					/*var item = event.clipboardData.items[0];
					item.getAsString(function (data) {
						$element.val(data);
					});*/
				},10,false);
			}
		};
	})
	.directive('jdTriggerEnter', ['$timeout', function ($timeout) {
		return {
			link: function ($scope, element, attrs) {
				element.on("keyup",function(event){
					var keyCode = event.which?event.which:event.keyCode;
					
					if(keyCode === 13){
						$(this).trigger("click");
					}
				
				});					
			}
		};
	}])
	.directive('jdInputmask', ['$timeout', function ($timeout) {
		return {
			link: function ($scope, element, attrs) {
				var type = attrs.optionType,
					$element = $(element);
				if(type === "date"){
					require(["jqueryInputMask"],function(){
						$(element).inputmask({mask: "99/99/9999","placeholder": "DD/MM/YYYY"});
					});
				}
				element.on("keyup",function(event){
					
				});
				handlePasteEvent($element);
			}
		};
	}])
	/**
		@directive jdTinymce: it creates text editor <div jd-tinymce options="options"></div>
		@params options{Object}
			templates(Object):pre difined custom templates.
			html(String): html to prefill in editor
			isReadonly(Boolean): to make editor readonly
			selector(String):css selector 
			hideImageButton{Boolean} set true to hide image functionality
			hideTemplateButton{Boolean} set true to hide Custom template functionality
			getContent{Function} return content for editor
			isEmpty{Function} return boolean is there is no content
			updateData{Function} updates editor with new data
		Example <div jd-tinymce options="editorOptions" class="editor compose-email"></div>
	*/
	.directive('jdTinymce', ['$timeout', function ($timeout) {
		return {
			link: function ($scope, element, attrs) {
				var data = $scope[attrs.options];
				require(["tinymce","addProduct"],function(){
					
					data.getContent = function(){
						return tinyMCE.activeEditor.getContent();
						
					}
					
					data.isEmpty = function(){
						return $(tinyMCE.activeEditor.getBody()).text().trim() == "";
					}
					
					data.updateData = function(){
						createEditor();
					}
					
					$timeout(function(){
						createEditor();
					},0,false);	
					function createEditor(){
						var selector = data.selector?data.selector:".editor",
							isReadonly = (typeof attrs.isReadonly !== "undefined")?attrs.isReadonly:data.isReadonly;
						tinymce.remove(selector);
						tinymceSetup(data.templates,data.html,isReadonly,data);
					}
				})		
			}
		};
	}])
	.directive('jdChart', ['$timeout', function (
		$timeout) {
		return {
			link: function ($scope, element, attrs) {
			$timeout(function () {
				
			var options = $scope[attrs.chartOptions];
			var $element = $(element);

			options.updateChart = function (data) {
				var strHtml = '<canvas style="height:250px;width:100% !important;max-width:100% !important;min-width:100% !important;"></canvas><div id="chartjs-tooltip"></div>';
				//$element.removeChildren();
				$element.html("");
				$element.html(strHtml);
				var objdata= options.data; 
				var labels;
				var dataarr=new Array();
				var arraydata = $.map(objdata, function(value, index) {
				    return [value];
				});
				dataarr = $.map(arraydata[0], function(value, index) {
				    return [value];
				});
				//console.log(dataarr);
				var maxval=Math.max.apply(Math,dataarr);
				var minval=Math.min.apply(Math,dataarr);
				
				var maxceil=Math.ceil (maxval / 10000) * 10000;
				if(maxceil == 0)
				{
					maxceil = 10000;
				}
				var step=maxceil/5;
				var startVal=0;
				if(minval<0){
					console.log("negative");
					var minceil=Math.floor (minval / 10000) * 10000;
					//console.log(minceil);
					var range=maxceil-minceil;
					step=range/5;
					startVal=minceil;

				}
				var labelsarr=options.labelsarr;
				var labtooltiparr=options.labtooltiparr;
			
				/*for custom tooltip*/
				Chart.defaults.global.customTooltips = function(tooltip) {

			        var tooltipEl = $element.find('#chartjs-tooltip');

			        if (!tooltip) {
			            tooltipEl.css({
			                opacity: 0
			            });
			            return;
			        }

			        tooltipEl.removeClass('above below');
			        tooltipEl.addClass(tooltip.yAlign);

			       
			        
			         var innerHtml = '';
			         var text=tooltip.text;
			         //console.log(tooltip);
			         var textarr=text.split(":");
			         var value=textarr['1'];
			         var valindex=dataarr.indexOf(parseInt(value));
					 var textlabel ="";
			         if(textarr['0'].trim()!=""){
			         	textlabel=text;
			         }else{
			         	textlabel=labtooltiparr[valindex]+':' + value;
			         }
			        	innerHtml += [
			        		'<div class="chartjs-tooltip-section">',
			        		'	<span class="chartjs-tooltip-value">'+textlabel+ '</span>',
			        		'</div>'
			        	].join('');
			        
			      
			  
			        tooltipEl.html(innerHtml);


			        tooltipEl.css({
			            opacity: 1,
			            left: tooltip.chart.canvas.offsetLeft + tooltip.x + 'px',
			            top: tooltip.chart.canvas.offsetTop + tooltip.y + 'px',
			            fontFamily: tooltip.fontFamily,
			            fontSize: tooltip.fontSize,
			            fontStyle: tooltip.fontStyle,
			        });
	    		};
	    /*end custom tol tip*/

			/*params*/
				var lineChartData = {
					labels : labelsarr,
					datasets : [
						{
							label: "Justdial",
							fillColor : "rgba(220,220,220,0.0)",
							strokeColor : "#4082c4",
							pointColor : "#fff",
							pointStrokeColor : "#4082c4",
							pointHighlightFill : "#fff",
							pointHighlightStroke : "#4082c4",
							data : dataarr,
						
						}
					]

				};
			/*initialization*/
				var ctx = element.find("canvas")[0].getContext("2d");
				var myLine = new Chart(ctx).Line(lineChartData, {
					responsive: false,
					scaleBeginAtZero: false,
					scaleShowHorizontalLines: true,
					scaleShowVerticalLines: false,
					scaleOverride: true,
					scaleSteps: 5,
					scaleStepWidth: step,
					scaleStartValue:startVal,
					scaleLineWidth: 1,
					scaleFontSize: 9,
					pointDotRadius : 2.5,
					pointDotStrokeWidth : 2,
					datasetStrokeWidth : 2,
					bezierCurve : false,
					pointHitDetectionRadius : 10,
					skipLabel:true

				});
			
			};
			$timeout(function(){
				options.updateChart();
			},200,false);
		},0);
		}
		};
	}])
	.directive('jdCustomSelectbox', function($timeout) {
	  return {
		restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
		controller: 'SellerAdmin.Common.Controller.UOMProductDropdown',
		templateUrl:Manager.getFilePath('/marketplace/static/templates/common/select-box.htm'),
		link: function($scope, element, attrs) {
		var options = $scope.$parent[attrs.options];
		  $scope.initialize(options,element);
		}
	  };
	})
	.directive('jdWebExpiryDate', function($timeout) {
	  return {
		restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
		controller: 'SellerAdmin.Common.Controller.ExpiryDate',
		templateUrl:Manager.getFilePath('/marketplace/static/templates/web/common/product-expiry.htm'),
		link: function($scope, element, attrs) {
			var options = $scope.$parent[attrs.options];
			$scope.initialize(options);
		}
	  };
	})
	/**
	 * Create compose sms functionality
	 * API is written in scripts/common/directive-controllers.js
	 * Callbacks will be urOptionsVariable.getData()
		* returns {object} with following keys
			* message {String} current somposed sms.
			* count {Number} sms count for the user.
			* isValidate {Boolean} return true if sms is valid.
	 * urOptionsVariable.resetData {function} to reset to its default selection
	 * urOptionsVariable.setData(options) {function} to set sms 
		* options{Object}
			* options.message will be your message you want to prefill.
	 * <jd-compose-sms options=""></jd-compose-sms>
	*/
	.directive('jdComposeSms', function($timeout) {
		var strHtml = "<div class='web-compose-sms' ng-class='{invalidsms:validSms == false}'><label class='control-label'>Compose SMS Message:</label><div ng-class='{jdReadonly:isReadonly}'><textarea ng-model='currentMessage' ng-change='updateCount()' ng-keyup='setCountOnKeyup($event)' class='form-control d-text-area'></textarea>"+
		"<div class='error-message' ng-show='validSms == false'>Please Compose SMS</div><div><span>Character Left: {{remainingCharacter}} </span> <span class='sms-count'>Sms Per Customer:  {{smsCount==0?1:smsCount}}</span> </div></div></div>"
	  return {
		restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
		controller: 'SellerAdmin.Common.Controller.ComposeSms', // scripts/common/directive-controllers.js
		template:strHtml,
		link: function($scope, element, attrs) {
			var options = $scope.$parent[attrs.options];
			$scope.initialize(options);
		}
	  };
	})
	/**
	 * Create product search(product name or barcode) functionality
	 * Create Product footer will be fixed
	 * API is written in scripts/web/common/search-product.js
	 * Callbacks will be urOptionsVariable.onSelect(options)
		* options{Object}
			* options.type type of selection (search by barcode or product name)
			* options.selectedProduct selected prodcut data
			* templateId{String} id of the template and template should be written in  '/marketplace/static/templates/web/common/product-search.htm' 
	 * urOptionsVariable.resetData {function} to reset to its default selection
	 * <jd-web-product-search options="options"></jd-web-product-search>
	 * options {Object}
	 * hideCreateProduct{Boolean}
	*/
	.directive('jdWebProductSearch', function($timeout) {
	  return {
		restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
			options:"=",
			type:"@"
		},
		controller: 'SellerAdmin.Common.Controller.ProductSearch',
		templateUrl:Manager.getFilePath('/marketplace/static/templates/web/common/product-search.htm'),
		link: function($scope, element, attrs) {
			$scope.initialize();
		}
	  };
	})

	/**
	  * Functionality to search products by barcode entered in the input field
	  * API is written in scripts/common/directive-controllers.js
	  * To be used as - <jd-product-search-by-barcode options="urOptionsVariable" global = "global"></jd-product-search-by-barcode>
	  * Here 'urOptionsVariable' is the object containing callback functions.
	  * Functions to be defined in 'urOptionsVariable' are-
	  	* onSelectProduct(data) - product available in data.selectedProduct
	  	* onError(type) - to set the focus on barcode input field
	  	* createProductFromBarcode(data) - this is to open 'create new product' modal. Barcode is available in data.searchTerm.
	  	* handleOnKeyDown(option) - define this function to handle any key functionality on input box. Call this function from
	  								input box passing $event on ng-keydown event.(This is an optional function)
		* setFocusToInput() - to set the variable to set focus on barcode field to true.(This is an optional function)
	  * The input box to enter barcode and the button to search products should be implemented as follows-
	    <input ng-model="urOptionsVariable.barcode ng-keydown = "urOptionsVariable.handleOnKeyDown($event)" ...>
	    <button ng-click="urOptionsVariable.searchProduct(); ..."></button>
	*/
	.directive('jdProductSearchByBarcode', function(){
		return {
			restrict: 'E',
			controller: 'SellerAdmin.Common.Controller.ProductSearchByBarcode',
			templateUrl:Manager.getFilePath('/marketplace/static/templates/web/common/product-search-by-barcode.htm'),
			scope: {
				options:"=",
				global: "="
			},
			link: function(scope, element, attrs) {		
			}
		}
	})
	/**
	 * Give the Two dates one Etarting date and one end date
	 * Attribute :-
	 * 			1)date-range-options - provide the object that being shaired among directive controller
	 * 			and parent controller.
	 * 			
	 * 			dateRangeOptions have tro method :- 1)onselect(data)	, 2)resetdates(data)
	 * 				1)onselect(data) - call back on change of any date.
	 * 					data - {startDate,endDate,errorMsg}
	 * 						Note - errorMsg is null if no error, To show hide error message, use this variable.
	 * 						
	 * 				2)resetdates(data) - for reseting data from parent controller.
	 * 					data = {maxDayDiffAllowed}	(maxDayDiffAllowed - max diff allowed in START and END date)
	 * 										
	 */
	.directive('jdWebDateRange', function($timeout) {
	  return {
		restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
		controller: 'SellerAdmin.Common.Controller.DateRange',
		templateUrl:Manager.getFilePath('/marketplace/static/templates/web/common/dateRange.htm'),
		link: function($scope, element, attrs) {
			var options = $scope.$parent[attrs.dateRangeOptions];
			$scope.initialize(options);
		}
	  };
	})
	.directive('jdWebDateSingle', function($timeout) {
	  return {
		restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
		controller: 'SellerAdmin.Common.Controller.DateRange',
		templateUrl:Manager.getFilePath('/marketplace/static/templates/web/common/singleDatePicker.htm'),
		link: function($scope, element, attrs) {
			var options = $scope.$parent[attrs.dateRangeOptions];
			$scope.initialize(options);
		}
	  };
	})
        
	.directive('jdSelectDate', function($timeout) {
	  return {
		restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
		controller: 'SellerAdmin.Common.Controller.SelectDate',
		templateUrl:Manager.getFilePath('/marketplace/static/templates/common/select-date.htm'),
		link: function($scope, element, attrs) {
		var options = $scope.$parent[attrs.options];
		  $scope.initialize(options);
		}
	  };
	})

	/*
	 * it will set the focus on the element if the value of the attribute jg-set-focus changes to true.
	 * eg :- <input jg-set-focus="abc" type="text">
	 * when abc is true focus will be set on that input tag.
	 */
	.directive('jdSetFocus', function($timeout) {
		  return {
		    link: function($scope, element, attrs) {
		      $scope.$watch(attrs.jdSetFocus, function(value) {
		        if(value === true) { 
		          $timeout(function() {
		            $(element).focus();
		            if(attrs.setFalse){
		            	$scope[attrs.jdSetFocus] = false;
		            }
		          },0);
		        }
		      });
		    }
		  };
		})
	.directive('jdScrollToBottom',function(){
		return{
			link:function($scope, element, attrs){
				$scope.$watch(attrs.jdScrollToBottom, function(value) {
					$(element).animate({scrollTop:$(element)[0].scrollHeight}, 1000);
				});
			}
		};
	})
		//directive for checkbox Indeterminate state, when attribute jdIndeterminate has value=true(boolean Type),
		// Indeterminate state will be set eg:- <input type="checkbox" jd-indeterminate="state.codIndeterminate">
		.directive('jdIndeterminate', function($timeout) {
		  return {
		    link: function($scope, element, attrs) {
		      $scope.$watch(attrs.jdIndeterminate, function(newValue) {
		    	 var varName = attrs.jdIndeterminate.split('.'),
		    	 	value1 ;
		    	  for(var i=0;i<varName.length;i++){
		    		  if(i==0){
						value1 =  $scope[varName[i]];
					  }
		    		  else{
						value1 = value1[varName[i]];
						}
		    	  }
		        	  element.prop("indeterminate",value1);
		      });
		    }
		  };
		})
		/*FOR SKU AND BARCODE TO STOP USER FROM ENTERING '{}[]() */
		.directive('jdSkuBarCode', ['$timeout', function ($timeout) {
			return {
				link: function ($scope, element, attrs) {
					$timeout(function(){
						element.on("keypress",function(evt){

							var charCode = (evt.which) ? evt.which : evt.keyCode

							if (charCode != 8 && charCode !=9 && (charCode != 95 && charCode != 45 && charCode != 46 && charCode != 47 && charCode != 92 && (charCode < 48 || charCode > 57) && (charCode < 97 || charCode > 	122)&& (charCode < 65 || charCode > 90))){
								return false;
							}
							return true;
						}); 
					},0,false);			
				}
			};
		}])
		
		
		/**
		 * highlight the search result key in search result.
		 * @searchKey attribute define the search key to be highlight in  result.
		 * @searchResult attribute define the result of search.
		 * @jdSearchHighlight attribute define the css class to be apply for highlight,
		 * if class not provide it use default class "searchHighlight"
		 * from the "/marketplace/static/styles/common/app.css" file.
		 *@highlightWatch if fields hide/shown rather than creation/removing, provide name of variable on which change in result depend.
		 * eg:- <div search-result="{{productName}}" search-key="{{searchKey}}" jd-search-highlight></div>
		 */
	.directive('jdSearchHighlight',function($timeout){
		return {
			scope:{
				jdSearchHighlight:"="
			},
			link: function(scope, element, attrs) {
				
				function highlight(){
					var newString = attrs.searchKey.replace(/\s\s+/g, ' ');
					if(newString && newString.indexOf("\\") > -1){
						newString = newString.replace(/\\/g, '');
					}
					
					var array = newString.split(" ");
					var textToMatch = attrs.searchResult;
					var reg = new RegExp(array.join("|"), "gi");
					var searchedItems = textToMatch.match(reg);
					var replacedItems = [];
					if(searchedItems){
						for(var i=0;i<searchedItems.length;i++){
							var curItem = searchedItems[i];
							if(curItem && replacedItems.indexOf(curItem) == -1){
								replacedItems.push(curItem);
								var reg = new RegExp(curItem, "gi")
								var textToMatch = textToMatch.replace(reg,function(a,b){
									return "@#$" + a + "$#@";
								});
							}
						}
						textToMatch = textToMatch.replace(/\@\#\$/g,"<span class='searchHighlight'>");
						textToMatch = textToMatch.replace(/\$\#\@/g,"</span>");
					}
					element.html(textToMatch);
				}
				
				if(typeof scope.jdSearchHighlight !== "undefined"){
					scope.$watch("jdSearchHighlight",function(){
						highlight();
					})
				}
				else{
					highlight();
				}
				
			}
		};
	})
	.directive('jdOrderStatus',function($timeout){
		
		return {
			restrict: 'E',
	        replace: true,
	        scope: {
				options:"=",
				type:"@"
			},
			link:function($scope, element, attrs){
				if($scope.options.indexOf('Paid') > -1 && $scope.options.indexOf('Fulfilled') > -1){
					$scope.options.splice($scope.options.indexOf('Paid'),1);
					$scope.options.splice($scope.options.indexOf('Fulfilled'),1);
					$scope.options.push('Completed');
				}
				var classes = {
					Completed:'paid-status-text'
				};
				var str = '',
					noOfStatus = $scope.options.length;
				$.each($scope.options,function(i){
					if(i && i+1 < noOfStatus){
						str += ", ";
					}else if(i && i+1 == noOfStatus){
						str += ' and ';
					}
					if($scope.type == 'dashboard'){						
						str += "<span class=\"warning-text "+classes[this]+"\">"+
							this+
						"</span>";						
					}
				});			
				element.html(str);
			}
		};
	})
	.directive('jdAutoPo',function($timeout){
		return {
			restrict: 'E',
	        transclude: true,
	        replace: true,
	        scope: {
				options:"=",
				onModalShow:"&",
				onModalHide:"&"
			},
			controller: 'SellerAdmin.Common.Controller.AutoPo',
			templateUrl:Manager.getFilePath('/marketplace/static/templates/web/common/autoPO.htm')
		};
	})
	.directive('jdCheckboxIndeterminate',function($timeout){
		return{
			restrict:'A',
			scope:{
				jdCheckboxIndeterminate:"="
			},
			link:function($scope, element, attrs){
				$scope.$watch("jdCheckboxIndeterminate",function(){
					if($scope.jdCheckboxIndeterminate){
						element.prop("indeterminate",true);
					}else{
						element.prop("indeterminate",false);
					}
				})
			}
		};
	})
	/*
	@directive jdCheckbox creates custom checkbox
	@param is-checked working same as ng-model
	@param jd-change working same as ng-change
	*/
	.directive('jdCheckbox',function(){
		return {
			replace:true,
			scope:{
				isChecked:"=",
				jdChange:"&"
			},
			template:"<label class='web-d-checkbox'><input ng-change='onChange()' ng-model='isChecked' type='checkbox'/><span class='icon-Checkmark selected-icon'></span><span class='unchecked-checkbox'></span></label>",
			link: function($scope, element, attrs){
				$scope.onChange = function(){
					if($scope.jdChange){
						$scope.jdChange()
					}
				}
			}
		}
	})
	/**
	 * Create jdMrpCity functionality for template supplier only
	 * API is written in scripts/common/directive-controllers.js
	 * Callbacks will be urOptionsVariable.getData()
		* returns {object} with following keys
			* data {Array} array of objextc in json stringify format.
			* validate {Boolean} return true if data is valid.
			* errorMsg {String} error message if error occure.
	 * urOptionsVariable.validate {function} to validate form
	 	*return {Object} with following keys
	 		*validate {Boolean} return true if data is valid.
	 		*errorMsg {String} error message if error occure.
	 * urOptionsVariable.selectedCities {Array} array of object(keys will be mrp and city) to prefill form.
	 * @hideErrorMessage to not show error message.  
	 * validationCalback {function} Callback on Validation if @hideErrorMessage is true.
	 	*called everry time on text field blur/option change if validation is already checked. 
	* <jd-mrp-city options="jdMrpCity"></jd-mrp-city>
	*/
	.directive('jdMrpCity', function($timeout) {
		
	  return {
		restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
			options:"=",
			onCityAdd:"&",
			hideErrorMessage:"@"
		},
		controller: 'SellerAdmin.Common.Controller.MrpCity', // scripts/common/directive-controllers.js
		templateUrl:Manager.getFilePath('/marketplace/static/templates/web/common/mrpCity.htm')
	  };
	})

	.directive('jdAddInventortTemplating', function($timeout) {
		
	  return {
		restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
			options:"=",
		},
		controller: 'SellerAdmin.Inventory.Controller.AddInventoryForTemplatUser', // scripts/common/directive-controllers.js
		templateUrl:'addInventoryForTemplateModal.htm' //in static/templates/common/directive-template.htm
	  };
	})
	
	.directive('jdEditInventortTemplating', function($timeout) {
		
	  return {
		restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
			options:"=",
		},
		controller: 'SellerAdmin.Inventory.Controller.editInventoryForTemplatUser', // scripts/common/directive-controllers.js
		templateUrl:'editInventoryForTemplateModal.htm' //in static/templates/common/directive-template.htm
	  };
	})
	
	.directive('jdSearchAutosuggest', function($timeout) {
		
	  return {
		restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
			options:"=",
		},
		controller: 'SellerAdmin.Common.Controller.SearchAutosuggest', //in  scripts/common/directive-controllers.js
		templateUrl:'directive/searchAutosuggest.htm' //in static/templates/common/directive-template.htm
	  };
	})
	
	.directive('jdSupplierSelection', function($timeout) {
		
	  return {
		restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
			options:"=",
		},
		controller: 'SellerAdmin.Common.Controller.SupplierSelection', //in  scripts/common/directive-controllers.js
		templateUrl:'directive/supplierSelection.htm' //in static/templates/common/directive-template.htm
	  };
	})
	
	.directive('jdSupplierSuggestions', function($timeout) {
		
	  return {
		restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
			options:"=",
			global:"="
		},
		controller: 'SellerAdmin.Common.Controller.SupplierSuggestions', // scripts/common/directive-controllers.js
		templateUrl:Manager.getFilePath('/marketplace/static/templates/web/common/supplierSuggestions.htm')
	  };
	})
	.factory('JdInfiniteScroll', function($http) {
		var JdInfiniteScroll = function(options) {
			this.items = [];
			this.busy = false;
			this.after = '';
			this.url = options.url;
			this.paramsData = options.data;
			this.key = options.pageNumberKey;
			this.$loaderElement = options.$loaderElement;
		};
		
		JdInfiniteScroll.prototype.update = function(data){
			this.items = [];
			this.busy = false;
			
			if(this.paramsData.pageNumber){
		  		this.paramsData.pageNumber =1;
			}
			else if(this.paramsData[this.key]){
				this.paramsData[this.key] =1;
			}
			else{
				this.paramsData.currentpage =1;
			}
			
			this.paramsData = $.extend(this.paramsData,data);
			this.nextPage(true);
		};
		
		// this function will be called on scroll
		JdInfiniteScroll.prototype.nextPage = function(resetItems) {
			if (this.busy)return;
			this.busy = true;
			
			var url = this.url + "?",
				counter = 0;
			for(var key in this.paramsData){
				if(counter !== 0){
					url += "&";
				}
				url +=  key + "=" + this.paramsData[key]; 
				counter ++;
			}
			var configOptions = {
				url:url,
				method:"GET"
			};
			
			if(this.$loaderElement){
				configOptions.$loader = this.$loaderElement;
			}
			
			$http(configOptions).success(function(data,strStatus,strFun,config) {
			  var items = null;
			  if(resetItems){
				this.items = [];
			  }
			  if(data.results){
				  items = data.results;
			  }
			  else if(data.data && data.data.results){
			  	items = data.data.results;
			  }
			  else{
				  items = data;
			  }
			  for (var i = 0; i < items.length; i++) {
				this.items.push(items[i]);
			  }
			  if(this.paramsData.pageNumber){
			  	this.paramsData.pageNumber +=1;
				}
				else if(this.paramsData[this.key]){
					this.paramsData[this.key] +=1;
				}
				else{
					this.paramsData.currentpage +=1;
				}
			  if(items.length > 0 ){
				this.busy = false;
			  }
			  if(this.onSuccess){
			  	this.onSuccess(data,resetItems,config);
			  }
			}.bind(this));

		};
		return JdInfiniteScroll;
	})
	
	.filter('jdRoundit', function() {
	  return function(input) {
		 
		 return Utills.Math.roundIt(input);
	  };
	})
	.filter('jdRange', function() {
	  return function(input, total) {
		total = parseInt(total);
		for (var i=0; i<total; i++){
		  input.push(i);
		}
		return input;
	  };
	})
	.filter('jdReplaceCharacters', function() {
	  return function(input,oldVal,newVal) {
	  	if(input){
	  		var regEx = new RegExp(oldVal,"g");	
	  		input = input.replace(regEx,newVal)
	  	}
		return input;
	  };
	})
	.filter('jdDate' ,function (){
	  return function(value){
		 
		  var month = new Array();
			 month[0] = "Jan";
			 month[1] = "Feb";
			 month[2] = "Mar";
			 month[3] = "Apr";
			 month[4] = "May";
			 month[5] = "Jun";
			 month[6] = "Jul";
			 month[7] = "Aug";
			 month[8] = "Sep";
			 month[9] = "Oct";
			 month[10] = "Nov";
			 month[11] = "Dec"; 
			 
			 var newDateStr = "";
			 if(value){
				var dateString = value.split("T")[0];
				newDateStr =	dateString.split("-")[2]+" "+month[dateString.split("-")[1]-1]+" "+dateString.split("-")[0];
			 }
			 
			 return  newDateStr;
	  };	
	})
	.filter('jdTime' , function (){
		return function(value){
			 if(value){
			 	 var timeString = value.split("T")[1];
				 var H = +timeString.substr(0, 2);
				 var h = (H % 12) || 12;
				 var ampm = H < 12 ? "AM" : "PM";
				 timeString = h + timeString.substr(2, 3) +" "+ ampm;
				 return timeString;
			 }
			
		};
	})
	/**
	 * filter for quantity.
	 * take Unit Of MeasurMent as paramenter.
	 * for UOM in ('pc', 'pkt', 'pr') it return integer.
	 * for all other type of UOM ot return fix 3 decimal place value.
	 * eg:- {{10.2 | jdQuantity:'kg').
	 */
	.filter('jdQuantity' , function(){
		return function(value,uom,pakageType,contentPerPiece){
			if(isNaN(Number(value))) {
			      return value;
			}else{
				if(pakageType && pakageType == 'BOTH' && contentPerPiece){
					return parseInt(value/contentPerPiece);
				}else if(uom == 'pc' || uom == 'pkt' || uom == 'pr'){
					return parseInt(value);
				}else{
					return Number(value).toFixed(3);
				}
			}
		};
	})

	.filter('jdImageSource',function(){
		return function(value){
			if(Manager.isPosoffline()){
				return "/marketplace/static/pos/images/"+value;
			}
			else{
				return "/marketplace/static/images/"+value;
			}
		}
	})

	.directive('jdInfiniteScroll', [ '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
		return {
			link: function(scope, element, attrs) {
				$(element).on("scroll",function(){
					var scrollTop = $(this).scrollTop();
					if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight){
						if(scope[attrs.options] && scope[attrs.options].nextPage){
						   scope[attrs.options].nextPage();
						}
					}
				});
			}
		};
	}
	])
	.directive('jdAutosuggest1', function($timeout) {
		return {
			link: function(scope, element, attrs) {
				var $element = $(element),
					parentHolder = attrs.jdAutosuggest1,
					liSelected = null,
					options = scope[attrs.options];
				var getNextElement = function($all,$element,isPrev){
					var index = $all.index($element),
						newElemnt = [];
					if(isPrev && (index - 1) >= 0 ){
						newElemnt = $all.eq(index-1);
					}else if(!isPrev){
						newElemnt = $all.eq(index+1);
					}
					return newElemnt;
				};
				if(options){
					options.setItemSelected = function(index){
						if($element.hasClass("jd-open")) {
							var $parent = $element.find(".jd-autosuggest"),
								li = $element.find("." + parentHolder + " li");
							li.removeClass('jd-li-hover');
							liSelected = li.eq(index).addClass('jd-li-hover');
							if (index == 0) {
								$element.find(".jd-autosuggest").scrollTop(0);
							};
						}
					}
					options.getItemSelected = function(){
						var $all = $element.find("."+parentHolder+" li");
						var index = $all.index(liSelected);
						return index;
					}
				}
				$element.find(".form-control").on("keydown",function(event){
					if(event.keyCode == 38){
						event.preventDefault();
					}
				})
				
				$element.on("keydown",function(event){
					var keyCode = event.keyCode,
						$parent = $element.find(".jd-autosuggest"),
						li = $element.find("."+parentHolder+" li"),
						length = li.length,
						next = null,
						parentOffset = 0,
						childOffset = 0;
		
                            if (keyCode === 40) {// down key
                                if (liSelected) {
                                    liSelected.removeClass('jd-li-hover');
                                    next = getNextElement(li,liSelected);
                                    if (next.length > 0) {
                                        liSelected = next.addClass('jd-li-hover');
                                    } else {
                                        liSelected = li.last().addClass('jd-li-hover');
                                    }
                                } else {
                                    liSelected = li.eq(0).addClass('jd-li-hover');
                                }
                            }
					
					if(keyCode === 38){ // up key
						if(liSelected){
				            liSelected.removeClass('jd-li-hover');
				            next = getNextElement(li,liSelected,true);
				            if(next.length > 0){
				                liSelected = next.addClass('jd-li-hover');
				            }else{
				                liSelected = li.eq(0).addClass('jd-li-hover');
				            }
				        }else{
				            liSelected =  li.eq(0).addClass('jd-li-hover');
				        }
					}
					
					if((keyCode === 38 || keyCode === 40) && length > 0){
						var parent = $parent,
							parentOffset = parent.offset().top + parent.height(),
							childOffset = liSelected.offset().top + liSelected.height(),
							scrollTop = parent.scrollTop();

						parent.scrollTop(scrollTop+childOffset-parentOffset);
					}
		
				});
				
				$element.on("keyup",function(event){
					var keyCode = event.keyCode,
						$all = $element.find("."+parentHolder+" li");

					if(keyCode === 13 && liSelected){
						var index = $all.index(liSelected);
						$timeout(function(){
							$all.eq(index).trigger("click");
						},0);
					}
					if(keyCode !== 38 && keyCode !== 40){
						liSelected = null;
						$all.removeClass("jd-li-hover");
						if(options && options.defaultIndex != undefined){
							options.setItemSelected(options.defaultIndex);
						}
					}
				});
			}
		};
	})
	.directive('jdAutosuggest', function($timeout) {
		return {
			scope:{
				doNotReset:"@",
				options:"="
			},
			link: function(scope, element, attrs) {
				var $element = $(element),
					liSelected = null,
					options = scope.options,
					addPadding = attrs.addPadding?Number(attrs.addPadding):0;
				var getNextElement = function($element,isPrev){
					var newElemnt = isPrev?$element.prev():$element.next();

					if(newElemnt.is("label")){
						newElemnt = getNextElement(newElemnt,isPrev);
					}

					return newElemnt;
				};

				$element.find(".form-control").on("keydown",function(event){
					if(event.keyCode == 38){
						event.preventDefault();
					}
				})
				
				if(options){
					options.setItemSelected = function(index){
						var $parent = $element.find(".jd-autosuggest"),
						li = $parent.find("li");
						li.removeClass('jd-li-hover');
						liSelected = li.eq(index).addClass('jd-li-hover');
						if (index == 0) {
							$element.find(".jd-autosuggest").scrollTop(0);
						};						
					}
					options.getItemSelected = function(){
						var $all = $element.find("li");
						var index = $all.index(liSelected);
						return index;
					}
				}

				$element.on("keydown",function(event){
					var keyCode = event.keyCode,
						$parent = $element.find(".jd-autosuggest"),
						li = $parent.find("li"),
						length = li.length,
						next = null,
						parentOffset = 0,
						childOffset = 0;
		
                            if (keyCode === 40) {// down key
                                if (liSelected) {
                                    liSelected.removeClass('jd-li-hover');
                                    next = getNextElement(liSelected);
                                    if (next.length > 0) {
                                        liSelected = next.addClass('jd-li-hover');
                                    } else {
                                        liSelected = li.last().addClass('jd-li-hover');
                                    }
                                } else {
                                    liSelected = li.eq(0).addClass('jd-li-hover');
                                }
                            }
					
					if(keyCode === 38){ // up key
						if(liSelected){
				            liSelected.removeClass('jd-li-hover');
				            next = getNextElement(liSelected,true);
				            if(next.length > 0){
				                liSelected = next.addClass('jd-li-hover');
				            }else{
				                liSelected = li.eq(0).addClass('jd-li-hover');
				            }
				        }else{
				            liSelected =  li.eq(0).addClass('jd-li-hover');
				        }
					}
					
					if((keyCode === 38 || keyCode === 40) && length > 0){
						var parent = $parent,
							parentOffset = parent.offset().top + parent.height(),
							childOffset = liSelected.offset().top + liSelected.height(),
							scrollTop = parent.scrollTop() + addPadding;

						parent.scrollTop(scrollTop+childOffset-parentOffset);
					}
				});
				$element.on("keyup",function(event){
					var keyCode = event.keyCode,
						$all = $element.find("li");

					if(keyCode === 13 && liSelected){
						//$scope.onSelectUnit($scope.options[]);
						var index = $all.index(liSelected);
						$timeout(function(){
							$all.eq(index).trigger("click");
						},0);
					}
					else if(keyCode === 13){
						if(options && options.enterTriggered){
							options.enterTriggered({key:"Enter"});
						}
					}
					if(keyCode !== 38 && keyCode !== 40 && scope.doNotReset != "true"){
						liSelected = null;
						$all.removeClass("jd-li-hover");
					}
					
					if(options && options.setSelectedIndex){
						var index = $all.index(liSelected);
						options.setSelectedIndex(index);
					}
				});
			}
		};
	})
	.directive('jdInputTypeNumber',  function($rootScope, $window, $timeout) {
		return {
			link: function(scope, element, attrs) {
				var $element = $(element);
				
				$element.on("keydown",function(event){
					var charCode = event.keyCode;
					
					if(charCode === 38 || charCode === 40){
						var curValue = Number($element.val())
						if($element.val() !== ""){
							curValue = (charCode === 38)? (curValue + 1):(curValue - 1);
						}
						$element.val(curValue).trigger("input");
					}
				
				});
			}
		};
	})
	.directive('jdSetTarget',function(){
		return {
			link: function(scope, element, attrs) {
				if(attrs.jdSetTarget === "_blank"){
					$(element).attr("target","_blank");
				}
			}
		};
	})
	.directive('jdPayBills',function(){
		return {
			restrict:"E",
			replace:true,
			templateUrl:"/marketplace/static/templates/web/common/payBills.htm",
			scope:{
				options:"="
			},
			controller:"SellerAdmin.Controller.payBillsController"
		};
	})

	.directive('jdKeyboardNavigation',  function($rootScope, $window, $timeout) {
		return {
			link: function(scope, element, attrs) {
				var $element = $(element),
					strKeyType = attrs.jdKeyboardNavigation,
					nextKey = attrs.nextKey,
					prvKey = attrs.nextKey;
				$element.on("keyup",function(event){
					var charCode = event.keyCode;
					
					if(charCode === 40){
						setFocus('next');
					}
					else if(charCode === 38){
						setFocus();
					}
					
					function setFocus(type){
						var $all = $('*[tabindex]:visible');
						var index = $all.index($element);
						var newIndex = type == 'next'?index+1:index-1;
						var $ele = $all.eq(newIndex);
						if($ele[0]){
							$ele.focus();
						}
						event.preventDefault();
					}
				});
			}
		};
	})
	.directive('jdArrowKeyNavigation',  function($rootScope, $window, $timeout) {
		return {
			link: function(scope, element, attrs) {
				var currentIndex = 0,
					$element = $(element),
					$parent = $element.parent(),
					options = scope[attrs.options],
					keyDownPressed = false,
					mousePosition = {
						x:0,
						y:0
					},
					mouseOver = false;
				
				options.setNewIndex = function(index){
					currentIndex = index+1;
				}
				options.onMouseover = function(event){
					if((event.clientX !== mousePosition.x || event.clientY !== mousePosition.y) && keyDownPressed == false){
						var $all = $parent.find(".jd-search-item"),
							$current = $(event.currentTarget);
						$all.removeClass("jd-scroll-hover");
						$current.addClass("jd-scroll-hover");
						
						options.setNewIndex($all.index($current));
						mouseOver = true;
					}
					else{
						mouseOver = false;
					}
					mousePosition = {
						x:event.clientX,
						y:event.clientY
					};
				};
				options.onMouseout = function(event){
					if(mouseOver === true){
						$parent.find(".jd-search-item").removeClass("jd-scroll-hover");
					}
				};
				
				if(scope[attrs.jdArrowKeyNavigation]){

					scope[attrs.jdArrowKeyNavigation].resetScroll = function(){
						$parent.find(".jd-search-scroll").scrollTop(1);
					};

				}
				
				$element.on("keypress",function(event){
					
					var charCode = event.keyCode,
						strValue =$parent.find("input[type=text]").val();
					if(event.keyCode == 13 && currentIndex !== null){
						scope[attrs.jdArrowKeyNavigation](currentIndex,true);
						currentIndex = null;
						scope.$apply();
					}
					if(charCode != 37 && charCode != 38 &&charCode != 39 &&charCode != 40){
						currentIndex = null;
						$parent.find(".jd-search-item").removeClass("jd-scroll-hover");
					}

				});
				
				$element.on("keydown",function(event){
					keyDownPressed = true;
					
					var keyCode = event.keyCode,
						length = $parent.find(".jd-search-item").length-1;
					if(length>=0){
						if(keyCode === 40){// down key
							currentIndex = currentIndex== null?-1:currentIndex;
							currentIndex = currentIndex >= length ? 0 :(currentIndex+1);
						}
						if(keyCode === 38){ // up key
							currentIndex = currentIndex== null?0:currentIndex;
							currentIndex = currentIndex == 0 ? length:(currentIndex-1);
						}
						if(keyCode === 38 || keyCode === 40){
							handleSlide(currentIndex);
						}    
					}
					
				});
				$element.on("keyup",function(event){
					keyDownPressed = false;
				});
				var handleSlide = function(index){
					var $allItem = $parent.find(".jd-search-item"),
						$currentSelectedItem = $allItem.eq(index),
						$scrollElement = $parent.find(".jd-search-scroll"),
						offsetTop = $currentSelectedItem[0].offsetTop,
						upperBound = $scrollElement.scrollTop(),
						maxHeight = parseInt($scrollElement.css("max-height")),
						height = $currentSelectedItem.outerHeight(),
						lowerBound = upperBound + maxHeight - height;
					
					$allItem.removeClass("jd-scroll-hover");
					$currentSelectedItem.addClass("jd-scroll-hover");
					$scrollElement.scrollTop(height*index);
					 // if (offsetTop < upperBound) {
						// $scrollElement.scrollTop(offsetTop);
					// } else if (offsetTop > lowerBound) {
						// $scrollElement.scrollTop(offsetTop - maxHeight + height);
					// }
					// else{
						// $scrollElement.scrollTop(0);
					// }
					scope[attrs.jdArrowKeyNavigation](currentIndex);
				};
			}
		};
	})
        
	.directive('inputTokenField', ['$timeout', function ($timeout) {
	    return {
	        link: function ($scope, element, attrs) {
				 $timeout(function () {
					
					var options = {
						tokens:$scope.tokens,
						beautify:true,
						inputType:'text',
						createTokensOnBlur:true,
						showAutocompleteOnFocus: true,
						showEditIcon:false,
						hideAllIconsInEdit:false
					},
					strPlaceHolder = "Enter each field separated by comma";
					if(attrs.placeholder){
						strPlaceHolder = attrs.placeholder;
					}
					if(attrs.handleOnEdit == "true" && $scope.tokens.length > 0 ){
						if(attrs.tokentype === 'Dropdown' || attrs.tokentype === 'TextBoxAutosuggest'){
							options.hideAllIconsInEdit = true;
						}
						else{
							options.showEditIcon = true;
						}
					}
					
					if(attrs.tokentype === 'Dropdown' || attrs.tokentype === 'TextBoxAutosuggest'){
						options.autocomplete= {
							source: $scope.getAutoCompleteData(),
							appendTo:element.parent()
						};
						
					}
					element.tokenfield(options)
					.on('tokenfield:edittoken', function (e) {
						return false;
					})
					.on('tokenfield:createtoken', function (e) {
						var tokens = $scope.varientTokens,
							currentToken = e.attrs.value,
							isValidate = $scope.validateToken(currentToken);
						return isValidate;
					})
					.on('tokenfield:createdtoken', function (e) {
						$scope.addToken(e.attrs.value);
						
						$timeout(function () {
							//element.parent().find('.ui-autocomplete-input').focus();
							updateAutocomplete();
						}, 0, false);
					})
					.on('tokenfield:edittokenclicked', function (e) {
						$scope.handleOnTokenEditClick(e.attrs);
					})
					.on('tokenfield:removetoken', function (e) {
						if($scope.allowToRemoveToken){
							var allow = $scope.allowToRemoveToken(e.attrs);
							if(allow === false){
								return false;
							}
						}
					})
					.on('tokenfield:removedtoken', function (e) {
						if(typeof e.attrs.value !== 'undefined'){
							$scope.removeToken(e.attrs.value);
						}
						else{
							$.each(e.attrs,function(){
								$scope.removeToken(this.value);
							});
						}
					
						
						$timeout(function () {
							updateAutocomplete();
						}, 0, false);
					})
					.parent().find('.ui-autocomplete-input').on('keydown',function(event){
						if(attrs.tokentype === 'Dropdown'){
							var charCode = (event.which) ? event.which : event.keyCode,
								strToken = $(this).val();
							if(!((charCode >= 37 && charCode <= 40) || charCode == 8)){ 
								//$(event.target).focus();
								return false;
							}
							else if(strToken.length > 0 && charCode === 8){
								return false;
							}
						}
						
					});
					
					if(attrs.tokentype !== 'Dropdown'){
						element.parent().find('.token-input').on('blur',function(event){
							var strValue = $(event.target).val();
							if(strValue.trim() === "" && $scope.validateForRepeatation){
								$scope.validateForRepeatation(strValue);
								
							}
						}).on('keyup',function(event){
							if($scope.getLatestToken){
								$scope.getLatestToken($(this).val());
							}
						})
					}
					else{
						strPlaceHolder = "Select each field from drop down using arrow keys";
					}
					
					element.parent().find('.token-input').attr("placeHolder",strPlaceHolder).removeAttr("tabindex");
					element.parent().find('.token-input').removeAttr("tabindex");
					var updateAutocomplete = function(){
						if(attrs.tokentype === 'Dropdown' || attrs.tokentype === 'TextBoxAutosuggest'){
							element.parent().find('.ui-autocomplete-input').autocomplete({'source':$scope.getAutoCompleteData()}).focus();
							if($scope.triggerParent !== false ){
								element.parent().trigger('click');
							}
						}
					};
					$scope.setTokenField = function(data){
						var arr = data?data:[];
						$(element).tokenfield("setTokens",arr);
						updateAutocomplete();
					};
					if($scope.objTokenField){
						$scope.objTokenField.renameToken = function(options){
							$(element).tokenfield("renameToken",options);
						};
					}
					
					
					
				}, 0, false);
	        }
	    };
	}])

.directive('jdAdditionalMenus', function() {
        var strHtml =  "<div class='pull-left'>\n\
                        <button class='dropdown-toggle btn btn-default export-btn' ng-click='openExportPopup()'>"+
                    "<i class='icon-moremenu jd-color-inherit'></i>"+
                "</button>\n\
                <div class='export-import-popover popover order-details fade bottom in '  ng-class='{\"show\":showPopup}'>"+
                    "<div class='arrow'></div>"+
                    "<div class='popover-content'>"+
                        "<ul class='list-unstyled top-44 menu-list'>"+
                            "<li ng-repeat='item in setAdditionalMenus'  ng-class=\"{'underline':$index > 0}\"  ng-click='item.action()'>"+
                                "<a>"+
                                    "<i class='{{item.iconClass}}'></i> {{item.menuName}}</a>"+
                            "</li>"+
                        "</ul>"+
                    "</div>"+
                "</div></div>";

	return {
		restrict: 'E',
		replace:true,
		scope: true,
		template: strHtml,
                controller:function($scope){
                    $scope.openExportPopup = function(){
                        if($scope.showPopup){
                            $scope.showPopup = false;
                        }
                        else{
                            $scope.showPopup = true;
                        }
                    };
                     $scope.$on(App.Events.DOCUMENT_CLICK,function(event,data){
			var $event = $(data.target);
                         if(!($event.hasClass("export-btn") || $event.hasClass("icon-moremenu"))){
                            $scope.showPopup = false;
                        }
                    });
                    
                },
                link:function($scope, element){
                   
                }
	};
})

.directive('jdDropdownMenus',function(){
	var strHtml = "<li class='dropdown filterDropdown jd-dropdown-list'>"+
			"<a href='#' class='dropdown-toggle'><button type='button' class='btn btn-default txt-Blue dropdown-button'><span>{{selectedItem}}<i class='icon-arrow-down font14 txt-Blue' style='padding-left:5px; position:relative; top:1px;'></i></span></button></a>"+
			"<ul class='dropdown-menu'>"+
			"<span class='arrow top'></span>"+
			"<li class=\"item-container\" ng-class =\"{'menuSel':selectedIndex == $index}\" ng-repeat='item in parentOptions.items' ng-hide='item.isHidden'>"+
			"<a title={{item.dropdownName}} ng-click='onSelectDropDown($index)'>"+
			"<i class='icon-selected font14 marginR10'></i>{{item.dropdownName}}</a>"+
			"</li>"+
			"</ul></li>";
	return {
		restrict: 'E',
		replace:true,
		scope: true,
		template: strHtml,
		controller:function($scope){
			$scope.items = [];
			$scope.selectedItem = "";
			$scope.selectedIndex = 0;
			$scope.placeholderText = "";
			$scope.initialize = function(data){
				$scope.parentOptions = data;
				
				$scope.parentOptions.changeTab = function(index){
					$scope.onSelectDropDown(index);					
				}

				$scope.parentOptions.showHideItem = function (indexes) {
					$.each($scope.parentOptions.items,function(){
						this.isHidden = false;
					})
					if(typeof indexes != "undefined"){
						$.each(indexes,function(){
							$scope.parentOptions.items[this].isHidden = true;
						})
						
					}
				}
				
				$scope.parentOptions.updateDropDown = function(){
					var selectedIndex = $scope.parentOptions.defaultIndex?$scope.parentOptions.defaultIndex:0;
					$scope.selectedIndex = selectedIndex;
					$scope.selectedItem = $scope.parentOptions.items[selectedIndex].dropdownName;					
					$scope.onSelectDropDown(selectedIndex);
				}
				
				$scope.parentOptions.updateDropDown();
			};

			$scope.onSelectDropDown = function($index){
				$scope.selectedIndex = $index; 
				var item = $scope.parentOptions.items[$index];
				$scope.selectedItem = item.dropdownName;
				$scope.placeholderText = item.placeholderText;
				if($scope.parentOptions.onSelect){
					$scope.parentOptions.onSelect(item);
				}
			};

		},
		link:function($scope,element,attr){
			$scope.initialize($scope.$parent[attr.options]);
		}
	};
})

.directive('jdEnter', function () {
    return function (scope, element, attrs) {
        element.on("keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.jdEnter);
                });

                event.preventDefault();
            }
        });
    };
})
.directive('jdHelp', ['$route', function ($route) {
	 
	     return  {
			scope:{
				entityUrl: '@'
			}, 
	     restrict: 'E',
         template: "<a target= '_blank' href= http://manual.jdomni.com/{{entityUrl}}><div class='help-on-modal pull-right jd-font-roboto'><i class='icon-help_new help-sm-icon'></i><span class=help-txt>help</span></div></a>"
    };
 }])
/*
 * it will collapse if the value of the attribute jd-collapse changes to true.
 * eg :- <div jd-collapse="abc"></div>
 */
.directive('jdCollapse', function($timeout) {
  return {
	link: function($scope, element, attrs) {
		if(attrs.hideSection != undefined){
			$scope.$watch(attrs.hideSection, function(value) {
				if(value == true){
					$(element).addClass('hide');
				}
			});
		}
		
	  
	  $scope.$watchCollection(attrs.jdCollapse, function(value) {
		if(value === true) {
			$(element).removeClass('hide');
			$(element).collapse('show');
			if(attrs.hideSection){
				$scope[attrs.hideSection] = false;
			}
		}
		else{
		  $(element).collapse('hide');
		 
		}
	  });
	   
	}
  };
})
.directive('jdUploadImage',function($timeout){
		return {
			restrict: 'A',
	        transclude: true,
	        replace: true,
	        scope: true,
			controller: 'SellerAdmin.Products.Controller.VariantImage',
			templateUrl:'/marketplace/static/templates/web/common/upload-image.htm',
			link: function($scope, element, attrs){
				$timeout(function(){
					$scope.initializeController();
				},100);
			}
		};
	})

.directive('jdAccountSelectModal',function(){
	return{
		restrict: 'E',
		replace: true,
        scope: true,
		templateUrl:'/marketplace/static/templates/web/common/accountSelectModal.htm',
		controller:'SellerAdmin.Common.Controller.AccountSelectModal',
		link:function($scope,element,attr){
			var options = $scope.$parent[attr.options];
			$scope.initialize(options,$(element));
		}
	}
})

.directive('jdExpiryDateModal',function(){
	return{
		restrict: 'E',
		replace: true,
        scope: true,
		templateUrl:'/marketplace/static/templates/web/common/expiryDateModal.htm',
		controller:'SellerAdmin.Common.Controller.ExpiryDateModal',
		link:function($scope,element,attr){
			var options = $scope.$parent[attr.options];
			$scope.initialize(options,$(element));
		}
	}
})

.directive('ngBindHtmlUnsafe', [function() {
    return function(scope, element, attr) {
        element.addClass('ng-binding').data('$binding', attr.ngBindHtmlUnsafe);
        scope.$watch(attr.ngBindHtmlUnsafe, function ngBindHtmlUnsafeWatchAction(value) {
            element.html(value || '');
        });
    };
}])

.directive('jdFocus', function($timeout) {
    return function(scope, element, attr) {
    	if(JSON.parse(attr.jdFocus)){
    		$timeout(function(){
    			$(element).focus();
    		});
    		
    	}
    };
})

.filter('jdTimer' , function(){
		return function(value){
			if(isNaN(Number(value))) {
			      return value;
			}else{
				value = Math.abs(value);
				var time = '';
				var hour = parseInt(value/3600000);
				hour = hour<10?'0'+hour:hour;
				time = hour+':';
				var minuts = value%3600000;
				minuts = parseInt(minuts/60000);
				minuts = minuts<10?'0'+minuts:minuts;
				return time + minuts;
			}
		};
	})
/*
To use this directive use directive name as an attribute: <span jd-home-delivery-status="{{itemsList.deliveryDate}}"></span>
*/

.directive('jdHomeDeliveryStatus', function($interval,$rootScope){
	var strHtml = 	"<span>"+
						"<span ng-if='templateType == 1'>"+
							"<span ng-show='difference<0' style='color:#ea4940'><span class='jd-delivery-time-holder jd-delay-time-icon'></span> Delay Time - "+
								"<span ng-show='!daysDelay' class='jd-color-inherit'>{{timer}} mins</span>"+
								"<span ng-show='daysDelay' class='jd-color-inherit'>{{daysDelay}} Days</span></span>" +
					  		"<span style='color:#FF9900' ng-show='difference>0 && difference<1800000'><span class='jd-delivery-time-holder jd-pending-time-icon'></span> Pending Time - {{timer}} mins</span>"+
						"</span>"+
						"<span ng-if='templateType == 2'>"+
							"<span ng-show='difference<0' style='color:#ea4940'>Delayed - "+
								"<span ng-show='!daysDelay' class='jd-color-inherit'>{{timer}} mins</span>"+
								"<span ng-show='daysDelay' class='jd-color-inherit'>{{daysDelay}} Days</span></span>" +
					  		"<span style='color:#FF9900' ng-show='difference>0 && difference<1800000'>Pending - {{timer}} mins</span>"+
						"</span>"+
						"<span ng-if='templateType == 3'>"+
							"<span ng-show='difference<0' style='color:#ea4940'><i class=' icon-history jd-color-inherit jd-font-inherit'></i> Delay time - "+
								"<span ng-show='!daysDelay' class='jd-color-inherit'>{{timer}} mins</span>"+
								"<span ng-show='daysDelay' class='jd-color-inherit'>{{daysDelay}} Days</span></span>" +
					  		"<span style='color:#FF9900' ng-show='difference>0 && difference<1800000'><i class=' icon-history jd-color-inherit jd-font-inherit'></i> Pending Time - {{timer}} mins</span>"+
						"</span>"+
					"</span>";

	return{
		restrict:'A',
		replace: true,
		template: strHtml,
		scope: true,
		controller:function($scope,$rootScope,$timeout){
			
			var timeSlots = {
				day : 86400000
			},
				pendingTimeSlot = 30*60000;
			
			$scope.initialize = function(attrs){
				$scope.templateType = attrs.templatetype;
				if(attrs.jdHomeDeliveryStatus){
					$scope.currDate  = $rootScope.gCurrentServerDate;
					$scope.deliveryDate = Utills.Date.getDate(attrs.jdHomeDeliveryStatus);
					var difference = $scope.deliveryDate-$scope.currDate;
					$scope.difference = difference;
					$scope.daysDelay = 0;
					if(difference<=0){
						var daysDelays = parseInt(difference/timeSlots.day);
						if(daysDelays){
							$scope.daysDelay = -(daysDelays);
						}else{
							timerRunner();
						}
					}else{
						var delay = difference
						if(delay < timeSlots.day){
							delay = delay >pendingTimeSlot?delay - pendingTimeSlot:0;
							if(delay==0){
								timerRunner();
							}
							else{
								$timeout(function() {
									timerRunner();
								}, delay);
							}
						}
					}
				}
			}
			function timerRunner(){
				timeRunnerCalculater();
				$rootScope.$watch('gCurrentServerDate',function(value){
					timeRunnerCalculater();
				})
			}
			function timeRunnerCalculater(){
				$scope.difference = $scope.deliveryDate-$rootScope.gCurrentServerDate;
				var value = Math.abs($scope.difference),
					time = '',
					hour = parseInt(value/3600000);
				hour = hour<10?'0'+hour:hour;
				time = hour+':';
				var minuts = value%3600000;
				minuts = parseInt(minuts/60000);
				minuts = minuts<10?'0'+minuts:minuts;
				$scope.timer =  time + minuts;
			}
		},
		link:function($scope,element,attr){
			$scope.initialize(attr);
		}
	}
})
/*
@directive jdConfirmOrder is used to open confirm order modal
*/
.directive('jdConfirmOrder',function(){
	return {
		replace:true,
		scope:{
			options:"="
		},
		templateUrl:"/marketplace/static/templates/web/common/confirmOrderModal.htm",
		controller:"SellerAdmin.Common.Controller.ConfirmOrder"
	}
})
.directive('jdHideLeftMenu',function(JdCommonService,$timeout){
		return {
			priority: -1000,
			link: function($scope, element, attrs){
				var timer = attrs.time?attrs.time:1000;
				$timeout(function(){
					JdCommonService.hideLeftMenu();
				},timer);
			}
		}
})
/**
 * @@keyboardNavigation for keyboard navigation.
 * @soKeys comma seprated key names, first for moving forword second for backword (key name are used from App.keys (in initialize.js).
 * @soNxt id of next field.
 * @soPre id of previous field (if applied).
 * @soCallback function for callback (if applied).
 * @soInfo info for callback function.
 */
.directive('keyboardNavigation',function(){
		return {
			link: function($scope, element, attrs){
				var $element = $(element),
					keys = attrs.soKeys.split(','),
					keyNames = App.keyboardNavigation;//App.keyboardNavigation -> initialize.js.
				
				$element.on('keyup',function(event){
					var soInfo = attrs.soInfo;
					var keyCode = event.which?event.which:event.keyCode,
						keyName = keyNames[keyCode] ? keyNames[keyCode] : keyCode,
						nextId = attrs.soNxt,
						preId = attrs.soPre,
						keyCodeIndex = keys.indexOf(keyName);
					if(keyCodeIndex != -1){
						if(keyCodeIndex == 0){
							$('#'+nextId).focus();
						}else{
							$('#'+preId).focus();
						}
					}
					if(attrs.soCallback){
							var soCallback = $scope[attrs.soCallback]
								options = {key:keyName,soInfo:soInfo,nextId:nextId,event:event};
							$scope.$eval(soCallback(options));
					}
				});
				
			}
		};
	});   



	angular.module("/directive/uploadFile.htm", []).run(["$templateCache", function($templateCache) {
		  $templateCache.put("/directive/uploadFile.htm",
				  "<form id='fileUploadForm'>"+
					"<div>"+
						"<input type='hidden' id='formSupplierId' ng-model='supplierId' name='supplierId'/>"+
						"<div style='display:inline-block;vertical-align:top;'>"+
						"<button class='btn btn-primary' ng-click='selectAFile()' ng-disabled='parentOption.fileStatus==success'>Choose File</button>"+
						"<span style='margin-left:10px' ng-show='!filePath'>"+'No File Chosen'+
							"</span>"+
							"<input type='file' id='uploadeFile' accept='.csv' style='display:none' name='file' onchange='angular.element(this).scope().onSeletingFile()'>"+
						"</div>"+
						"<div style='display:inline-block;width:75%;margin-left:10px;word-wrap:break-word;'>"+
							'{{filePath}}'+
						"</div>"+
					"</div>"+
				"</form>");
		}]);
	
};
loadCommonDirectives();
