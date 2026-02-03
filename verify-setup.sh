#!/bin/bash

# Schema-First Prototyping - Setup Verification Script
# This script verifies that your environment is ready for development

set -e

echo "🔍 Schema-First Prototyping - Setup Verification"
echo "================================================"
echo ""

# Check Node.js
echo "Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js installed: $NODE_VERSION"
    
    # Check if version is 18 or higher
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -lt 18 ]; then
        echo "⚠️  Warning: Node.js 18+ recommended (you have v$NODE_MAJOR)"
    fi
else
    echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check npm
echo ""
echo "Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm installed: $NPM_VERSION"
else
    echo "❌ npm not found. Please install npm."
    exit 1
fi

# Check Git
echo ""
echo "Checking Git..."
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo "✅ Git installed: $GIT_VERSION"
else
    echo "⚠️  Git not found. Git is recommended for version control."
fi

# Check template UI
echo ""
echo "Checking template UI..."
if [ -d "ui" ]; then
    echo "✅ Template UI directory found"
    
    if [ -f "ui/package.json" ]; then
        echo "✅ Template package.json found"
        
        if [ -d "ui/node_modules" ]; then
            echo "✅ Template dependencies installed"
        else
            echo "⚠️  Template dependencies not installed"
            echo "   Run: cd ui && npm install"
        fi
    else
        echo "❌ Template package.json not found"
    fi
else
    echo "❌ Template UI directory not found"
fi

# Check example
echo ""
echo "Checking ticketing example..."
if [ -d "examples/ticketing-system/ui" ]; then
    echo "✅ Example UI directory found"
    
    if [ -f "examples/ticketing-system/ui/package.json" ]; then
        echo "✅ Example package.json found"
        
        if [ -d "examples/ticketing-system/ui/node_modules" ]; then
            echo "✅ Example dependencies installed"
        else
            echo "⚠️  Example dependencies not installed"
            echo "   Run: cd examples/ticketing-system/ui && npm install"
        fi
    else
        echo "❌ Example package.json not found"
    fi
else
    echo "❌ Example UI directory not found"
fi

# Check schema files
echo ""
echo "Checking schema files..."
if [ -f "schema/api-contract.yaml" ]; then
    echo "✅ Template schema found"
else
    echo "⚠️  Template schema not found"
fi

if [ -f "examples/ticketing-system/schema/api-contract.yaml" ]; then
    echo "✅ Example schema found"
else
    echo "⚠️  Example schema not found"
fi

# Check AI skills
echo ""
echo "Checking AI skills..."
SKILLS_DIR=".claude/skills"
if [ -d "$SKILLS_DIR" ]; then
    echo "✅ Skills directory found"
    
    SKILL_COUNT=$(ls -1 "$SKILLS_DIR"/*.md 2>/dev/null | wc -l)
    echo "   Found $SKILL_COUNT skill(s)"
    
    if [ -f "$SKILLS_DIR/schema-evolution.md" ]; then
        echo "   ✅ schema-evolution.md"
    fi
    if [ -f "$SKILLS_DIR/concept-sync.md" ]; then
        echo "   ✅ concept-sync.md"
    fi
    if [ -f "$SKILLS_DIR/contract-validator.md" ]; then
        echo "   ✅ contract-validator.md"
    fi
else
    echo "⚠️  Skills directory not found"
fi

# Summary
echo ""
echo "================================================"
echo "📋 Summary"
echo "================================================"
echo ""

if [ -d "ui/node_modules" ] && [ -d "examples/ticketing-system/ui/node_modules" ]; then
    echo "✅ Setup complete! You're ready to start."
    echo ""
    echo "Next steps:"
    echo "  1. Run the example: cd examples/ticketing-system/ui && npm run dev"
    echo "  2. Or start your project: cd ui && npm run dev"
    echo "  3. Read the docs: docs/workflow-walkthrough.md"
else
    echo "⚠️  Setup incomplete. Please install dependencies:"
    echo ""
    if [ ! -d "ui/node_modules" ]; then
        echo "  Template: cd ui && npm install"
    fi
    if [ ! -d "examples/ticketing-system/ui/node_modules" ]; then
        echo "  Example: cd examples/ticketing-system/ui && npm install"
    fi
fi

echo ""
