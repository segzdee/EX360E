<?php
// SeedData.php

class SeedData {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function seedUsers() {
        $users = [
            [
                'email' => 'agency@test.com',
                'password' => password_hash('password123', PASSWORD_DEFAULT),
                'user_type' => 'agency'
            ],
            [
                'email' => 'client@test.com',
                'password' => password_hash('password123', PASSWORD_DEFAULT),
                'user_type' => 'client'
            ],
            [
                'email' => 'staff@test.com',
                'password' => password_hash('password123', PASSWORD_DEFAULT),
                'user_type' => 'staff'
            ]
        ];

        foreach ($users as $user) {
            // Insert user
        }
    }

    public function seedShifts() {
        $shifts = [
            [
                'title' => 'Warehouse Worker Needed',
                'description' => 'General warehouse duties',
                'location' => '123 Warehouse St',
                'latitude' => 51.5074,
                'longitude' => -0.1278,
                'start_time' => '2025-01-10 09:00:00',
                'end_time' => '2025-01-10 17:00:00',
                'pay_rate' => 15.50,
                'instant_approval' => true
            ],
            // More test shifts...
        ];

        foreach ($shifts as $shift) {
            // Insert shift
        }
    }

    public function seedQualifications() {
        $qualifications = [
            ['name' => 'Forklift License', 'validity_period' => 24],
            ['name' => 'Food Safety Certificate', 'validity_period' => 12],
            ['name' => 'First Aid', 'validity_period' => 36]
        ];

        foreach ($qualifications as $qual) {
            // Insert qualification
        }
    }

    public function runAllSeeds() {
        $this->seedUsers();
        $this->seedShifts();
        $this->seedQualifications();
        // Additional seed methods...
    }
}