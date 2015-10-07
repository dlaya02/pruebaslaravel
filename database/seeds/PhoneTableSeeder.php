<?php 

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
// Composer: "fzaninotto/faker": "v1.4.0"
use Faker\Factory as Faker;

class PhoneTableSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
    public function run() {

    	$faker = Faker::create();
    
		for( $i =0; $i < 10; $i++){

			//echo $faker->safeColorName."        ";
            DB::table('phone')->insert(array(
            	'name' =>$faker->titleMale." ".$faker->city,
            	'height'=>$faker->biasedNumberBetween($min=100, $max=300, $function='sqrt')." mm.",
            	'width'=>$faker->biasedNumberBetween($min=100, $max=300, $function='sqrt')." mm.",
            	'curve'=>"Sin curvatura",
            	'weight'=>$faker->biasedNumberBetween($min=100, $max=300, $function='sqrt')." g.",
            	'color'=> $faker->safeColorName,
               	'display'=>"Super LCD ".$faker->biasedNumberBetween($min=100, $max=200,
               		    $function='sqrt')." x ".$faker->biasedNumberBetween($min=100, $max=200,
               		      $function='sqrt')." mm. Gorilla Glass. Multitouch.",
                'battery'=>"Non-removable Li-Po ".$faker->biasedNumberBetween($min=1000, $max=3000,
                        $function='sqrt')." mAh",
                'rear_camera'=>$faker->biasedNumberBetween($min=10, $max=30,
                        $function='sqrt')."MP. Autofocus, dual-LED (dual tone) with flash.",
                'front_camera'=>$faker->biasedNumberBetween($min=5, $max=10,
                        $function='sqrt')."MP. Autofocus without flash.",
                'video'=>$faker->biasedNumberBetween($min=1000, $max=3000,
                        $function='sqrt')." p@ 30fps",
                'sensors'=>"Accelerometer. gyro. GPS.",
                'ports'=>"Single USB Type-C™",
                'cpu'=>"Quad-core 2.0 GHz Cortex",
                'storage'=>$faker->biasedNumberBetween($min=10, $max=60,
                        $function='sqrt')." GB.",
                'ram'=>$faker->biasedNumberBetween($min=2, $max=8,
                        $function='sqrt')." GB.",
                'storage_removable'=>$faker->biasedNumberBetween($min=16, $max=32,
                        $function='sqrt')." GB.",
                'radio_system'=>"GSM/CDMA",
                'wiffi'=>"dual-band ".$faker->biasedNumberBetween($min=1, $max=5,
                        $function='sqrt')."GHz.",
                'bluetooth'=>"SI!"
            ));
        }


	}
}
