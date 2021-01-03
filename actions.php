<?php

$action = $_GET['action'];

const FOLDER_PATH = 'suborSuborov/';

if ($action) {
    switch ($action) {
        case 'track-score':
            $scoreFile = FOLDER_PATH . 'score.txt';

            $score = $_POST['score'];
            $ip = $_SERVER['REMOTE_ADDR'];
            
            $currentScoreFile = file_get_contents($scoreFile);

            if (!$currentScoreFile) {
                $currentScoreFile = '';
            }

            $currentScoreFile .= $ip . ': ' . $score . PHP_EOL . PHP_EOL;

            file_put_contents($scoreFile, $currentScoreFile);

            break;
    }
}