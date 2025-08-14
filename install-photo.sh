#!/bin/bash

echo "🎯 PHOTO INSTALLATION FOR YOUR PORTFOLIO"
echo "========================================"
echo ""
echo "📱 Your portfolio is now viewable at:"
echo "   file:///Users/akjaiswal/Desktop/resume/index.html"
echo ""
echo "📸 TO ADD YOUR PHOTO:"
echo ""
echo "STEP 1: Copy Your Photo"
echo "   • Open Finder"
echo "   • Navigate to: /Users/akjaiswal/Desktop/ALL DATA/"
echo "   • Find your photo: imsgr,im.jpeg"
echo "   • Right-click and Copy (or Cmd+C)"
echo ""
echo "STEP 2: Paste to Portfolio"
echo "   • Navigate to: /Users/akjaiswal/Desktop/resume/assets/"
echo "   • Right-click and Paste (or Cmd+V)"
echo "   • Rename the file to: Ayush.png"
echo ""
echo "STEP 3: See Results"
echo "   • Refresh your browser"
echo "   • Your photo will appear instantly!"
echo ""
echo "🔧 ALTERNATIVE COMMAND:"
echo "   If the above doesn't work, try this in Terminal:"
echo '   cp "/Users/akjaiswal/Desktop/ALL DATA/imsgr,im.jpeg" "/Users/akjaiswal/Desktop/resume/assets/Ayush.png"'
echo ""
echo "✨ CURRENT STATUS:"
echo "   • Portfolio: ✅ Working"
echo "   • Placeholder: ✅ Shows 'AJ' avatar"
echo "   • Ready for: 📸 Your real photo"
echo ""
echo "💡 The portfolio will automatically fall back to the placeholder if your photo isn't found."
echo ""

# Try to copy the file if it exists
if [ -f "/Users/akjaiswal/Desktop/ALL DATA/imsgr,im.jpeg" ]; then
    echo "🎉 FOUND YOUR PHOTO! Copying automatically..."
    if cp "/Users/akjaiswal/Desktop/ALL DATA/imsgr,im.jpeg" "/Users/akjaiswal/Desktop/resume/assets/Ayush.png"; then
        echo "✅ SUCCESS! Your photo has been added to the portfolio!"
        echo "🔄 Refresh your browser to see the changes."
        ls -la "/Users/akjaiswal/Desktop/resume/assets/Ayush.png"
    else
        echo "❌ Auto-copy failed. Please use manual method above."
    fi
else
    echo "📁 Photo not found at expected location. Please use manual method above."
fi
