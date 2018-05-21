<?php
/**
 * Plugin template loader class.
 *
 * @package   WPDTRT_Plugin
 * @version   1.0.0
 * @since     0.6.0
 */

namespace DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_0_0;

if ( ! class_exists( 'TemplateLoader' ) ) {

	/**
	 * Template loader sub class
	 *
	 * Extends the base class to inherit functionality.
	 * Displays templates in the Templates dropdown in the page edit screen.
	 * Allows the author to override these from the templates folder in their own theme.
	 *
	 * @since   0.6.0
	 * @version 1.0.0
	 * @uses    https://github.com/wpexplorer/page-templater
	 * @see     http://www.wpexplorer.com/wordpress-page-templates-plugin/
	 */
	class TemplateLoader extends \Gamajo_Template_Loader {

		/**
		 * Pass options to Gamajo class
		 * This constructor automatically initialises the object's properties
		 * when it is instantiated.
		 *
		 * This is a public method as every plugin uses a new instance:
		 * $wpdtrt_test_templateloader = new DoTheRightThing\WPDTRT_Plugin_Boilerplate\r_1_0_0\TemplateLoader {}
		 *
		 * @param     array $options Plugin options.
		 * @since     1.0.0
		 * @version   1.1.0
		 */
		public function __construct( $options ) {
			// ...
		}
	}
}
