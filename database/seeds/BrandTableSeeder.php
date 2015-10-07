<?php

use Illuminate\Database\Seeder;


class BrandTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {


        DB::table('brand')->insert(array(
           	'name'=>"Samsung",
           	'description'=>"Samsung Electronics, fundada en 1969, es el miembro más grande del Grupo Samsung, que es a la vez una de las compañías de aparatos eléctricos más importantes del mundo. Fundada en Daegu, Corea del Sur"
           	));
        DB::table('brand')->insert(array(
           	'name'=>"Motorola",
           	'description'=>"Motorola Inc. es una empresa estadounidense especializada en la electrónica y las telecomunicaciones. Fundada en 1928 en Chicago"
           	));
        DB::table('brand')->insert(array(
           	'name'=>"Nokia",
           	'description'=>"fue creada en 1865,"
           	));
         DB::table('brand')->insert(array(
           	'name'=>"HTC",
           	'description'=>"Es un fabricante de teléfonos inteligentes taiwanés."
           	));
        DB::table('brand')->insert(array(
           	'name'=>"Lg",
           	'description'=>"LG Electronics está presente en España desde el año 199."
           	));
        
        

         
        
    }
}
