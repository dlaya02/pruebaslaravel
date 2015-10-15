<?php

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
class PublishingTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker  = Faker::create();
        $stateArray = array('0' => 'new','1'=>'used' );
        $result = DB::table('user')->select('id_user' )->get();
        //Make one Publishing by each user
        foreach ($result as $row) {
           	$id_publishing= DB::table("publishing")->insertGetId(array(
            'total_ranking_publishing'=>rand(0,5),
            'state'=>$stateArray[rand(0,1)],
            'date_publishing'=>date("Y-m-d H:i:s"),
            'custom_post'=>$faker->realText($maxNbChars = 200, $indexSize = 2)
            ));
            //registering the publishing in relationship table
            DB::table("user_does_publishing")->insert( array(
            'id_user' => $row->id_user,
            'id_publishing'=>$id_publishing));
        }


         $result = DB::table('supplier')->select('id_supplier' )->get();
        //Make one Supplier by each user
        foreach ($result as $row) {
            $id_publishing= DB::table("publishing")->insertGetId(array(
            'total_ranking_publishing'=>rand(0,5),
            'state'=>$stateArray[rand(0,1)],
            'date_publishing'=>date("Y-m-d H:i:s"),
            'custom_post'=>$faker->realText($maxNbChars = 200, $indexSize = 2)
            ));
            //registering the publishing in relationship table
            DB::table("supplier_does_publishing")->insert( array(
            'id_supplier' => $row->id_supplier,
            'id_publishing'=>$id_publishing));
        }
    
    }
}
