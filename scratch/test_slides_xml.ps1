Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Clean-And-Escape-Xml([string]$str) {
    if ([string]::IsNullOrEmpty($str)) { return "" }
    $unescaped = $str.Replace("&amp;", "&").Replace("&apos;", "'").Replace("&quot;", '"').Replace("&lt;", "<").Replace("&gt;", ">")
    return $unescaped.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace('"', "&quot;").Replace("'", "&apos;")
}

function Safe-Xml-Replace([string]$xml, [string]$target, [string]$replacement) {
    if ($xml.Contains($target)) {
        return $xml.Replace($target, $replacement)
    }
    $withApos = $target.Replace("'", "&apos;")
    if ($xml.Contains($withApos)) {
        return $xml.Replace($withApos, $replacement)
    }
    $withSingleQuote = $target.Replace("&apos;", "'")
    if ($xml.Contains($withSingleQuote)) {
        return $xml.Replace($withSingleQuote, $replacement)
    }
    return $xml
}

$baseDir = "c:\Users\MohamedDIALLO\WORKSPACE\Outils\Logiciel Travail\incident-hub\lib\templates\pptx-template"

# Incident INC-AFG-001
$ref = "INC-AFG-001"
$title = "IHM Payway - Indisponibilité interface web après changement de mot de passe (Divergence Key/Salt sur ama-gabon-core)"
$domain = "FRONTAL WEB & APPLICATIONS"
$component = "ama-gabon-core (Wallet Manager)"
$subsidiary = "AFG"
$referent = "Achraf"
$dateFormatted = "06/11/2026"
$errorCode = "DE39=91"
$channel = "IHM Payway / Web & Mobile (PayGate)"
$network = "Réseau Interne AFG Gabon / PayLogic"
$hostName = "srv-afg-payway-01"

$slide1Title = "$ref - $title"
if ($slide1Title.Length -gt 75) {
    $slide1Title = $slide1Title.Substring(0, 75) + "..."
}

# Slide 1
$s1 = [System.IO.File]::ReadAllText("$baseDir\ppt\slides\slide1.xml", [System.Text.Encoding]::UTF8)
$s1 = Safe-Xml-Replace $s1 "FICHE INCIDENT  |  USAGE INTERNE" "FICHE INCIDENT [AFG]  |  USAGE INTERNE"
$s1 = Safe-Xml-Replace $s1 "IHM Payway indisponible" (Clean-And-Escape-Xml $slide1Title)
$s1 = Safe-Xml-Replace $s1 "après le changement des mots de passe" (Clean-And-Escape-Xml "$domain • ama-gabon-core")
$s1 = Safe-Xml-Replace $s1 "06/11/2026" $dateFormatted
$s1 = Safe-Xml-Replace $s1 "Achraf" (Clean-And-Escape-Xml $referent)
$s1 = Safe-Xml-Replace $s1 "Solution finale identifiée" "Solution Validée"

try {
    $x = [xml]$s1
    Write-Output "Slide 1 XML: VALID"
} catch {
    Write-Output "Slide 1 XML: ERROR -> $_"
}

# Slide 4
$s4 = [System.IO.File]::ReadAllText("$baseDir\ppt\slides\slide4.xml", [System.Text.Encoding]::UTF8)
$s4 = Safe-Xml-Replace $s4 "Inventaire des services" "Architecture des composants impactés"
$s4 = Safe-Xml-Replace $s4 "Payway IHM" (Clean-And-Escape-Xml "Canal : IHM Payway")
$s4 = Safe-Xml-Replace $s4 "Interface web : celle qui ne s'affichait pas" (Clean-And-Escape-Xml "Point d'initiation et capture du flux client (IHM Payway)")
$s4 = Safe-Xml-Replace $s4 "Pay3DS" (Clean-And-Escape-Xml "Réseau : Réseau Interne AFG")
$s4 = Safe-Xml-Replace $s4 "Authentification 3-D Secure" (Clean-And-Escape-Xml "Passerelle d'autorisation sécurisée")
$s4 = Safe-Xml-Replace $s4 "Interface Payway" (Clean-And-Escape-Xml "Serveur : srv-afg-payway-01")
$s4 = Safe-Xml-Replace $s4 "Service d'interfaçage" (Clean-And-Escape-Xml "Environnement d'exécution PRODUCTION")
$s4 = Safe-Xml-Replace $s4 "PayGate" "Module Sécurité HSM"
$s4 = Safe-Xml-Replace $s4 "Gère les applications mobiles" "Validation PIN, calcul ARQC/ARPC et clés de chiffrement"
$s4 = $s4 -replace '<a:schemeClr val="bg1"/><\/a:rPr><a:t>ama-gabon-core<\/a:t>', '<a:schemeClr val="bg1"/></a:rPr><a:t>ama-gabon-core</a:t>'
$s4 = Safe-Xml-Replace $s4 "(Wallet Manager)" "(DE39=91)"
$s4 = Safe-Xml-Replace $s4 "Service en cause : key/salt différents" "Composant défaillant : anomalie DE39=91 constatée"
$s4 = $s4 -replace '<a:schemeClr val="tx2"/><\/a:rPr><a:t>ama-gabon-core<\/a:t>', '<a:schemeClr val="tx2"/></a:rPr><a:t>Core Banking CBS</a:t>'
$s4 = Safe-Xml-Replace $s4 "(Notification Manager)" "(AFG Amplitude)"
$s4 = Safe-Xml-Replace $s4 "Service de notifications" "Tenue de compte, réservation solde et balance comptable"

try {
    $x = [xml]$s4
    Write-Output "Slide 4 XML: VALID"
} catch {
    Write-Output "Slide 4 XML: ERROR -> $_"
}

# Slide 10
$s10 = [System.IO.File]::ReadAllText("$baseDir\ppt\slides\slide10.xml", [System.Text.Encoding]::UTF8)
$s10 = Safe-Xml-Replace $s10 "<a:t>6</a:t>" "<a:t>6</a:t>"
$s10 = Safe-Xml-Replace $s10 "services Payway à contrôler" "composants de la chaîne monétique mobilisés"
$s10 = Safe-Xml-Replace $s10 "<a:t>2</a:t>" "<a:t>91</a:t>"
$s10 = Safe-Xml-Replace $s10 "propriétés à réencrypter : key et salt" "code retour analysé lors de l'investigation (DE39=91)"
$s10 = Safe-Xml-Replace $s10 "<a:t>1</a:t>" "<a:t>100%</a:t>"
$s10 = Safe-Xml-Replace $s10 "règle : key et salt identiques partout" "conformité de la procédure capitalisée au référentiel"

try {
    $x = [xml]$s10
    Write-Output "Slide 10 XML: VALID"
} catch {
    Write-Output "Slide 10 XML: ERROR -> $_"
}

