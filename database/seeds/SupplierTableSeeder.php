<?php

use Illuminate\Database\Seeder;


class SupplierTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
       $baseUrl=url();
        DB::table("supplier")->insert(array(
        	'name_supplier'=> 'Aragmedia',
        	'description_supplier'=>'Somos una startup especializada  en tecnología aplicada a la empresa, reforzando la automatización en los procesos de negocios, ayudando así a seguir forjando proyectos de futuro.',
        	'logo_route'=>$baseUrl."/img/default/aragmedialogo.png"
       	));
       	  DB::table("supplier")->insert(array(
        	'name_supplier'=> 'Moviastar',
        	'description_supplier'=>'Comienza a disfrutar a la velocidad de tu imaginación con 4G+, la tecnología que te permitirá navegar hasta 10 veces más rápido.',
        	'logo_route'=>$baseUrl."/img/default/movistarlogo.jpg"
       	));

       	DB::table("supplier")->insert(array(
        	'name_supplier'=> 'Instagram',
        	'description_supplier'=>'Global community that shares more than 60 million photos every day.',
        	'logo_route'=>$baseUrl."/img/default/instagramlogo.jpg"
       	));

       	  
    }
}


	