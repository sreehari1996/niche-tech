$all = Get-Content 'css/style.css'
$prefix = $all[0..1903]
$suffix = $all[2487..($all.Length - 1)]
$newBlock = Get-Content 'scratch/temp_product_compact.css'
Set-Content 'css/style.css' ($prefix + $newBlock + $suffix)
Write-Host "Updated css/style.css successfully"
