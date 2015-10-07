<?php 

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class PruebaTableSeeder extends Seeder {

	public function run()
	{
		Schema::create('pruebas', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('name');
			$table->string('email')->unique();
			$table->string('password', 60);
			$table->rememberToken();
			$table->timestamps();
		});
	}

}
