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
class RDSIndexHolding extends \Zend\View\Helper\AbstractHelper implements TranslatorAwareInterface
{
    use \VuFind\I18n\Translator\TranslatorAwareTrait;

    /**
     * List of adis client 
     *
     * @array
     */
    protected $adis_clients = ["25", "Frei129"];

    /**
     * Result order
     *
     * @array
     */
    protected $resultOrder = [
       "RDS_LEA",
       "RDS_STATUS",
       "RDS_LOCATION",
       "RDS_URL",
       "RDS_HINT",
       "RDS_COMMENT",
       "RDS_HOLDING",
       "RDS_HOLDING_LEAK",
       "RDS_INTERN",
       "RDS_PROVENIENCE",
       "RDS_LOCAL_NOTATION",
       "RDS_SIGNATURE",
    ];

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
        $this->daia=$daia;

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
           $lok_mergeResult["RDS_LOCATION"] = $this->setLocation($lok_set);
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
           if (isset($lok_set["int_verm"])) {
             $lok_mergeResult["RDS_INTERN"] = $lok_set["int_verm"];
           }

           // RDS_PROVENIENCE 
           if (isset($lok_set["lok_prov"])) {
             foreach ($lok_set["lok_prov"] as $provience) {
                // split ids and text
                if (preg_match('/ \| /', $provience)) {
                   $prov_list = explode(" | ", $provience);
                   // split id in provid and dnbid
                   if (preg_match('/ ; /', $prov_list[0])) {
                      $prov_id = explode(" ; ", $prov_list[0]);
                      $lok_mergeResult["RDS_PROVENIENCE"] = "prnid: " . $prov_id[0] . " prnname " . $prov_list[1] . " ";
                      $lok_mergeResult["RDS_PROVENIENCE"] .=  "<a class='dnb' href='http://d-nb.info/gnd/" . $prov_id[1] . "'  target='_blank' title='" . $this->translate('RDS_PERS_DNB') . "'></a>";
                   } else {
                      $lok_mergeResult["RDS_PROVENIENCE"] = "prnid: " . $prov_list[0] . " prnname " . $prov_list[1];
                   }
                } else {
                   $lok_mergeResult["RDS_PROVENIENCE"] = "prn: $provience";
                }
             }
           }
           //RDS_LOCAL_NOTATION  /* only for PH Freiburg */
           // set RDS_LEA /* only for Hohenheim, may similar for Freiburg mybib */
           // ToDo check offline and zeitschrift
           if (($lok_set["bib_sigel"] == "100") && (($lok_set["zusatz_standort"]!="11") && ($lok_set["zusatz_standort"]!="31"))) {
              $lok_mergeResult["RDS_LEA"] = $this->translate("RDS_LEA_TEXT") . ": <a href='" . $this->translate("RDS_LEA_LINK") . $lok_set["t_idn"] . "' target='LEA'>" . $this->translate("RDS_LEA_LINK_TEXT") . "</a>";
           }
           // set RDS_LOCATION (may be modified by daia)
           if (isset($lok_set["zusatz_standort"])) {
             $lok_mergeResult["RDS_LOCATION"] = $this->translate($lok_set["zusatz_standort"]);
             if (isset($lok_set["signatur"]) && isset($lok_set["standort"])) {
                $lok_mergeResult["RDS_LOCATION"] .= $this->translate("RDS_LOCSIG") . " " . $lok_set["standort"]; 
             }
           }

           // check summary
           if ($this->checkSummary($lok_set)) {
             $borrowable = 0;
             $lent = 0;
             $present = 0;
             $unknown = 0;
             $lok_mergeResult["RDS_STATUS"] = "";
             foreach ($daia[$lok_set["bib_sigel"]] as $loc_daia) {
                // ToDo eliminate PHP Warning and replace location
                foreach ($loc_daia as $items) {
                  foreach ($items as $item) {
                    if ($item["summary"]) {
                      $lastlocation = $item["location"];
                      switch ($item["status"]) {
                         case "borrowable": $borrowable++; break;
                         case "order": $borrowable++; break;
                         case "unknown": $unknown++; break;
                         case "lent": $lent++; break;
                         case "present": $present++; break;
                      }
                    }
                  }
                }
             }
             if ($borrowable > 0) {
                $lok_mergeResult["RDS_STATUS"] = $borrowable . " " . $this->translate("RDS_AVAIL") . " ";
             }
             if ($lent > 0) {
                $lok_mergeResult["RDS_STATUS"] .= $lent . " " . $this->translate("RDS_UNAVAILABLE") . " ";
             }
             if ($present > 0) {
                 $lok_mergeResult["RDS_STATUS"] .= $present . " " . $this->translate("RDS_REF_STOCK_TEXT") . " ";
             }
             if ($unknown > 0) {
                 $lok_mergeResult["RDS_STATUS"] .= $unknown . " " . $this->translate("UNKOWN");
             }
           } else {
           // set RDS_LOCATION and RDS_STATUS based on daia
           if (in_array($lok_set["bib_sigel"],$this->adis_clients)) {
             foreach ($daia[$lok_set["bib_sigel"]] as $loc_daia) {
                // ToDo eliminate PHP Warning
                foreach ($loc_daia as $items) {
                  foreach ($items as $item) {
                    if ($this->checkSignature($item["callnumber"],$lok_set["signatur"],$lok_set["bib_sigel"])) {
                      $lok_mergeResult["RDS_LOCATION"] .= " " . $this->translate($item["location"]); 
                      $localstatus = $this->createReadableStatus($item);
                      $lok_mergeResult["RDS_STATUS"] = $localstatus;
                    }
                  }
                }
             }
           }
           } // end else checkSummary
	   // ToDo sorting $lok_mergeResult   
           $result[$lok_set["bib_sigel"]][] = $lok_mergeResult;
        }
        return $result;
    }

    /**
     * Check if signatures fit together 
     *
     * @param string $daia_sig signature from daia
     * @param string $loc_sig signature from loc set 
     * @param string $bib_sigel sigel of the library
     *
     * @return boolean
     */
    protected function checkSignature($daia_sig,$loc_sig, $bib_sigel) {
        if ($daia_sig == $loc_sig) {
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
       // for Hohenheim
       /*
       if (isset($lok_set["zusatz_standort"])) {
           return $lok_set["zusatz_standort"];
       }
       */
       // for Freiburg
       if (isset($lok_set["standort"])) {
           if (isset($lok_set["R84_zusatz_standort"])) {
               return $lok_set["R84_zusatz_standort"] . " " . $lok_set["standort"];
           } 
           return $lok_set["standort"];
       }
    }

    /**
     * Creates a readable status 
     *
     * @param array $item daia item 
     *
     * @return string
     */
    protected function createReadableStatus($item) {
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
                            case "transaction": $localstatus = $this->translate("RDS_TRANSACTION"); break;
                            case "ordered": $localstatus = $this->translate("RDS_STATUS_ORDERED"); break; 
                            case "not yet ordered": $localstatus = $this->translate("RDS_STATUS_MARKED"); break;
                            default: $localstatus = $this->translate("RDS_UNAVAILABLE") . " ";
                                   if ($item["duedate"]) {
                                     $localstatus .= $this->translate("RDS_AVAIL_EXPECTED") . " " . $item["duedate"];
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
        return $localstatus;
    }
 
    /**
     * Check if item is part of something special 
     *
     * @param string $lok_set local data set 
     *
     * @return boolean
     */
    protected function checkSummary($lok_set) {
        // for Hohenheim
        /*
        if ($lok_set["zusatz_standort"]=="10") {
            return true;
        } else {
            return false;
        }
        */
        // for Freiburg
        if (preg_match('/^LB/',$lok_set["signatur"])) {
            return true;
        } else {
            return false;
        }
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
     * returns the array of the result order 
     *
     * @return array 
     */
    public function getResultOrder()
    {
        return $this->resultOrder;
    }

    /**
     * returns the array of active adis_clients 
     *
     * @return array 
     */
    public function getAdisClients()
    {
        return $this->adis_clients;
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
      foreach ($this->daia[$bib_sigel] as $loc_daia) {
         foreach ($loc_daia as $items) {
            foreach ($items as $item) {
               if (isset ($item['ilslink'])) {
                  $adisLink = $item['ilslink'];
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
