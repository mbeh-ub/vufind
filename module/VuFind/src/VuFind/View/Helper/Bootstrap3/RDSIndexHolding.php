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
namespace VuFind\View\Helper\Bootstrap3;

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
class RDSIndexHolding extends \Zend\View\Helper\AbstractHelper
{
    /**
     * List of adis client 
     *
     * @array
     */
    protected $adis_clients = ["21", "25", "Frei129", "31", "100"];

    /**
     * Result structure for mergeData 
     *
     * @array
     */
    protected $mergeResult = [
       "RDS_SIGNATURE" => null,
       "RDS_STATUS" => null,
       "RDS_LOCATION" => null,
       "RDS_URL" => null,
       "RDS_HINT" => null,
       "RDS_COMMENT" => null,
       "RDS_HOLDING" => null,
       "RDS_HOLDING_LEAK" => null,
       "RDS_INTERN" => null,
       "RDS_PROVENIENCE" => null,
       "RDS_LOCAL_NOTATION" => null,
       "RDS_LEA" => null, // only for Hohenheim
    ];

    /**
     * Local data set 
     *
     * @array
     */
    protected $lok = [];

    /**
     * DAIA result 
     *
     * @array
     */
    protected $daia = [];

    /**
     * Generate an array based on local data set and DAIA result
     *
     * @param array $lok  local data set
     * @param array $daia DAIA result
     *
     * @return array 
     */
    public function mergeData($lok, $daia)
    {
	$result=[];
        // $this->lok=$lok;
        // $this->daia=$daia;

        // Iteration based on the lok data
        foreach ($lok as $lok_set) {
           $lok_mergeResult = $this->mergeResult;
           // set RDS_SIGNATURE
           if (isset($lok_set["signatur"])) {
             $lok_mergeResult["RDS_SIGNATURE"] = $lok_set["signatur"];
           } else {
             if (isset($lok_set["standort"])) {
                $lok_mergeResult["RDS_SIGNATURE"] = $lok_set["standort"];
             }
           }
           // set RDS_STATUS (default, may be modified by daia)
           if (isset($lok_set["praesenz"]) && $lok_set["praesenz"]=='p') {
             $lok_mergeResult["RDS_STATUS"] = "RDS_REF_STOCK";
           }
           // set RDS_LOCATION (may be modified by daia)
           if (isset($lok_set["zusatz_standort"])) {
             $lok_mergeResult["RDS_LOCATION"] = $lok_set["zusatz_standort"];
           }
           // set RDS_URL
           if (isset($lok_set["url"])) {
              foreach ($lok_set["url"] as $single_url) {
                 $lok_mergeResult["RDS_URL"] .= "<a href='$single_url' target='_blank'>'$single_url'</a>";
              }
           }
           // set RDS_HINT
           // set RDS_COMMENT
           if (isset($lok_set["bestandKomment8034"])) {
             $lok_mergeResult["RDS_COMMENT"] = $lok_set["bestandKomment8034"];
           }
           // set RDS_HOLDING 
           if (isset($lok_set["bestand8032"]) && ($lok_set["bestand8032"]!="komment")) {
             if (isset($lok_set["komment"])) {
               $lok_mergeResult["RDS_HOLDING"] = $lok_set["komment"];
             }
             $lok_mergeResult["RDS_HOLDING"] .= $lok_set["bestand8032"];
             if (preg_match('/\-$/',$lok_set["bestand8032"])) {
               $lok_mergeResult["RDS_HOLDING"] .= "(laufend)";
             }
           }
           // set RDS_HOLDING_LEAK 
           // RDS_INTERN RDS_PROVENIENCE RDS_LOCAL_NOTATION RDS_LEA
           // set RDS_LOCATION (may be modified by daia)
           if (isset($lok_set["zusatz_standort"])) {
             $lok_mergeResult["RDS_LOCATION"] = $lok_set["zusatz_standort"];
           }
           // set RDS_LOCATION and RDS_STATUS based on daia
           if (in_array($lok_set["bib_sigel"],$this->adis_clients)) {
              foreach ($daia as $daia_set) {
                  $lok_mergeResult["RDS_LEA"] = "TEST"; 
                 if ((strtolower($daia_set["callnumber"]))==(strtolower($lok_set["signatur"]))) {
	            $lok_mergeResult["RDS_LOCATION"] = $daia_set.location;
                    if ($daia_set.availability) {
                       $lok_mergeResult["RDS_STATUS"] = "RDS_AVAIL";
                    }
                 }
             
              }
           }
           $result[$lok_set["bib_sigel"]][] = $lok_mergeResult;
        }
        return $result;
        return ["100" => [["RDS_SIGNATURE" => "LS 123", "RDS_LOCATION" => "oben"],["RDS_SIGNATURE" => "LS 321", "RDS_LOCATION" => "unten"]], "100-11" => [["RDS_SIGNATURE" => "BL 123", "RDS_LOCATION" => "links"],["RDS_SIGNATURE" => "BL 321", "RDS_LOCATION" => "rechts"]]];
    }

    /**
     * Generates a string for bib_name based on local data set
     *
     * @return string 
     */
    public function getBibName($bib_sigel)
    {
        return "DE" . str_replace("-","",$bib_sigel);
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
     * @return string 
     */
    public function getAdisLink($bib_sigel)
    {
      if (in_array($bib_sigel,$this->adis_clients)) {
        return "javascript:msgWindow=window.open('http://foo.baa','KIOSK','width=1024,height=580,location=no,menubar=yes,toolbar=not,status=yes,scrollbars=yes,directories=no,resizable=yes,alwaysRaised=yes,hotkeys=no,top=0,left=200,screenY=0,screenX=200');msgWindow.focus();";
     } else {
        return null;
     }
    }


}
