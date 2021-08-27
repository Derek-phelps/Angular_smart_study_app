<?php
defined('BASEPATH') or exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';
class UpdateDb extends REST_Controller
{

    public function __construct()
    {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header('Access-Control-Allow-Headers: X-Requested-With, content-type, X-Token, x-token');
        parent::__construct();
        // $this->load->helper('url');
        $this->load->database();

        // $this->load->library('commonFunctions', null, 'cf');

        // if (!$this->session->userdata('userId')) {
        //     echo ("DIEEEEEE");
        //     die;
        // }
    }

    public function index()
    {
        die;
    }

    public function executesql_post()
    {
        // echo ($this->post('key'));
        // var_dump($this->post('SQL'));
        if (!$this->post('key') || $this->post('key') != 'laksjdfhlakdsjfhalksdjfhlaksdjfh') {
            die;
        }

        $clientVersionNumber = $this->post('VERSION_NUMBER');
        if (!$clientVersionNumber) {
            $data = array("success" => false, "msg" => "NO VERSION NUMBER SET");
            echo json_encode($data);
            die;
        }

        $this->db->query("ALTER TABLE `tbl_company` ADD `VERSION_NUMBER` VARCHAR(10) NOT NULL DEFAULT '0.0.0' COMMENT 'DB version number' AFTER `companyId`;");

        $this->db->select('*');
        $this->db->from('tbl_company');
        $companyReq = $this->db->get();
        if (!$companyReq || $companyReq->num_rows() == 0 || !isset($companyReq->row_array()['VERSION_NUMBER'])) {
            $data = array("success" => false, "msg" => "NO COMPANY FOUND IN DATABASE");
            echo json_encode($data);
            die;
        }
        $versionNumber = $companyReq->row_array()['VERSION_NUMBER'];

        if ($versionNumber != $clientVersionNumber) {
            $SQLStatements = json_decode($this->post('SQL'));
            foreach ($SQLStatements as $SQLStatement) {
                $this->db->query($SQLStatement);
            }
            $versionData = array("VERSION_NUMBER" => $clientVersionNumber);
            $this->db->update('tbl_company', $versionData);
        }
        $data = array("success" => true);
        echo json_encode($data);
    }
}
