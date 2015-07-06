<?php

$stylesheets = [];
foreach (glob($this->baseDir . '/'. $this->currentTheme . '/css/*.css') as $stylesheet) {
  $stylesheets[] = basename($stylesheet);
}

$javascripts = [];
foreach (glob($this->baseDir . '/'. $this->currentTheme . '/js/*.js') as $javascript) {
  $javascripts[] = basename($javascript);
}

return array(
    'extends' => 'rds',
    'css' => $stylesheets,
    'js' => $javascripts,
    'favicon' => 'hohenheim-favicon.ico',
);