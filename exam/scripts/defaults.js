/**
 * @author infinitelyCannon
 * This file contains a function of overrides that changes certain default settings on jQuery Mobile.
 * Insert this script after JQuery loads and before the mobile plugin loads.
 */
$(document).on("mobileinit", function(){
	$.extend($.mobile, {
		ajaxEnabled: false
	});
});
