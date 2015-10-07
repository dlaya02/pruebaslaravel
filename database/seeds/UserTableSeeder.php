<?php 

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
// Composer: "fzaninotto/faker": "v1.4.0"
use Faker\Factory as Faker;

class UserTableSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
    public function run() {

		$faker = Faker::create();
		for( $i =0; $i < 50; $i++){
            DB::table('user')->insert(array(
            	'first_name' => $faker->firstName,
            	'last_name'=> $faker->lastName,
            	'active'=> 1,
            	'email'=> $faker->unique()->email,
            	'password'=> '123456',
            	'address'=> $faker->address,
               	'total_ranking_user'=> rand(0,5)
            ));
        }
	}
}


