Add-Type -AssemblyName System.Drawing

$srcPath = "d:\Niche\Niche Global_ Talent and Transformation.png"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)
$outDir = "d:\Niche\assets\images"
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

function Crop-Image($x, $y, $w, $h, $filename) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $cropped = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($cropped)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $g.DrawImage($img, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $destPath = Join-Path $outDir $filename
    $cropped.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
    Write-Output "Saved $filename ($w x $h)"
}

# 1. Hero Skyline & Man with tablet (Right side of Hero, unclipped rect)
Crop-Image 320 0 405 325 "hero-man-skyline.png"

# 2. Boardroom silhouettes (About section)
Crop-Image 0 715 365 210 "about-boardroom.png"

# 3. Process Architecture glass building
Crop-Image 54 1120 255 125 "process-building.png"

# 4. Work: Enterprise Software Platform
Crop-Image 295 1340 235 145 "work-enterprise.png"

# 5. Work: Digital Product
Crop-Image 540 1354 130 130 "work-digital-product.png"

# 6. Insights: Card 1 (Global Talent)
Crop-Image 245 1524 135 76 "insight-talent.png"

# 7. Insights: Card 2 (Product Engineering)
Crop-Image 392 1524 135 76 "insight-engineering.png"

# 8. Insights: Card 3 (Digital Transformation)
Crop-Image 538 1524 135 76 "insight-transformation.png"

# 9. Testimonials: Michael Carter avatar
Crop-Image 54 1832 26 26 "avatar-michael.png"

# 10. Testimonials: Priya Nair avatar
Crop-Image 308 1832 26 26 "avatar-priya.png"

# 11. Testimonials: Right skyline
Crop-Image 550 1690 175 190 "testimonial-skyline.png"

# 12. Contact: Professional Woman in suit
Crop-Image 0 1880 256 182 "contact-woman.png"

# 13. Brand Logo mark
Crop-Image 52 14 20 22 "logo-mark.png"

$img.Dispose()
Write-Output "All assets extracted successfully."
