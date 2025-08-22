#!/bin/bash
# Restaurant Business Plan Calculator Launcher
# Double-click this file to open the calculator

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Open the calculator in the default browser
open "$DIR/restaurant-business-plan-calculator.html"

echo "Opening Restaurant Business Plan Calculator..."
echo "The calculator should open in your default web browser."
echo "If it doesn't open automatically, you can manually open:"
echo "$DIR/restaurant-business-plan-calculator.html"

# Keep the terminal open for a moment
sleep 2 