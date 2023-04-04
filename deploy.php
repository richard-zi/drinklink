<?php

define('SECRET_TOKEN', 'W3hrm@ch7RechtenOffiz!€l1€Kl!m4Mu$57en');

$allowed_ips = [
    "192.30.252.0/22",
    "185.199.108.0/22",
    "140.82.112.0/20",
    "143.55.64.0/20",
    "2a0a:a440::/29",
    "2606:50c0::/32",
    "20.201.28.151/32",
    "20.205.243.166/32",
    "20.87.225.212/32",
    "20.248.137.48/32",
    "20.207.73.82/32",
    "20.27.177.113/32",
    "20.200.245.247/32",
    "20.233.54.53/32"
    // Fügen Sie hier weitere GitHub-IP-Adressen hinzu, wenn nötig
];

$remote_ip = $_SERVER['REMOTE_ADDR'];
$access_granted = false;

foreach ($allowed_ips as $ip_range) {
    if (ip_in_range($remote_ip, $ip_range)) {
        $access_granted = true;
        break;
    }
}

if (!$access_granted) {
    header('HTTP/1.0 403 Forbidden');
    echo "Zugriff verweigert";
    exit(1);
}

if (!isset($_SERVER['HTTP_X_HUB_SIGNATURE_256'])) {
    header('HTTP/1.0 403 Forbidden');
    echo "Zugriff verweigert";
    exit(1);
}

$request_body = file_get_contents('php://input');
$signature = hash_hmac('sha256', $request_body, SECRET_TOKEN);

if ('sha256=' . $signature !== $_SERVER['HTTP_X_HUB_SIGNATURE_256']) {
    header('HTTP/1.0 403 Forbidden');
    echo "Zugriff verweigert";
    exit(1);
}

$webRootDir = './'; // Ersetzen Sie dies durch den tatsächlichen Pfad zum Webstammverzeichnis auf Ihrem Server
$keyPath = 'root/.ssh/id_ed25519'; // Ersetzen Sie dies durch den Pfad zum privaten SSH-Schlüssel auf Ihrem Server

$commands = [
    "GIT_SSH_COMMAND='ssh -i $keyPath -o StrictHostKeyChecking=no' git -C $webRootDir reset --hard",
    "GIT_SSH_COMMAND='ssh -i $keyPath -o StrictHostKeyChecking=no' git -C $webRootDir pull",
];

foreach ($commands as $command) {
    $output = [];
    $return = 0;
    exec($command . ' 2>&1', $output, $return);

    if ($return !== 0) {
        echo "Fehler beim Ausführen des Befehls: $command\n";
        echo "Fehlercode: $return\n";
        echo "Ausgabe:\n";
        echo implode("\n", $output);
        exit(1);
    }
}

echo "Erfolgreich aktualisiert!\n";

function ip_in_range($ip, $range) {
    if (strpos($range, '/') === false) {
        $range .= '/32';
    }

    list($range_ip, $netmask) = explode('/', $range, 2);
    $ip_long = ip2long($ip);
    $range_ip_long = ip2long($range_ip);
    $wildcard = pow(2, 32 - $netmask) - 1;
    $netmask_long = ~$wildcard;

    return ($ip_long & $netmask_long) === ($range_ip_long & $netmask_long);
}


