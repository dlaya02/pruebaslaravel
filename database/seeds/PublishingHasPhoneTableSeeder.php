<?php

use Illuminate\Database\Seeder;

class PublishingHasPhoneTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $result = DB::table('phone')->select('id_phone')->get();
        $i=0;
        foreach ($result as $row) {
        	$arrayPhone[$i]=$row->id_phone;
        	$i++;
        }

        $result = DB::table('publishing')->select('id_publishing' )->get();
        foreach ($result as $row) {
            DB::table("publishing_has_phone")->insert(array(
            'id_publishing'=>$row->id_publishing,
            'id_phone'=>$arrayPhone[rand(0,sizeof($arrayPhone)-1)]
            ));
        }
    }
}
