<?php
/* ==========================================================================
   WHITE SHARK CONSULTING — php/enviar.php
   Recibe el formulario de contacto (fetch), valida en servidor, filtra spam
   y envía el mensaje por email. Responde siempre en JSON:
   { "ok": true|false, "message": "..." }
   Hosting: Hostinger (PHP 8.x, función mail() disponible).
   ========================================================================== */

declare(strict_types=1);

/* --------------------------------------------------------------------------
   1. Configuración
   -------------------------------------------------------------------------- */
// [PENDIENTE] Email que recibirá los mensajes del formulario.
const DESTINATARIO = '';
// [PENDIENTE] Remitente: debe ser una cuenta del propio dominio (ej.: web@whitesharkconsulting.com)
// para que Hostinger no marque los envíos como spam (SPF/DKIM).
const REMITENTE = '';
const NOMBRE_WEB = 'WHITE SHARK CONSULTING';
const TIEMPO_MINIMO = 3;   // segundos mínimos entre carga y envío (los bots son más rápidos)
const LIMITE_ENVIOS = 5;   // envíos máximos por sesión y hora

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

/* --------------------------------------------------------------------------
   2. Textos de respuesta por idioma
   -------------------------------------------------------------------------- */
$lang = (isset($_POST['lang']) && $_POST['lang'] === 'en') ? 'en' : 'es';

$T = [
    'es' => [
        'ok'        => 'Gracias por tu mensaje. Te responderemos lo antes posible.',
        'method'    => 'Método no permitido.',
        'invalid'   => 'Revisa los campos del formulario: ',
        'nombre'    => 'el nombre es obligatorio',
        'email'     => 'el email no es válido',
        'telefono'  => 'el teléfono no es válido',
        'mensaje'   => 'el mensaje debe tener entre 10 y 5000 caracteres',
        'privacidad'=> 'debes aceptar la política de privacidad',
        'limit'     => 'Has enviado demasiados mensajes. Inténtalo más tarde.',
        'error'     => 'No se ha podido enviar el mensaje. Inténtalo de nuevo o escríbenos por email.',
        'config'    => 'El formulario aún no está configurado. Escríbenos directamente por email.',
        'subject'   => 'Nuevo contacto desde la web',
    ],
    'en' => [
        'ok'        => 'Thank you for reaching out. We will get back to you shortly.',
        'method'    => 'Method not allowed.',
        'invalid'   => 'Please review the form: ',
        'nombre'    => 'name is required',
        'email'     => 'email address is not valid',
        'telefono'  => 'phone number is not valid',
        'mensaje'   => 'message must be between 10 and 5,000 characters',
        'privacidad'=> 'you must accept the Privacy Policy',
        'limit'     => 'Too many messages sent. Please try again later.',
        'error'     => 'Your message could not be sent. Please try again or email us directly.',
        'config'    => 'The contact form is not configured yet. Please email us directly.',
        'subject'   => 'New website inquiry',
    ],
][$lang];

function responder(bool $ok, string $message, int $status = 200): void
{
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

/* --------------------------------------------------------------------------
   3. Comprobaciones previas
   -------------------------------------------------------------------------- */
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    responder(false, $T['method'], 405);
}

// Honeypot: si el campo oculto viene relleno, es un bot. Respondemos "ok" sin enviar.
if (!empty($_POST['website'])) {
    responder(true, $T['ok']);
}

// Trampa de tiempo: envío demasiado rápido = bot.
$ts = isset($_POST['_ts']) ? (int) $_POST['_ts'] : 0;
if ($ts > 0 && (time() - $ts) < TIEMPO_MINIMO) {
    responder(true, $T['ok']);
}

// Límite de envíos por sesión.
session_start();
$ahora = time();
$_SESSION['envios'] = array_filter($_SESSION['envios'] ?? [], fn($t) => $t > $ahora - 3600);
if (count($_SESSION['envios']) >= LIMITE_ENVIOS) {
    responder(false, $T['limit'], 429);
}

/* --------------------------------------------------------------------------
   4. Limpieza y validación en servidor
   -------------------------------------------------------------------------- */
function limpiar(string $key, int $max): string
{
    $v = isset($_POST[$key]) ? (string) $_POST[$key] : '';
    $v = trim(strip_tags($v));
    $v = str_replace(["\r", "\0"], '', $v);
    return mb_substr($v, 0, $max);
}
// Elimina saltos de línea en campos de una sola línea (evita inyección de cabeceras).
function linea(string $v): string
{
    return trim(preg_replace('/[\n\t]+/', ' ', $v));
}

$nombre     = linea(limpiar('nombre', 100));
$empresa    = linea(limpiar('empresa', 120));
$email      = linea(limpiar('email', 150));
$telefono   = linea(limpiar('telefono', 25));
$pais       = linea(limpiar('pais', 80));
$mensaje    = limpiar('mensaje', 5000);
$privacidad = isset($_POST['privacidad']) && $_POST['privacidad'] === '1';

$errores = [];
if ($nombre === '')                                    $errores[] = $T['nombre'];
if (!filter_var($email, FILTER_VALIDATE_EMAIL))        $errores[] = $T['email'];
if ($telefono !== '' && !preg_match('/^[+()\d\s.\-]{6,25}$/', $telefono)) $errores[] = $T['telefono'];
if (mb_strlen($mensaje) < 10)                          $errores[] = $T['mensaje'];
if (!$privacidad)                                      $errores[] = $T['privacidad'];

if ($errores) {
    responder(false, $T['invalid'] . implode(', ', $errores) . '.', 422);
}

if (DESTINATARIO === '' || REMITENTE === '') {
    responder(false, $T['config'], 503);
}

/* --------------------------------------------------------------------------
   5. Composición y envío del email
   -------------------------------------------------------------------------- */
$asunto = '=?UTF-8?B?' . base64_encode($T['subject'] . ' — ' . $nombre) . '?=';

$cuerpo  = $T['subject'] . "\n";
$cuerpo .= str_repeat('-', 40) . "\n";
$cuerpo .= "Nombre / Name:     {$nombre}\n";
$cuerpo .= "Empresa / Company: " . ($empresa ?: '-') . "\n";
$cuerpo .= "Email:             {$email}\n";
$cuerpo .= "Teléfono / Phone:  " . ($telefono ?: '-') . "\n";
$cuerpo .= "País / Country:    " . ($pais ?: '-') . "\n";
$cuerpo .= "Idioma / Language: " . strtoupper($lang) . "\n";
$cuerpo .= str_repeat('-', 40) . "\n\n";
$cuerpo .= $mensaje . "\n\n";
$cuerpo .= str_repeat('-', 40) . "\n";
$cuerpo .= "Privacidad aceptada / Privacy accepted: " . date('Y-m-d H:i:s') . "\n";
$cuerpo .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? '-') . "\n";

$cabeceras  = 'From: ' . NOMBRE_WEB . ' <' . REMITENTE . ">\r\n";
$cabeceras .= 'Reply-To: ' . $nombre . ' <' . $email . ">\r\n";
$cabeceras .= "MIME-Version: 1.0\r\n";
$cabeceras .= "Content-Type: text/plain; charset=UTF-8\r\n";
$cabeceras .= "Content-Transfer-Encoding: 8bit\r\n";
$cabeceras .= 'X-Mailer: PHP/' . PHP_VERSION;

$enviado = @mail(DESTINATARIO, $asunto, $cuerpo, $cabeceras, '-f' . REMITENTE);

if (!$enviado) {
    responder(false, $T['error'], 500);
}

$_SESSION['envios'][] = $ahora;
responder(true, $T['ok']);
