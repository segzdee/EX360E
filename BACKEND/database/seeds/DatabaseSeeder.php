<?php
namespace Themes\Extrastaff\Database\Seeders;
use Database\Seeders\CandidateSeeder;
use Database\Seeders\CompaniesSeeder;
use Database\Seeders\GigSeeder;
use Database\Seeders\JobSeeder;
use Database\Seeders\Language;
use Database\Seeders\LocationSeeder;
use Database\Seeders\News;
use Database\Seeders\RolesAndPermissionsSeeder;
use Database\Seeders\UsersTableSeeder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class DatabaseSeeder extends Seeder
{
    public function run(){

        Artisan::call('cache:clear');

        $this->call(RolesAndPermissionsSeeder::class);
        $this->call(Language::class);
        $this->call(MediaFileSeeder::class);
        $this->call(UsersTableSeeder::class);
        $this->call(General::class);
        $this->call(LocationSeeder::class);
        $this->call(News::class);
        $this->call(CandidateSeeder::class);
        $this->call(JobSeeder::class);
        $this->call(CompaniesSeeder::class);
        $this->call(GigSeeder::class);
    }
}
