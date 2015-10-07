<?php

use Illuminate\Database\Seeder;

class PhoneHasBrandTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {


        $result = DB::table('brand')->select('id_brand as id' )->get();
        $i=0;
        foreach ($result as $row) {
        	$arrayBrand[$i]=$row->id;
        	$i++;
        }

        $result = DB::table('phone')->select('id_phone' )->get();
        foreach ($result as $row) {
            DB::table("phone_has_brand")->insert(array(
            'id_phone'=>$row->id_phone,
            'id_brand'=>$arrayBrand[rand(0,sizeof($arrayBrand)-1)]
            ));
        }


    }
}
