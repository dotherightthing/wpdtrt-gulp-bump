<?php
/**
 * Plugin taxonomy class.
 *
 * @package   WPDTRT_Plugin
 * @version   1.0.0
 */

namespace DoTheRightThing\WPDTRT_Plugin\r_0_12_345;

if ( ! class_exists( 'Taxonomy' ) ) {

	/**
	 * Plugin Taxonomy base class.
	 *  Boilerplate functions, including
	 *  options support, registration, template loading, custom fields
	 *
	 * @param       array $atts Optional taxonomy attributes specified by the user.
	 * @return      Taxonomy
	 * @since       1.0.0
	 * @version     1.0.0
	 * @see         http://php.net/manual/en/function.ob-start.php
	 * @see         http://php.net/manual/en/function.ob-get-clean.php
	 */
	class Taxonomy {

		/**
		 * Hook the plugin in to WordPress
		 * This constructor automatically initialises the object's properties
		 * when it is instantiated.
		 *
		 * This is a public method as every plugin uses a new instance:
		 * $wpdtrt_test_taxonomy = new DoTheRightThing\WPDTRT_Plugin\r_0_12_345\Taxonomy {}
		 *
		 * @param     array $options Shortcode options.
		 * @since     1.0.0
		 * @version   1.1.0
		 */
		public function __construct( $options ) {
			// ...
		}
	}
}
