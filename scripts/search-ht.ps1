param(
    [Parameter(Mandatory = $true)]
    [string]$Query,

    [int]$Size = 5,

    [ValidateSet('nl', 'en')]
    [string]$Lang = 'nl',

    [string]$Title
)

$apiKeyB64 = 'MEVCX1NwSUI5bklnQTlEMDRRakU6TVFEc3kyOWVTMldlRlF6dWUzY0VEZw=='
$baseUrl = 'https://search.hiddentreasures.org/elasticsearch'
$index = "search-$Lang"

$headers = @{
    Authorization = "ApiKey $apiKeyB64"
    'Content-Type' = 'application/json'
}

if ($Title) {
    $body = @{
        from = 0
        size = 1
        query = @{
            bool = @{
                must = @(
                    @{ range = @{ public_section_lang_access_level = @{ lte = 2 } } }
                    @{ match_phrase = @{ public_section_lang_title = $Title } }
                )
            }
        }
    }
} else {
    $body = @{
        from = 0
        size = $Size
        query = @{
            function_score = @{
                query = @{
                    bool = @{
                        must = @(
                            @{ range = @{ public_section_lang_access_level = @{ lte = 2 } } }
                            @{
                                simple_query_string = @{
                                    query = $Query
                                    fields = @('public_section_lang_body_plain', 'public_section_lang_title')
                                    default_operator = 'and'
                                }
                            }
                        )
                    }
                }
                functions = @(
                    @{
                        filter = @{ terms = @{ public_section_lang_author_id = @(20, 80, 432, 543, 577, 578, 583, 586) } }
                        weight = 1.5
                    }
                )
            }
        }
        highlight = @{
            fields = @{
                public_section_lang_title = @{}
                public_section_lang_body_plain = @{ fragment_size = 300; number_of_fragments = 1 }
            }
        }
    }
}

$json = $body | ConvertTo-Json -Depth 20
$response = Invoke-RestMethod -Uri "$baseUrl/$index/_search" -Method POST -Headers $headers -Body $json

if ($Title) {
    $hit = $response.hits.hits[0]
    if (-not $hit) {
        Write-Output "Geen artikel gevonden met titel: $Title"
        exit 1
    }
    $s = $hit._source
    Write-Output "Titel: $($s.public_section_lang_title)"
    Write-Output "Auteur: $($s.public_section_lang_author_full_name -join ', ')"
    Write-Output "Publicatie: $($s.public_section_lang_publication_name) ($($s.public_section_lang_combined_date))"
    Write-Output ""
    Write-Output $s.public_section_lang_body_plain
    exit 0
}

Write-Output "Resultaten: $($response.hits.total.value)"
Write-Output ""

foreach ($hit in $response.hits.hits) {
    $s = $hit._source
    Write-Output "---"
    Write-Output "Titel: $($s.public_section_lang_title)"
    Write-Output "Auteur: $($s.public_section_lang_author_full_name -join ', ')"
    Write-Output "Datum: $($s.public_section_lang_combined_date)"
    if ($hit.highlight.'public_section_lang_body_plain') {
        Write-Output "Fragment: $($hit.highlight.'public_section_lang_body_plain'[0])"
    }
    Write-Output ""
}
