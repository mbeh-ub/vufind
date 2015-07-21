<?php
/**
 * RDSIndexHolding view helper
 *
 * PHP version 5
 *
 * Copyright (C) Villanova University 2010.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 *
 * @category VuFind2
 * @package  View_Helpers
 * @author   Demian Katz <demian.katz@villanova.edu>
 * @author   Jochen Lienhard <lienhard@ub.uni-freiburg.de>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org/wiki/vufind2:developer_manual Wiki
 */
namespace VuFind\View\Helper\Hohenheim;
use     VuFind\I18n\Translator\TranslatorAwareInterface;

/**
 * RDSIndexHolding view helper
 *
 * @category VuFind2
 * @package  View_Helpers
 * @author   Demian Katz <demian.katz@villanova.edu>
 * @author   Jochen Lienhard <lienhard@ub.uni-freiburg.de>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org/wiki/vufind2:developer_manual Wiki
 */
class RDSIndexHolding extends \VuFind\View\Helper\Bootstrap3\RDSIndexHolding 
{
    /**
     * List of adis client 
     *
     * @array
     */
    protected $adis_clients = ["100"];

    /**
     * Result order
     *
     * @array
     */
    protected $resultOrder = [
       "RDS_LEA",
       "RDS_SIGNATURE",
       "RDS_STATUS",
       "RDS_LOCATION",
       "RDS_URL",
       "RDS_HINT",
       "RDS_HOLDING",
       "RDS_HOLDING_LEAK",
       "RDS_COMMENT",
       "RDS_INTERN",
       "RDS_PROVENIENCE",
       "RDS_LOCAL_NOTATION",
    ];

    /**
     * Check if item is part of something special 
     *
     * @param string $lok_set local data set 
     *
     * @return boolean
     */
    protected function checkSummary($lok_set) {
        // for Hohenheim
        if ($lok_set["zusatz_standort"]=="10") {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Creates the location depending on the data loc set
     *
     * @param array $lok_set 
     *
     * @return string
     */
    protected function setLocation($lok_set) {
       if (isset($lok_set["zusatz_standort"])) {
           return $lok_set["zusatz_standort"];
       }
    }

    /**
     * Generates a string for bib_link based on local data set
     *
     * @return string 
     */
    public function getBibLink($bib_sigel)
    {
        return "HOH_LINK_" . $bib_sigel;
    }

    /**
     * Generates a string for adis_link based on daia result 
     *
     * @param string $bib_sigel  id of library 
     *
     * @return string 
     */
    public function getAdisLink($bib_sigel)
    {
      $adisLink = null;
      foreach ($this->daia as $loc_daia) {
         foreach ($loc_daia as $items) {
            foreach ($items as $item) {
               if (isset ($item['link'])) {
                  $adisLink = $item['link'];
               }
            }
         }
      }
      if (in_array($bib_sigel,$this->adis_clients) && $adisLink) {
        return "javascript:msgWindow=window.open('" . $adisLink ."','KIOSK','width=1024,height=580,location=no,menubar=yes,toolbar=not,status=yes,scrollbars=yes,directories=no,resizable=yes,alwaysRaised=yes,hotkeys=no,top=0,left=200,screenY=0,screenX=200');msgWindow.focus();";
     } else {
        return null;
     }
    }
}
