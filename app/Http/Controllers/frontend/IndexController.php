<?php namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\Guard;
use DB;


class IndexController extends Controller {

	/*
	|--------------------------------------------------------------------------
	| Welcome Controller
	|--------------------------------------------------------------------------
	|
	| This controller renders the "marketing page" for the application and
	| is configured to only allow guests. Like most of the other sample
	| controllers, you are free to modify or remove it as you desire.
	|
	*/

	/**
	 * Create a new controller instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		//$this->middleware('guest');
	}

	/**
	 * Show the application welcome screen to the user.
	 *
	 * @return Response
	 */
	public function index()
	{
		


		$users = DB::table('publishing')->where('total_ranking_publishing', '>', 2)->get();
		//print_r($users);


		
		//$content=view('frontend.footer');

		
		$result=DB::table('publishing')->get();
		$publishingarray = array();
		foreach ($result as $row) {
			$publishingarray[] = array('title' => $row->title,
								'total_ranking_publishing'=>$row->total_ranking_publishing,
								'state'=>$row->state,
								'price'=>$row->price,
								'thumnail'=>$row->thumnail );

		}
		$ello= 'ello word';
		return view('frontend.index',['publishingarray'=>$publishingarray,'ello'=>$ello]);
		          //.view('frontend.body').view('frontend.footer');
		
		//return view('frontend.footer');
	}

}
