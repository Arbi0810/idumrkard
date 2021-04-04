jQuery(document).ready(function () {
    var holidays = restConfig.rest_holidays;
    var offdays = restConfig.rest_r_closedays;
    var cnt_closed_day = restConfig.rest_count_closed_day;
    var daywisetime = restConfig.rest_closing_daytime;
    var rest_opening_time;
    var rest_closing_time;
    var rest_date = new Date();
    
    var mind = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    var maxd = "+" + restConfig.rest_max_end_days;
    if(restConfig.rest_include_today == 1 ){
        mind = new Date();
        maxd = "+" + restConfig.rest_max_end_days - 1;
    }

    jQuery('#rest_booking_date').datepicker({
        dateFormat: restConfig.rest_date_format,
        minDate: mind,
        maxDate: maxd ,
        dialog: rest_date,
        onSelect: function (date) {
            
            jQuery('.table_selector').removeAttr('disabled');
            jQuery(this).parent().find('span.error').remove();
            var date = jQuery(this).datepicker('getDate');
            var selDay = date.getDay();

            if (cnt_closed_day == 0) {
                rest_opening_time = restConfig.rest_opening_time;
                rest_closing_time = restConfig.rest_closing_time;
            }
            else {
                rest_opening_time = daywisetime[selDay].rest_opening_time;
                rest_closing_time = daywisetime[selDay].rest_closing_time;
            }
 // console.log(restConfig.rest_opening_time);

            var selectedDate = new Date(date);
            var currentdate = new Date();
            var optimeHour = restConfig.rest_opening_time.split(':')[0];
            var optimeMinutes = restConfig.rest_opening_time.split(':')[1];

            var closeHour = rest_closing_time.split(':')[0];
            var closeMinutes = rest_closing_time.split(':')[1];
            if (selectedDate.getFullYear() == currentdate.getFullYear() && selectedDate.getDate() == currentdate.getDate() && selectedDate.getMonth() + 1 == currentdate.getMonth() + 1) {
				
				optimeMinutes = optimeMinutes.replace(' AM', '');
				optimeMinutes = optimeMinutes.replace(' PM', '');

                var openingtime = Date.parse(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate(), optimeHour, optimeMinutes, 0, 0));
                var closingtime = Date.parse(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate(), closeHour, closeMinutes, 0, 0));
                var currenttime = Date.parse(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate(), currentdate.getHours(), currentdate.getMinutes(), 0, 0));
                if (openingtime < currenttime) {
                    if (currentdate.getMinutes() >= restConfig.rest_time_interval) {
                        var i = parseInt(restConfig.rest_time_interval);  //10
                        var c = currentdate.getMinutes();  //31
                        var x = 1;
                        var j = i;
                        while (x < 60) {
                            if (j < c) {
                                j = j + i;
                            } else {
                                var n = j - c;
                                var o = c + n;
                                x = 61;
                            }
                        }
                        console.log(o);
                        rest_opening_time = currentdate.getHours() + ':' + o;
                    } else {
                        rest_opening_time = currentdate.getHours() + ':' + restConfig.rest_time_interval;
                    }
                }
            }
            if (currenttime > closingtime) {
                jQuery('.rest_book_closed_msg .rest_form_label').text('Sorry, Booking is closed for date: ' + jQuery(this).val()).fadeIn('slow');
                jQuery('.rest_book_closed_msg').fadeIn('slow');
            } else {
                jQuery('.rest_book_closed_msg').fadeOut('slow');
            }
if(restConfig.rest_time_format == 'hh:mm p'){
		                var maxtime_from_closing = subTimeToString(rest_closing_time, 0 ,parseInt(restConfig.rest_time_interval));
		            } else {
		                var maxtime_from_closing = subMinutesToTime(rest_closing_time,parseInt(restConfig.rest_time_interval));
	            }
	           
            jQuery('#rest_booking_time_from').timepicker('option', 'minTime', rest_opening_time);
            jQuery('#rest_booking_time_from').timepicker('option', 'maxTime', maxtime_from_closing);
            jQuery('#rest_booking_time_to').timepicker('option', 'maxTime', rest_closing_time);

        },
        beforeShowDay: function (date) {
            var datestring = jQuery.datepicker.formatDate('yy-mm-dd', date);
            var day = date.getDay();
            return [holidays.indexOf(datestring) == -1 && offdays.indexOf(day.toString()) == -1];
        }
    });

    jQuery('#rest_booking_time_from').timepicker({
        timeFormat: restConfig.rest_time_format,
        interval: restConfig.rest_time_interval,
		scrollbar: true,
        change: function (time) {
           /* var later = new Date(time.getTime() + (1.5 * 60 * 60 * 1000));
    jQuery('#rest_booking_time_to').timepicker('option', 'minTime', time);
    jQuery('#rest_booking_time_to').timepicker('setTime', later);*/
            if (jQuery('#rest_booking_date').val() == "" && jQuery(this).val() != "") {
                jQuery(this).val("");
                jQuery(this).parent().siblings('.rest_book_to_msg').html('<span class"rest_error_msg">' + ajaxObject.select_reservation_date + '</span>');
                jQuery('.rest_book_to_msg').fadeIn('slow');
                setTimeout(function () {
                    jQuery('.rest_book_to_msg').fadeOut('slow');
                }, '3000');
            } else if (jQuery(this).val() != "") {
                jQuery(this).parent().find('span.error').remove();
                jQuery('#rest_booking_time_to').val('');
                var booking_time_to = jQuery(this).val();
			                if(restConfig.rest_time_format == 'hh:mm p'){
			                    var mintime_from_closing = addTimeToString(booking_time_to, 0 ,parseInt(restConfig.rest_time_interval));
		                } else {
			                    var mintime_from_closing = addMinutesToTime(booking_time_to,parseInt(restConfig.rest_time_interval));
			                }
		                jQuery('#rest_booking_time_to').timepicker('option', 'minTime', mintime_from_closing);
                jQuery('#rest_booking_time_to').timepicker('option', 'maxTime', rest_closing_time);
            }
        }
    });
    
 jQuery('#rest_booking_time_from')
  .timepicker('option', 'change', function(time) {
        if(time !== null)
        {
            var later = new Date(time.getTime() + (1.5 * 60 * 60 * 1000));

            jQuery('#rest_booking_time_to').timepicker('option', 'minTime', time);
            jQuery('#rest_booking_time_to').timepicker('setTime', later);
            
        }
    });

	 function addTimeToString(timeString, addHours, addMinutes) {
			        if (addMinutes === undefined) {
			          addMinutes = 0;
			        }
			        var match = /(\d+):(\d+)\s+(\w+)/.exec(timeString),
			            hours = parseInt(match[1], 10) % 12,
			            minutes = parseInt(match[2], 10),
			            modifier = match[3].toLowerCase();
			        if (modifier[0] == 'p') {
			          hours += 12;
			        }
			        var newMinutes = (hours + addHours) * 60 + minutes + addMinutes,
			            newHours = Math.floor(newMinutes / 60) % 24;
			        newMinutes %= 60;
			        var newModifier = (newHours < 12 ? 'AM' : 'PM'),
			            hours12 = (newHours < 12 ? newHours : newHours % 12);
			        if (hours12 == 0) {
			          hours12 = 12;
			        }
			        var minuteString = (newMinutes >= 10 ? '' : '0') + newMinutes;
			        return z(hours12 + ':' + minuteString + ' ' + newModifier);
			        function z(n) {
			            return n;
			          }
			      }
			    function addMinutesToTime(time, minsAdd) {
			        function z(n){ return (n<10? '0':'') + n;};
			        var bits = time.split(':');
			        var mins = bits[0]*60 + +bits[1] + +minsAdd;
			        return z(mins%(24*60)/60 | 0) + ':' + z(mins%60);  
			    } 
			    function subMinutesToTime(time, minsAdd) {
			        function z(n){ return (n<10? '0':'') + n;};
			        var bits = time.split(':');
			        var mins = bits[0]*60 + +bits[1] - +minsAdd;
			        return z(mins%(24*60)/60 | 0) + ':' + z(mins%60);  
			    } 
			    function subTimeToString(timeString, subHours, subMinutes) {
			        if (subMinutes === undefined) {
			          subMinutes = 0;
			        }
			        var match = /(\d+):(\d+)\s+(\w+)/.exec(timeString),
			            hours = parseInt(match[1], 10) % 12,
			            minutes = parseInt(match[2], 10),
			            modifier = match[3].toLowerCase();
			        if (modifier[0] == 'p') {
			          hours += 12;
			        }
			        var newMinutes = (hours + subHours) * 60 + minutes - subMinutes,
			            newHours = Math.floor(newMinutes / 60) % 24;
			        newMinutes %= 60;
			        var newModifier = (newHours < 12 ? 'AM' : 'PM'),
			            hours12 = (newHours < 12 ? newHours : newHours % 12);
			        if (hours12 == 0) {
			          hours12 = 12;
			        }
			        var minuteString = (newMinutes >= 10 ? '' : '0') + newMinutes;
			        return z(hours12 + ':' + minuteString + ' ' + newModifier);
			        function z(n) {
			            return n;
			          }
			    }
	
    jQuery('#rest_booking_time_to').timepicker({
        timeFormat: restConfig.rest_time_format,
        interval: restConfig.rest_time_interval,
		scrollbar: true,
        change: function (time) {
            if (jQuery('#rest_booking_date').val() == "") {
                jQuery(this).parent().siblings('.rest_book_to_msg').html('<span class"rest_error_msg">' + ajaxObject.select_date_and_from_time + '</span>');
                jQuery('.rest_book_to_msg').fadeIn('slow');
                jQuery('#rest_booking_time_to').val("");
                setTimeout(function () {
                    jQuery('.rest_book_to_msg').fadeOut('slow');
                }, '3000');
            } else if (jQuery('#rest_booking_time_from').val() == "" && jQuery(this).val() != '') {
                jQuery(this).parent().siblings('.rest_book_to_msg').html('<span class"rest_error_msg">' + ajaxObject.select_from_time + '</span>');
                jQuery('.rest_book_to_msg').fadeIn('slow');
                jQuery('#rest_booking_time_to').val("");
                setTimeout(function () {
                    jQuery('.rest_book_to_msg').fadeOut('slow');
                }, '3000');
            } else if (jQuery('#rest_booking_date').val() != "" && jQuery('#rest_booking_time_from').val() != "" && jQuery('#rest_booking_time_to').val() != "") {
                jQuery(this).parent().find('span.error').remove();
                var date = jQuery('#rest_booking_date').val();
                var ftime = jQuery('#rest_booking_time_from').val();
                var ttime = jQuery('#rest_booking_time_to').val();
                var guestno = jQuery('#rest_number_guest').val();
                var chefguestno = jQuery('#rest_number_chef_guest').val();
                var data = {
                    action: 'rest_get_availability',
                    date: date,
                    ftime: ftime,
                    ttime: ttime,
                    guestno: guestno,
					chefguestno: chefguestno,
                };
                jQuery.post(ajaxObject.ajaxurl, data, function (response) {
                    jQuery('.rest_number_guest').parent('.rest_booking_field').children('span.error').fadeOut('slow');
					jQuery('.rest_number_chef_guest').parent('.rest_booking_field').children('span.error').fadeOut('slow');
                    jQuery('.rest_book_to_msg').html('<span class"rest_seat_msg">' + response + '</span>');
                    jQuery('.rest_book_to_msg').fadeIn('slow');
                    setTimeout(function () {
                        jQuery('.rest_book_to_msg').fadeOut('slow');
                    }, '3000');
                    jQuery('#test_result').html(response);
                });
            }
        }
    });




    jQuery('#rest_booking_time_from').attr('readOnly', 'true');
    jQuery('#rest_booking_time_to').attr('readOnly', 'true');
    jQuery('#rest_booking_date').attr('readOnly', 'true');
    jQuery('.numbersOnly').bind('keyup change', function () {
        this.value = this.value.replace(/[^0-9\.]/g, '');
        var $parentTag = jQuery(this).parent();
        $parentTag.find('span.error-alpha').remove();
        $parentTag.find('span.error-max').remove();
        $parentTag.find('span.error-min').remove();
        if (!jQuery.isNumeric(jQuery(this).val())) {
            jQuery(this).siblings('span.error').hide();
            $parentTag.addClass('error').append('<span class="error error-alpha">' + ajaxObject.allow_numbers + '</span>');
        } else {
            $parentTag.find('span.error-alpha').remove();
        }
        var max = parseInt(jQuery(this).attr('max'));
        var min = 2;
		
		
        if (parseInt(this.value) > max) 
		/*==added by deepika==*/
		{
            jQuery(this).siblings('span.error').hide();
            if(max ==  restConfig.rest_allow_max_guest)
            {
                $parentTag.addClass('error').append('<span class="error error-max">' + ajaxObject.maximum + ' ' + restConfig.rest_allow_max_guest + ' ' + ajaxObject.is_allowed + '</span>');
            }
			
            else if(max ==  restConfig.rest_allow_max_chef_guest)
            {
                $parentTag.addClass('error').append('<span class="error error-max">' + ajaxObject.maximum + ' ' + restConfig.rest_allow_max_chef_guest + ' ' + ajaxObject.is_allowed + '</span>');
            }

        } 
		/*==end==*/
		else {
            $parentTag.find('span.error-max').remove();
        }

        if (parseInt(this.value) < min) {
            jQuery(this).siblings('span.error').hide();
            $parentTag.addClass('error').append('<span class="error error-min">' + ajaxObject.maximum_one_guest + '</span>');
        } else {
            $parentTag.find('span.error-min').remove();
        }
    });


    jQuery('.required').change(function () {
        var inputVal = jQuery(this).val();
        var $parentTag = jQuery(this).parent();
        var liData = '<span class="error">' + ajaxObject.required_field + '</span>';
        if (inputVal == '') {
            $parentTag.find('span.error').remove();
            jQuery(liData).appendTo($parentTag).fadeIn('slow');
        } else {
            $parentTag.find('span.error').fadeOut('slow');
            $parentTag.find('span.error').remove();
        }
    });



    jQuery('.restBooknow').click(function (e) {
        var $formId = jQuery(this).parents('form');
        var formAction = $formId.attr('action');
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        // jQuery('li', $formId).removeClass('error');
        jQuery('span.error').remove();
        jQuery('.required', $formId).each(function () {
            var inputVal = jQuery(this).val();
            var $parentTag = jQuery(this).parent();
            if (inputVal == '') {
                $parentTag.addClass('error').append('<span class="error">' + ajaxObject.required_field + '</span>');
            }
            if (jQuery(this).hasClass('email') == true) {
                if (!emailReg.test(inputVal)) {
                    $parentTag.addClass('error').append('<span class="error">' + ajaxObject.enter_valid_email + '</span>');
                }
            }
            var min = 2;
            if (jQuery(this).hasClass('numbersOnly') == true) {
                if (parseInt(this.value) < min) {
                    $parentTag.addClass('error').append('<span class="error error-min">' + ajaxObject.maximum_one_guest + '</span>');
                }
            }
            if (jQuery(this).hasClass('phonevalidate') == true && jQuery(this).val() != '') {
                if (validatePhone(jQuery(this).val()) === false) {
                    $parentTag.addClass('error').append('<span class="error error-min">' + ajaxObject.phone_not_valid + '</span>');
                }
            }
        });
        
        //enable
        jQuery(".submit-loader").show();

        if (jQuery('span.error').length == "0") {
            //jQuery('.restBooknow').prop('disabled', true);
            var formData = jQuery('.restbookFrm').serialize();
            var data = {
                action: 'rest_save_booking',
                restData: formData
            };
            jQuery.post(ajaxObject.ajaxurl, data, function (response) {
                var result = JSON.parse(response);
                if (typeof grecaptcha != "undefined") {
                    grecaptcha.reset();
                }
                if (result.flag !== false) {
                    jQuery('#test_result').fadeIn('slow');
                    jQuery('#test_result').html('<span class="success">' + result.msg + '</span>');
                    setTimeout(function () {
                        jQuery('#test_result').fadeOut('slow');
                    }, '3000');
                    jQuery('.restbookFrm').trigger('reset');
                    jQuery('.rest_booking_container').empty();
                    jQuery('.rest_booking_container').append(result.front_success_message);
                    jQuery('html, body').animate({
                        scrollTop: jQuery('.generic-page-content').offset().top
                    }, 500);
                    
                    //disable
                    jQuery(".submit-loader").hide();
                    
                } else {
                    if (result.recaptcha_msg == '') {
                        jQuery('.rest_number_guest').parent('.rest_booking_field').append('<span class="error">' + result.msg + '</span>');
						jQuery('.rest_number_chef_guest').parent('.rest_booking_field').append('<span class="error">' + result.msg + '</span>');
                    } else {
                        jQuery('#test_result').fadeIn('slow');
                        jQuery('#test_result').html('<span class="error">' + result.recaptcha_msg + '</span>');
                    }
                }
            });

        }
        e.preventDefault();
    });
});



function rest_update_status(postId, status) {
    var data = {
        action: 'rest_update_reservation_status',
        postId: postId,
        status: status
    };
    var r = confirm(ajaxObject.update_confirm_msg);
    if (r == true) {
        jQuery.post(ajaxObject.ajaxurl, data, function (response) {
            var result = JSON.parse(response);
            if (status == 'Confirmed') {
            } else if (status == 'Cancelled') {
                jQuery('.rest_cancellation_link').hide();
                jQuery('.rest_cancellation_msg').show();
            }
        });
    }
}
function validatePhone(a) {
    //var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
    var filter = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
    if (filter.test(a)) {
       return true;
    }
    else {
        return false;
    }
}

function isNumberKey(evt)
{
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode !== 40 && charCode !== 41) && charCode !== 43 && charCode !== 45 && (charCode !== 37 && charCode !== 39 && charCode !== 32))
    {
        return false;
    }
    else
    {
        return true;
    }

}
// jQuery(document).ready(function(){
//      var input = document.getElementById("rest_phone_no"),
//       oldValue,
//       regex = new RegExp(/^\d{0,15}$/g),
//       mask = function(value) {
//       var output = [];
//         for(var i = 0; i < value.length; i++) {
//           if(i === 3 || i === 6) {
//               //output.push("-"); // add the separator
//           }
//           output.push(value[i]);
//         }
//         return output.join("");
//     },
//     unmask = function(value) {/^\d{0,15}$/g
//       var output = value.replace(new RegExp(/[^\d]/, 'g'), ''); // Remove every non-digit character

//       return output;
//     },
//     keydownHandler = function(e) {
//       oldValue = e.target.value;
//   },
//     inputHandler = function(e) {
//         var el = e.target,
//             newValue = el.value
//         ;
//         newValue = unmask(newValue);
        
//         if(newValue.match(regex)) {
//             newValue = mask(newValue);
//             el.value = newValue;
//             jQuery("#checkbox-payroll3 .last input:radio").attr("checked", false);
//             if(newValue == "")
//             {

//             jQuery('#checkbox-payroll3 input:radio').attr('disabled', false);
//           jQuery("#checkbox-payroll3 .first input:radio").attr("disabled", false);
//           jQuery("#checkbox-payroll3 .last input:radio").attr("disabled", false);
//             }
//             else
//             {
//               jQuery('#checkbox-payroll3 input:radio').attr('disabled', true);
//           jQuery("#checkbox-payroll3 .first input:radio").attr("disabled", false);
//           jQuery("#checkbox-payroll3 .last input:radio").attr("disabled", false);
//             }

//         } else {
          
//             el.value = oldValue;
//         }

//     };
  
//   input.addEventListener('keydown', keydownHandler );
//   input.addEventListener('input', inputHandler );
// });