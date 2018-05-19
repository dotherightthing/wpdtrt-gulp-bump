<?php
/**
 * Plugin Name:  DTRT Plugin Child
 * Plugin URI:   https://github.com/dotherightthing/wpdtrt-plugin-child
 * Description:  Demo plugin which uses wpdtrt-plugin.
 * Version:      2.0.0
 * Author:       Dan Smith
 * Author URI:   https://profiles.wordpress.org/dotherightthingnz
 * License:      GPLv2 or later
 * License URI:  http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:  wpdtrt-plugin-child
 * Domain Path:  /languages
 */

if( ! defined( 'WPDTRT_PLUGIN_CHILD_VERSION' ) ) {
  define( 'WPDTRT_PLUGIN_CHILD_VERSION', '2.0.0' );
}

function wpdtrt_plugin_child_shortcode_1_init() {
  $wpdtrt_plugin_child_shortcode_1 = new WPDTRT_Plugin_Child_Shortcode();
}

function wpdtrt_plugin_child_shortcode_2_init() {
  $wpdtrt_plugin_child_shortcode_2 = new WPDTRT_Plugin_Child_Shortcode();
}

function wpdtrt_plugin_child_shortcode_3_init() {
  $wpdtrt_plugin_child_shortcode_3 = new WPDTRT_Plugin_Child_Shortcode();
}

?>
