<?php namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\Guard;
use DB;


class WelcomeController extends Controller {

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
		$exit= view('frontend.header',compact("content")).view('frontend.body').view('frontend.footer');
		return $exit;
		//return view('frontend.footer');
	}

}
