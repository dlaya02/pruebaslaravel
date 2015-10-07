<?php

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ReviewTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker  = Faker::create();
		$results= DB::table('publishing')->select('id_publishing')->get();
		
		foreach($results as $row) {
			DB::table("review")->insert(array(
			'id_publishing'=>$row->id_publishing,
			'quantity_start'=>$faker->biasedNumberBetween($min = 1, $max = 5, $function = 'sqrt'),
			'comment'=>$faker->realText($maxNbChars = 200, $indexSize = 2)
			));
		}
    }
}
