/**
 * "Cut Calc"
 * Created by philipjohn on 27/04/16.
 */

$(function(){

	// Act on form submission
	$('#cutcalc').submit( function ( event ) {

		// Stop form submission
		event.preventDefault();

		// Grab the salary
		var salary = $('#gross_salary').val();

		// What are the tax-free allowances?
		var allowance_2016 = 10600;
		var allowance_2017 = 11000;

		// What are the tax rates?
		var tax_rates_2016 = {
			31785: 0.2,
			150000: 0.4
		};
		var tax_rates_2017 = {
			32000: 0.2,
			150000: 0.4
		};

		// Check that salary is actually an integer
		if ( ! isNormalInteger( salary ) ) {
			console.error( "Salary isn't a number!" );
			return;
		}

		// Calculate the 2016 taxable income
		// Don't tax folks earning up to the tax-free allowance
		if ( salary <= allowance_2016 ) {
			var taxable_income_2016 = 0;
		}
		// Everyone else, under £100,001 is pretty standard
		else if ( salary < 100001 ) {
			var taxable_income_2016 = salary - allowance_2016;
		}
		// Above £100k, the allowance gradually decreases
		else if ( salary < 122000 ) {
			var over_100 = salary - 100000;
			var adjusted_allowance = allowance_2016 - ( over_100 / 2 );
			var taxable_income_2016 = salary - adjusted_allowance;
		}
		// Above £100k, there is no allowance
		else {
			var taxable_income_2016 = salary;
		}

		// Get the tax rate and tax amount
		if ( taxable_income_2016 <= 31785 ) {
			var tax_2016 = taxable_income_2016 * 0.2;
		} else if ( taxable_income_2016 <= 150000 ) {
			var tax_2016 = 31785 * 0.2;
				tax_2016 += ( taxable_income_2016 - 31785 ) * 0.4;
		} else {
			var tax_2016 = 31785 * 0.2; // basic rate
				tax_2016 += 118215 * 0.4; // higher rate
				tax_2016 += ( taxable_income_2016 - 150000 ) * 0.45;
		}

	});

	// Validate integers
	// http://stackoverflow.com/questions/10834796/validate-that-a-string-is-a-positive-integer
	function isNormalInteger( str ) {
		var n = ~~Number( str );
		return String( n ) === str && n > 0;
	}

});