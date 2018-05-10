<?php
/**
 * Plugin Name:  DTRT Plugin Child
 * Plugin URI:   https://github.com/dotherightthing/wpdtrt-blocks
 * Description:  Demo plugin which uses wpdtrt-plugin.
 * Version:      0.12.345
 * Author:       Dan Smith
 * Author URI:   https://profiles.wordpress.org/dotherightthingnz
 * License:      GPLv2 or later
 * License URI:  http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:  wpdtrt-blocks
 * Domain Path:  /languages
 */

if( ! defined( 'WPDTRT_PLUGIN_CHILD_VERSION' ) ) {
  define( 'WPDTRT_PLUGIN_CHILD_VERSION', '0.12.345' );
}

/**
 * Register Shortcode
 */
function wpdtrt_blocks_shortcode_1_init() {
  $wpdtrt_blocks_shortcode_1 = new DoTheRightThing\WPPlugin\r_0_12_345\Shortcode();
}

add_action( 'init', 'wpdtrt_blocks_shortcode_1_init', 100 );

?>
