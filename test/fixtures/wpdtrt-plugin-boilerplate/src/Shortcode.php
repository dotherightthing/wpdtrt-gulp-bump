<?php
/**
 * Plugin shortcode class.
 *
 * @package   WPDTRT_Plugin
 * @version   1.0.0
 */

namespace DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_0_12_345;

if ( ! class_exists( 'Shortcode' ) ) {

	/**
	 * Plugin Shortcode base class
	 *
	 * Boilerplate functions, including
	 * options support, template loading, access to Plugin methods.
	 *
	 * @param       array $atts Optional shortcode attributes specified by the user.
	 * @param       string $content Content within the enclosing shortcode tags.
	 * @return      Shortcode
	 * @since       1.0.0
	 * @version     1.0.0
	 * @uses        ../../../../wp-includes/shortcodes.php
	 * @see         https://codex.wordpress.org/Function_Reference/add_shortcode
	 * @see         https://codex.wordpress.org/Shortcode_API#Enclosing_vs_self-closing_shortcodes
	 * @see         http://php.net/manual/en/function.ob-start.php
	 * @see         http://php.net/manual/en/function.ob-get-clean.php
	 */
	class Shortcode {

		/**
		 * Hook the plugin in to WordPress
		 * This constructor automatically initialises the object's properties
		 * when it is instantiated.
		 *
		 * This is a public method as every plugin uses a new instance:
		 * $wpdtrt_test_shortcode = new DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_0_12_345\Shortcode {}
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
