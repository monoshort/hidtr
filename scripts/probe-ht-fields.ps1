param([string]$Title = "De ziel (psyche) en haar functie")
$apiKeyB64 = 'MEVCX1NwSUI5bklnQTlEMDRRakU6TVFEc3kyOWVTMldlRlF6dWUzY0VEZw=='
$headers = @{ Authorization = "ApiKey $apiKeyB64" }
$body = @{
    size = 1
    query = @{ match_phrase = @{ public_section_lang_title = $Title } }
} | ConvertTo-Json -Depth 5
$r = Invoke-RestMethod -Uri 'https://search.hiddentreasures.org/elasticsearch/search-nl/_search' -Method POST -Headers $headers -ContentType 'application/json' -Body $body -TimeoutSec 45
$r.hits.hits[0]._source.PSObject.Properties.Name | Sort-Object
Write-Output "---"
$r.hits.hits[0]._source | ConvertTo-Json -Depth 2
