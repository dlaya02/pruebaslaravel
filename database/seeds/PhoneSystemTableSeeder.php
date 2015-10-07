<?php

use Illuminate\Database\Seeder;

class PhoneSystemTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //phone_system
         DB::table('phone_system')->insert(array(
           	'os'=>"iOS",
           	'version'=>"9.0",
           	'name_system'=>""
           	));
        DB::table('phone_system')->insert(array(
           	'os'=>"Android ",
           	'version'=>"6.0",
           	'name_system'=>"Marshmallow"
           	));
        DB::table('phone_system')->insert(array(
           	'os'=>"Android",
           	'version'=>"4.0",
           	'name_system'=>"KitKat"
           	));
        DB::table('phone_system')->insert(array(
           	'os'=>"Android",
           	'version'=>"5.0",
           	'name_system'=>"Lollipop"
           	));
         DB::table('phone_system')->insert(array(
           	'os'=>"Android",
           	'version'=>"1.5",
           	'name_system'=>"Cupcake"
           	));
    }
}
