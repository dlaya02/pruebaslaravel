<?php

use Illuminate\Database\Seeder;

class SupplierBannerTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $baseUrl=url();
        $result = DB::table('supplier')->select('id_supplier','name_supplier')->get();
        
        foreach ($result as $row) {
        	for ($i=1; $i <5 ; $i++) { 
        		DB::table('supplier_banner')->insert( array(
        			'id_supplier' => $row->id_supplier,
        			'route' =>$baseUrl."/img/default/".$row->name_supplier.$i.".jpg"));
        	}
        }
    }
}
