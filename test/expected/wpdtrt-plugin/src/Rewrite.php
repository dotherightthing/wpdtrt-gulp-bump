<?php
/**
 * Plugin rewrite class.
 *
 * @package   WPDTRT_Plugin
 * @version   1.0.0
 * @since     1.4.16
 */

namespace DoTheRightThing\WPDTRT_Plugin\r_1_0_0;

if ( ! class_exists( 'Rewrite' ) ) {

	class Rewrite {

		/**
		 * Hook the plugin in to WordPress
		 * This constructor automatically initialises the object's properties
		 * when it is instantiated,
		 *
		 * This is a public method as every plugin uses a new instance:
		 * $wpdtrt_test_rewrite = new DoTheRightThing\WPDTRT_Plugin\r_1_0_0\Rewrite {}
		 *
		 * @param     array $options Rewrite options
		 * @since     1.0.0
		 * @version   1.1.0
		 */
		public function __construct( $options ) {
			// ...
		}
	}
}
