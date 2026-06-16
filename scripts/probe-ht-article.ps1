param([int]$SectionId = 7082)
$apiKeyB64 = 'MEVCX1NwSUI5bklnQTlEMDRRakU6TVFEc3kyOWVTMldlRlF6dWUzY0VEZw=='
$headers = @{ Authorization = "ApiKey $apiKeyB64" }
$body = @{
    size = 5
    query = @{ term = @{ public_section_lang_section_id = $SectionId } }
    _source = @('public_section_lang_title','public_section_lang_combined_date','public_section_lang_sub_index_id','public_section_lang_lang_id','public_section_lang_publication_name')
} | ConvertTo-Json -Depth 5
foreach ($lang in @('nl','en','no')) {
    Write-Output "=== $lang ==="
    $r = Invoke-RestMethod -Uri "https://search.hiddentreasures.org/elasticsearch/search-$lang/_search" -Method POST -Headers $headers -ContentType 'application/json' -Body $body -TimeoutSec 45
    foreach ($hit in $r.hits.hits) {
        $s = $hit._source
        Write-Output "$($s.public_section_lang_title) | $($s.public_section_lang_combined_date) | sub=$($s.public_section_lang_sub_index_id)"
    }
}
