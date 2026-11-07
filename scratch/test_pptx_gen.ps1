Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$baseDir = "c:\Users\MohamedDIALLO\WORKSPACE\Outils\Logiciel Travail\incident-hub\lib\templates\pptx-template"
$outZip = "c:\Users\MohamedDIALLO\WORKSPACE\Outils\Logiciel Travail\incident-hub\scratch\test_INC-AFG-001.pptx"

if (Test-Path $outZip) { Remove-Item $outZip -Force }

# Read [Content_Types].xml
$ctPath = Join-Path $baseDir "[Content_Types].xml"
$ctText = [System.IO.File]::ReadAllText($ctPath, [System.Text.Encoding]::UTF8)

# Check all XML in template
Write-Output "Testing zip creation from template directory..."
[System.IO.Compression.ZipFile]::CreateFromDirectory($baseDir, $outZip)

Write-Output "Zip created: $(Get-Item $outZip | Select-Object -ExpandProperty Length) bytes"

# Now inspect every single entry in the created zip
$archive = [System.IO.Compression.ZipFile]::OpenRead($outZip)
$errors = 0
foreach ($entry in $archive.Entries) {
    if ($entry.Name -like "*.xml" -or $entry.Name -like "*.rels") {
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
        $text = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()

        try {
            $doc = New-Object System.Xml.XmlDocument
            $doc.LoadXml($text)
        } catch {
            Write-Output "XML ERROR in $($entry.FullName): $_"
            $errors++
        }
    }
}
$archive.Dispose()
Write-Output "Validation finished. Errors: $errors"

