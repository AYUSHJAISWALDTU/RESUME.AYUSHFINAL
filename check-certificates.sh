#!/bin/bash

echo "🏆 CERTIFICATE IMAGES INSTALLER"
echo "================================"
echo ""
echo "📁 Certificate images should be placed in:"
echo "   /Users/akjaiswal/Desktop/resume/assets/certificates/"
echo ""
echo "📋 REQUIRED FILES:"
echo "   ✅ dsa-mastermind.jpg     (DSA MasterMind Certificate)"
echo "   ✅ spark-iit.jpg          (SparkIIT Certificate)"  
echo "   ✅ code-for-bharat.jpg    (Code for Bharat Certificate)"
echo ""

# Check current status
CERT_DIR="/Users/akjaiswal/Desktop/resume/assets/certificates"

echo "📊 CURRENT STATUS:"
if [ -f "$CERT_DIR/dsa-mastermind.jpg" ]; then
    echo "   ✅ DSA MasterMind: Found"
else
    echo "   ❌ DSA MasterMind: Missing"
fi

if [ -f "$CERT_DIR/spark-iit.jpg" ]; then
    echo "   ✅ SparkIIT: Found"
else
    echo "   ❌ SparkIIT: Missing"
fi

if [ -f "$CERT_DIR/code-for-bharat.jpg" ]; then
    echo "   ✅ Code for Bharat: Found"
else
    echo "   ❌ Code for Bharat: Missing"
fi

echo ""
echo "🔧 TO ADD YOUR CERTIFICATES:"
echo "1. Save your certificate images as JPG files"
echo "2. Rename them to match the required names above"
echo "3. Copy them to: $CERT_DIR"
echo "4. Refresh your portfolio browser"
echo ""
echo "💡 TIP: You can drag and drop images into the certificates folder!"
echo ""
echo "🌐 View your portfolio:"
echo "   file:///Users/akjaiswal/Desktop/resume/index.html"
echo ""

# List current files
echo "📂 Current files in certificates folder:"
ls -la "$CERT_DIR"
