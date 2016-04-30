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
		// Check that salary is actually an integer
		if ( ! isNormalInteger( salary ) ) {
			console.error( "Salary isn't a number!" );
			return;
		}

		var tax_2016 = get_tax_for_year( 2016, salary );
		var tax_2017 = get_tax_for_year( 2017, salary );

		// How much less tax for 2017?
		var tax_diff = tax_2016 - tax_2017;

		var result = $('#tax_cut_amount');
		if ( tax_diff > 0 ) {
			result.text( '£' + tax_diff );
			make_suggestions( tax_diff );
			$('#tax_cut').show();
		} else {
			result.text( '£0' );
		}

	});

	function make_suggestions( tax_diff ) {

		// Donate to the Trussel Trust
		$('.trussell')
			.text( 'Donate £' + tax_diff + ' to the ' )
			.append( function () {
				return $('<a/>')
					.attr( 'href', '' )
					.text( 'Trussell Trust' );
			} );

		var monthly = Math.round( tax_diff / 12 );
		if ( monthly > 5 ) {

			// Monthly donation to Disability Rights UK
			$('.druk')
				.text( 'Donate £' + monthly + ' per month to ' )
				.append( function () {
					return $('<a/>')
						.attr( 'href', '' )
						.text('Disability Rights UK');
				});

			// Monthly donation to food bank
			$('.food-bank')
				.text( 'Add £' + monthly + ' of food to one of your shopping trips each month, and donate the food to your ' )
				.append( function () {
					return $('<a/>')
						.attr( 'href', 'https://www.trusselltrust.org/get-help/find-a-foodbank/' )
						.text( 'local food bank' );
				});

		} else {

			// One-off donation to Disability Rights UK
			$('.druk')
				.text( 'Donate £' + monthly + ' to ' )
				.append( function () {
					return $('<a/>')
						.attr( 'href', '' )
						.text('Disability Rights UK');
				});

			// One-off donation to local food bank
			$('.food-bank')
				.text( 'Do a £' + monthly + ' food shop to take to your ' )
				.append( function () {
					return $('<a/>')
						.attr( 'href', 'https://www.trusselltrust.org/get-help/find-a-foodbank/' )
						.text( 'local food bank' );
				});
		}



	}

	/**
	 * Calculate the tax for a tax year, based on a salary
	 *
	 * @param year int The year in which the tax year we want finishes (e.g. 2016-17 would be "2017")
	 * @param salary int The salary we need to get the tax amount for
	 */
	function get_tax_for_year( year, salary ) {

		// Storage for later
		var taxable_income = {};
		var tax = {};

		// What are the tax-free allowances?
		var allowance = {};
		allowance["2016"] = 10600;
		allowance["2017"] = 11000;

		// Calculate the taxable income
		// Don't tax folks earning up to the tax-free allowance
		if ( salary <= allowance[ year ] ) {
			taxable_income[ year ] = 0;
		}
		// Everyone else, under £100,001 is pretty standard
		else if ( salary < 100001 ) {
			taxable_income[ year ] = salary - allowance[ year ];
		}
		// Above £100k, the allowance gradually decreases
		else if ( salary < 122000 ) {
			var over_100 = salary - 100000;
			var adjusted_allowance = allowance[ year ] - ( over_100 / 2 );
			taxable_income[ year ] = salary - adjusted_allowance;
		}
		// Above £100k, there is no allowance
		else {
			taxable_income[ year ] = salary;
		}

		// The size of the gap between the tax free allowance and the next tax bracket
		var tax_bracket = {};
			tax_bracket["2016"] = 31785;
			tax_bracket["2017"] = 32000;

		// Get the tax rate and tax amount
		if ( taxable_income[ year ] <= tax_bracket[ year ] ) {
			tax = taxable_income[ year ] * 0.2;
		} else if ( taxable_income[ year ] <= 150000 ) {
			tax = tax_bracket[ year ] * 0.2;
			tax += ( taxable_income[ year ] - tax_bracket[ year ] ) * 0.4;
		} else {
			tax = tax_bracket[ year ] * 0.2; // basic rate
			tax += ( 150000 - tax_bracket[ year ] ) * 0.4; // higher rate
			tax += ( taxable_income[ year ] - 150000 ) * 0.45;
		}

		return tax;

	}

	// Validate integers
	// http://stackoverflow.com/questions/10834796/validate-that-a-string-is-a-positive-integer
	function isNormalInteger( str ) {
		var n = ~~Number( str );
		return String( n ) === str && n > 0;
	}

});