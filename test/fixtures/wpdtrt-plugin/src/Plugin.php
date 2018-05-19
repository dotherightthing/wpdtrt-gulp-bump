<?php
/**
 * Plugin class.
 *
 * @package   WPDTRT_Plugin
 * @since     1.0.0
 * @version   1.0.1
 */

namespace DoTheRightThing\WPDTRT_Plugin\r_0_12_345;

if ( ! class_exists( 'Plugin' ) ) {

	class Plugin {

		// https://secure.php.net/manual/en/language.oop5.constants.php.
		const WPDTRT_PLUGIN_VERSION = '0.12.345';

		/**
		 * Initialise the object's properties when it is instantiated.
		 * This is a protected method as every plugin uses a sub class:
		 * class WPDTRT_Test_Plugin extends DoTheRightThing\WPDTRT_Plugin\r_0_12_345\Plugin {...}
		 *
		 * A plugin-specific instance of this class is created on init:
		 * add_action( 'init', '<%= nameSafe %>_init', 0 );
		 * so this construct CANNOT contain anything that needs to run
		 * BEFORE the WordPress 'init'
		 *
		 * @param     array $settings Plugin options.
		 * @since     1.0.0
		 * @version   1.1.0
		 */
		protected function __construct( $settings ) {
			// ...
		}
	}
}
