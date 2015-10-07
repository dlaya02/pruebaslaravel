<?php

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
class UserPhoneTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker  = Faker::create();
		$results= DB::table('user')->select('id_user')->get();
		
		foreach($results as $row) {
		    DB::table('user_phone')->insert(array(
            'id_user'     =>$row->id_user,
            'phone_number'=>$faker->phoneNumber
            ));
		}
    }
}
