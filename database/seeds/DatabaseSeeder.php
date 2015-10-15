<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;


class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();
    	$this->call(UserTableSeeder::class);
    	$this->call(UserPhoneTableSeeder::class);
    	$this->call(PhoneTableSeeder::class);
		$this->call(BrandTableSeeder::class);
		$this->call(PhoneSystemTableSeeder::class);
		$this->call(PhoneHasBrandTableSeeder::class);
		$this->call(PhoneHasSystemTableSeeder::class);
		$this->call(SupplierTableSeeder::class);
		$this->call(SupplierBannerTableSeeder::class);
		//to load publishing you have to already have user and supplier table 
		$this->call(PublishingTableSeeder::class);
		$this->call(PublishingImgTableSeeder::class);
		$this->call(PublishingHasPhoneTableSeeder::class);
		$this->call(ReviewTableSeeder::class);
		$this->call(UserDoesReviewTableSeeder::class);
	}	
}
