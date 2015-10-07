<?php

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class UserDoesReviewTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker  = Faker::create();
        $result = DB::table('publishing')->select('id_user')->get();
        //get user ids in array
        $arrayUsers = array();
        
        foreach ($result as $row){
        array_push($arrayUsers, $row->id_user);
		}

		$result= DB::table('review')->select('id_review')->get();
		foreach ($result as $row){
			$max = sizeof($arrayUsers)-1;
			$user= $arrayUsers[ $faker->biasedNumberBetween( 0, $max, 'sqrt')];
			DB::table("user_does_review")->insert(array(
			    'id_review'=> $row->id_review,
			    'id_user'=>$user
			));
		}
    }
}
