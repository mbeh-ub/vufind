<?php
/**
 * ILS Driver for VuFind to query availability information via DAIA.
 *
 * Based on the proof-of-concept-driver by Till Kinstler, GBV.
 * Relaunch of the daia driver developed by Oliver Goldschmidt.
 *
 * PHP version 5
 *  
 * Copyright (C) Jochen Lienhard 2014.
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
 * @package  ILS_Drivers
 * @author   Jochen Lienhard <lienhard@ub.uni-freiburg.de>
 * @author   Oliver Goldschmidt <o.goldschmidt@tu-harburg.de>
 * @author   André Lahmann <lahmann@ub.uni-leipzig.de>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org/wiki/vufind2:building_an_ils_driver Wiki
 */
namespace VuFind\ILS\Driver;
use DOMDocument, VuFind\Exception\ILS as ILSException,
    VuFindHttp\HttpServiceAwareInterface as HttpServiceAwareInterface,
    Zend\Log\LoggerAwareInterface as LoggerAwareInterface;

/**
 * ILS Driver for VuFind to query availability information via DAIA.
 *
 * @category VuFind2
 * @package  ILS_Drivers
 * @author   Jochen Lienhard <lienhard@ub.uni-freiburg.de>
 * @author   Oliver Goldschmidt <o.goldschmidt@tu-harburg.de>
 * @author   André Lahmann <lahmann@ub.uni-leipzig.de>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org/wiki/vufind2:building_an_ils_driver Wiki
 */ 
class RDSDAIA extends DAIA 
{
    /**
     * DAIA summaryKey 
     *
     * @var string
     */
    protected $summaryKey = null;

    /**
     * DAIA summaryValue
     *
     * @var string
     */
    protected $summaryValue = null;

    /**
     * Initialize the driver.
     *
     * Validate configuration and perform all resource-intensive tasks needed to
     * make the driver active.
     *
     * @throws ILSException
     * @return void
     */
    public function init()
    {
       parent::init();
       if (isset($this->config['DAIA']['summaryKey']) && isset($this->config['DAIA']['summaryValue'])) {
           $this->summaryKey = $this->config['DAIA']['summaryKey'];
           $this->summaryValue = $this->config['DAIA']['summaryValue'];
       } 
    }

    /**
     * Get Status of JSON Result
     *
     * This method gets a json result from the DAIA server and
     * analyses it. Than a vufind result is build.
     *
     * @param string $id The id of the bib record
     *
     * @return array()      of items
     */
    protected function getJSONStatus($id)
    {
        // get daia json request for id and decode it
        $daia = json_decode($this->doHTTPRequest($id), true);
        $result = [];
        if (array_key_exists("message", $daia)) {
            // analyse the message for the error handling and debugging
        }
        if (array_key_exists("instituion", $daia)) {
            // information about the institution that grants or
            // knows about services and their availability
            // this fields could be analyzed: href, content, id
        }
        if (array_key_exists("document", $daia)) {
            // analyse the items
            $dummy_item = ["id" => "0815",
                "availability" => true,
                "status" => "Available",
                "location" => "physical location no HTML",
                "reserve" => "N",
                "callnumber" => "007",
                "number" => "1",
                "item_id" => "0815",
                "barcode" => "1"];
            // each document may contain: id, href, message, item
            foreach ($daia["document"] as $document) {
                $doc_id = null;
                $doc_href = null;
                $doc_message = null;
                if (array_key_exists("id", $document)) {
                    $doc_id = $document["id"];
                }
                if (array_key_exists("href", $document)) {
                    // url of the document
                    $doc_href = $document["href"];
                }
                if (array_key_exists("message", $document)) {
                    // array of messages with language code and content
                    $doc_message = $document["message"];
                }
                // if one or more items exist, iterate and build result-item
                if (array_key_exists("item", $document)) {
                    $number = 0;
                    foreach ($document["item"] as $item) {
                        $result_item = [];
                        $result_item["id"] = $id;
                        $result_item["item_id"] = $id;
                        $number++; // count items
                        $result_item["number"] = $number;
                        // set default value for barcode
                        $result_item["barcode"] = "1";
                        // set default value for reserve
                        $result_item["reserve"] = "N";
                        // check if summary is neccessary
                        $check_key=false;
                        if (isset($item[$this->summaryKey])) {
                            if (is_array($item[$this->summaryKey])) {
                                if (preg_match("/^$this->summaryValue/",$item[$this->summaryKey]["content"])) {
                                    $check_key=true;
                                }
                            } else {
                                if (preg_match("/^$this->summaryValue/",$item[$this->summaryKey])) {
                                    $check_key=true;
                                }
                            }
                        }
                        // status and availability will be calculated in own function
                        if ($check_key) {
                            $result_item['summary'] = ["summary" => $number]; 
                        } 
                            // get callnumber
                            if (isset($item["label"])) {
                                $result_item["callnumber"] = $item["label"];
                            } else {
                                $result_item["callnumber"] = "Unknown";
                            }
                            // get location
                            if (isset($item["storage"])) {
                                $result_item["location"] = $item["storage"]["content"];
                            } else {
                                $result_item["location"] = "Unknown";
                            }
                            $result_item = $this->calculateStatus($item)+$result_item;
                        
                        // add document link
                        $result_item['ilslink'] = $doc_href;
                        // add result_item to the result array
                        $result[] = $result_item;
                    } // end iteration on item
                }
            } // end iteration on document
            // $result[]=$dummy_item;
        }
        return $result;
    }


    /**
     * Calaculate Status and Availability of an item
     *
     * If availability is false the string of status will be shown in vufind
     *
     * @param string $item json DAIA item
     *
     * @return array("status"=>"only for VIPs" ... )
     */
    protected function calculateStatus($item)
    {
        $limitation=null;
        $message=null;
        $availability = false;
        $status = null;
        $duedate = null;

        if (isset($item["limitation"])) {
            if (isset($item["limitation"]["content"])) {
                $limitation = $item["limitation"]["content"];
            }
        }

        if (isset($item["message"])) {
            if (isset($item["message"][0]["content"])) {
                $message = $item["message"][0]["content"];
            }
        }

        if (array_key_exists("available",$item)) {
            $loan = 0;
            $presentation = 0;

            foreach ($item["available"] as $available) {
                if ($available["service"] == "loan") {
                    $loan=0;
                }
                if ($available["service"] == "presentation") {
                    $presentation=0;
                }
            }
        }

        if (array_key_exists("unavailable",$item)) {
            foreach ($item["unavailable"] as $unavailable) {
                if ($unavailable["service"] == "loan") {
                    $loan = 1;
                }
                if ($unavailable["service"] == "presentation") {
                    if (isset($unavailable["expected"])) {
                        $loan=2;
                        $duedate=$unavailable["expected"];
                    }
                    $presentation=1;
                }
            }
        }

        if ($loan == 0 && $presentation == 0) {
            if ($limitation == 'restricted') {
                $status="order";
            } else {
                $status="borrowable";
            }
        } else {
            if ($loan == 2) {
                $status="lent";
            } else {
                if ($loan == 1 && $presentation == 0) {
                    $status="present";
                } else {
                    $status="unknown";
                }
            }
        }
 
        if (array_key_exists("available", $item)) {
            // check if item is loanable or presentation
            foreach ($item["available"] as $available) {
                if ($available["service"] == "loan") {
                    $availability = true;
                }
                if ($available["service"] == "presentation") {
                    $availability = true;
                }
            }
        }
 
        return (["status" => $status,
            "availability" => $availability,
            "notes" => $message,
            "duedate" => $duedate]);
    }

}
