<?php

use Illuminate\Database\Seeder;

class PhoneHasSystemTableSeeder extends Seeder
{
   /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $result = DB::table('phone_system')->select('id_phone_system as id' )->get();
        $i=0;
        foreach ($result as $row) {
        	$arraySystem[$i]=$row->id;
        	$i++;
        }

        $result = DB::table('phone')->select('id_phone' )->get();
        foreach ($result as $row) {
            DB::table("phone_has_system")->insert(array(
            'id_phone'=>$row->id_phone,
            'id_system'=>$arraySystem[rand(0,sizeof($arraySystem)-1)]
            ));
        }


    }
}
