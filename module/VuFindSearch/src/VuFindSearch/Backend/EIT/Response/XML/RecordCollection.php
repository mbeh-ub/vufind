<?php

/**
 * EIT record collection.
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
 * @package  Search
 * @author   Julia Bauder <bauderj@grinnell.edu>
 * @author   David Maus <maus@hab.de>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org
 */
namespace VuFindSearch\Backend\EIT\Response\XML;

use VuFindSearch\Response\AbstractRecordCollection;

/**
 * EIT record collection.
 * Largely copied from the WorldCat record collection
 *
 * @category VuFind2
 * @package  Search
 * @author   David Maus <maus@hab.de>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org
 */
class RecordCollection extends AbstractRecordCollection
{
    /**
     * Raw response.
     *
     * @var array
     */
    protected $response;

    /**
     * Constructor.
     *
     * @param array $response EIT response
     *
     * @return void
     */
    public function __construct(array $response)
    {
        $this->response = $response;
        $this->rewind();
    }

    /**
     * Return total number of records found.
     *
     * @return int
     */
    public function getTotal()
    {
        return isset($this->response['total']) ? $this->response['total'] : 0;
    }

    /**
     * Return facet information.
     *
     * @return array
     */
    public function getFacets()
    {
        return []; // not supported by EIT
    }

    /**
     * Return offset in the total search result set.
     *
     * @return int
     */
    public function getOffset()
    {
    
        return isset($this->response['offset']) ? $this->response['offset'] : 0;
    }
}
