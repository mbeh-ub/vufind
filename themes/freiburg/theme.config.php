<?php
return array(
    'extends' => 'rds',
    'css' => array(
		//'/css/bootstrap.min.css', // FIXME: We don't need to include it. Inherited from bootstrap theme
		'/css/screen.css'
    ),
    'js' => array(
		'/js/vendor/modernizr.custom.2.8.3.min.js',
		'/js/vendor/jquery-ui-11.1.4.custom.min.js',
		'/js/vendor/jquery.dataTables.min.js',
		'/js/app.js',
		'/js/plugin.mainnavigation.js',
		'/js/plugin.metanavigation.js',
		'/js/plugin.autoheighter.js'
    ),
    'favicon' => 'freiburg-favicon.ico',
);
