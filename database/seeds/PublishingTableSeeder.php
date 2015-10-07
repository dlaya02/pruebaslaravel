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
        foreach ($result as $row) {
            
        	//2 Publishing BY each User
        	//fisrt one
            DB::table("publishing")->insert(array(
            'id_user'=>$row->id_user,
            'total_ranking_publishing'=>rand(0,5),
            'state'=>$stateArray[rand(0,1)],
            'date_publishing'=>date("Y-m-d H:i:s"),
            'custom_post'=>$faker->realText($maxNbChars = 200, $indexSize = 2)
            ));
            //second one
            DB::table("publishing")->insert(array(
            'id_user'=>$row->id_user,
            'total_ranking_publishing'=>rand(0,5),
            'state'=>$stateArray[rand(0,1)],
            'date_publishing'=>date("Y-m-d H:i:s"),
            'custom_post'=>$faker->realText($maxNbChars = 200, $indexSize = 2),
            'price'=>$faker->randomFloat($nbMaxDecimals = 2, $min = 50, $max = 200)
            ));
        }
    }
}
