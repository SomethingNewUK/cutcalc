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
		var taxable_income = {};
		var tax = {};

		// What are the tax-free allowances?
		var allowance = {};
			allowance["2016"] = 10600;
			allowance["2017"] = 11000;

		// Check that salary is actually an integer
		if ( ! isNormalInteger( salary ) ) {
			console.error( "Salary isn't a number!" );
			return;
		}

		// Calculate the taxable income
		// Don't tax folks earning up to the tax-free allowance
		if ( salary <= allowance["2016"] ) {
			taxable_income["2016"] = 0;
		}
		// Everyone else, under £100,001 is pretty standard
		else if ( salary < 100001 ) {
			taxable_income["2016"] = salary - allowance["2016"];
		}
		// Above £100k, the allowance gradually decreases
		else if ( salary < 122000 ) {
			var over_100 = salary - 100000;
			var adjusted_allowance = allowance["2016"] - ( over_100 / 2 );
			taxable_income["2016"] = salary - adjusted_allowance;
		}
		// Above £100k, there is no allowance
		else {
			taxable_income["2016"] = salary;
		}

		// Get the tax rate and tax amount
		if ( taxable_income["2016"] <= 31785 ) {
			tax["2016"] = taxable_income["2016"] * 0.2;
		} else if ( taxable_income["2016"] <= 150000 ) {
			tax["2016"] = 31785 * 0.2;
			tax["2016"] += ( taxable_income["2016"] - 31785 ) * 0.4;
		} else {
			tax["2016"] = 31785 * 0.2; // basic rate
			tax["2016"] += 118215 * 0.4; // higher rate
			tax["2016"] += ( taxable_income["2016"] - 150000 ) * 0.45;
		}

	});

	// Validate integers
	// http://stackoverflow.com/questions/10834796/validate-that-a-string-is-a-positive-integer
	function isNormalInteger( str ) {
		var n = ~~Number( str );
		return String( n ) === str && n > 0;
	}

});