<?php
/**
 * Plugin widget class.
 *
 * Boilerplate to generate a widget, which is configured in WP Admin, and can be displayed in sidebars.
 *
 * @package   WPDTRT_Plugin
 * @version   1.0.0
 */

namespace DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_0_0;

if ( ! class_exists( 'Widget' ) ) {

	/**
	 * Plugin Widget sub class.
	 *
	 * Extends and inherits from WP_Widget.
	 * WP_Widget must be extended for each widget, and WP_Widget::widget() must be overridden.
	 * Class names should use capitalized words separated by underscores. Any acronyms should be all upper case.
	 *
	 * @since       0.1.0
	 * @version     1.0.0
	 * @uses        ../../../../wp-includes/class-wp-widget.php:
	 * @see         https://developer.wordpress.org/reference/classes/wp_widget/
	 * @see         https://make.wordpress.org/core/handbook/best-practices/coding-standards/php/#naming-conventions
	 */

	class Widget extends \WP_Widget {

		/**
		 * Hook the plugin in to WordPress
		 * This constructor automatically initialises the object's properties
		 * when it is instantiated.
		 *
		 * This is a public method as every plugin uses a new instance:
		 * $wpdtrt_test_widget = new DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_0_0\Widget {}
		 *
		 *
		 * @param     array $options Widget options.
		 * @since     1.0.0
		 * @version   1.1.0
		 */
		public function __construct( $options ) {
			// ...
		}
	}
}
