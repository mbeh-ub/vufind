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
           if (isset($lok_set["lueckenangabe8033"])) {
             $lok_mergeResult["RDS_HOLDING_LEAK"] = $lok_set["lueckenangabe8033"];
           }
           // RDS_INTERN /* only for Freiburg FRIAS and Ordinariat */
           // RDS_PROVENIENCE 
           if (isset($lok_set["lok_prov"])) {
             foreach ($lok_set["lok_prov"] as $provience) {
                // split ids and text
                if (preg_match('/ \| /', $provience)) {
                   $prov_list = explode(" | ", $provience);
                   // split id in provid and dnbid
                   if (preg_match('/ ; /', $prov_list[0])) {
                      $prov_id = explode(" ; ", $prov_list[0]);
                      $lok_mergeResult["RDS_PROVENIENCE"] = "prnid: " . $prov_id[0] . " prnname " . $prov_list[1] . " bndid: " . $prov_id[1];
                   } else {
                      $lok_mergeResult["RDS_PROVENIENCE"] = "prnid: " . $prov_list[0] . " prnname " . $prov_list[1];
                   }
                } else {
                   $lok_mergeResult["RDS_PROVENIENCE"] = "prn: $provience";
                }
             }
           }
           //RDS_LOCAL_NOTATION RDS_LEA
           // set RDS_LOCATION (may be modified by daia)
           if (isset($lok_set["zusatz_standort"])) {
             $lok_mergeResult["RDS_LOCATION"] = $lok_set["zusatz_standort"];
           }
           // set RDS_LOCATION and RDS_STATUS based on daia
           if (in_array($lok_set["bib_sigel"],$this->adis_clients)) {
             foreach ($daia as $loc_daia) {
                // ToDo eliminate PHP Warning
                foreach ($loc_daia as $items) {
                  foreach ($items as $item) {
                    if ($item["callnumber"] == $lok_set["signatur"]) {
                      $lok_mergeResult["RDS_LOCATION"] = $item["location"]; 
                      $localstatus = "";
                      switch ($item["status"]) {
                         case "borrowable": $localstatus = "RDS_AVAIL"; break;
                         case "order": $localstatus = "RDS_ORDER"; break;
                         case "unknown": 
                             if ($item["notes"] == "provided") {
                                 $localstatus = "RDS_WAITING";
                             }
                             if ($item["notes"] == "missing") {
                                 $localstatus = "RDS_MISSING";
                             }
                         break;
                         case "lent": 
                             switch ($item["notes"]) {
                                 case "transaction": $localstatus = "RDS_TRANSACTION"; break;
                                 case "ordered": $localstatus = "RDS_STATUS_ORDERED"; break;
                                 case "not yet ordered": $localstatus = "RDS_STATUS_MARKED"; break;
                                 default: $localstatus = "RDS_UNAVAILABLE";
                                   if ($item["duedate"]) {
                                     $localstatus .= " RDS_AVAIL_EXPECTED: " . $item["duedate"];
                                   }
                                 break;
                             }
                         break;
                         case "present":
                             if ($lok_set["status"] == "p") {
                                 $localstatus = "RDS_REF_STOCK_SPECIAL";
                             } else {
                                 $localstatus = "RDS_REF_STOCK_TEXT";
                             }
                         break;
                      }
                      $lok_mergeResult["RDS_STATUS"] = $localstatus;
                    }
                  }
                }
             }
           }
           $result[$lok_set["bib_sigel"]][] = $lok_mergeResult;
        }
        return $result;
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
