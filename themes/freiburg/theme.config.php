<?php
return array(
    'extends' => 'rds',
    'css' => array(
		//'/css/bootstrap.min.css', // FIXME: We don't need to include it. Inherited from bootstrap theme
		'screen.css'
    ),
    'js' => array(
		'vendor/modernizr.custom.2.8.3.min.js',
		'vendor/jquery-ui-11.1.4.custom.min.js',
		'vendor/jquery.dataTables.min.js',
		'app.js',
		'plugin.mainnavigation.js',
		'plugin.metanavigation.js',
		'plugin.autoheighter.js'
    ),
    'favicon' => 'icons/ub-freiburg.ico',
);
