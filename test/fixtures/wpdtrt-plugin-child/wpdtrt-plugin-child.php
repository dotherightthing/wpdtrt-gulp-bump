<?php
/**
 * Plugin Name:  DTRT Plugin Child
 * Plugin URI:   https://github.com/dotherightthing/wpdtrt-plugin-child
 * Description:  Demo plugin which uses wpdtrt-plugin.
 * Version:      0.12.345
 * Author:       Dan Smith
 * Author URI:   https://profiles.wordpress.org/dotherightthingnz
 * License:      GPLv2 or later
 * License URI:  http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:  wpdtrt-plugin-child
 * Domain Path:  /languages
 */

if( ! defined( 'WPDTRT_PLUGIN_CHILD_VERSION' ) ) {
  define( 'WPDTRT_PLUGIN_CHILD_VERSION', '0.12.345' );
}

function wpdtrt_blocks_shortcode_1_init() {
  $wpdtrt_blocks_shortcode_1 = new DoTheRightThing\WPPlugin\r_0_12_345\Shortcode();
}

function wpdtrt_blocks_shortcode_2_init() {
  $wpdtrt_blocks_shortcode_2 = new DoTheRightThing\WPPlugin\r_0_12_345\Shortcode();
}

function wpdtrt_blocks_shortcode_3_init() {
  $wpdtrt_blocks_shortcode_3 = new DoTheRightThing\WPPlugin\r_0_12_345\Shortcode();
}

?>
