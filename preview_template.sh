#!/bin/bash

# Output directory
OUTPUT_DIR="preview/templates"
TEMPLATE_FILE="$OUTPUT_DIR/index.html"

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

# Generate preview HTML
cat > "$TEMPLATE_FILE" << 'HTML'
<!DOCTYPE html>
<html lang="en" dir="ltr" data-theme="light">
<head>
    <!-- (Previous preview HTML content remains the same) -->
</head>
<body>
    <!-- (Previous preview body content remains the same) -->
</body>
</html>
HTML

# Open the preview in the default browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "$TEMPLATE_FILE"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "$TEMPLATE_FILE"
elif [[ "$OSTYPE" == "msys" ]]; then
    start "$TEMPLATE_FILE"
else
    echo "Preview generated at: $TEMPLATE_FILE"
fi

echo "Template preview generated successfully!"
