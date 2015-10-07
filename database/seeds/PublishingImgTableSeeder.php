<?php

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
class PublishingImgTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

    	$faker= Faker::create();
        $result = DB::table('publishing')->select('id_publishing')->get();
      	$baseUrl=url();

        //by ecah publishing set 3 diferent images
        foreach ($result as $row){
        	// 3 images by each publishing
        	$arrayImg= array();
        	$i=0;
			while($i!=3){
				//get a random name default image
				$numberImg=$faker->biasedNumberBetween($min = 1, $max = 10, $function = 'sqrt');
				$flag=0;
				//check if the image is not repeat
				foreach ($arrayImg as $key => $value) {
					if($numberImg==$arrayImg[$key]){
					   $flag=1;
					}
				}
				
				if($flag==0){
					//$arrayImg[]=$numberImg;
					array_push($arrayImg, $numberImg);
					$i++;
				}
			}      	

        	foreach ($arrayImg as $key => $value){
        		DB::table("publishing_img")->insert(array(
	            'id_publishing'=>$row->id_publishing,
	            'id_publishing_img'=>$arrayImg[$key],
	            'route'=>$baseUrl."/img/default/".$arrayImg[$key].".jpg"
	            ));
            }
		}
	}
}
    