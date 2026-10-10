#!/bin/bash
set -e

APP_NAME="PDF Tool"
BUILD_DIR="./build"
APP_BUNDLE="${BUILD_DIR}/${APP_NAME}.app"
CONTENTS="${APP_BUNDLE}/Contents"
MACOS_DIR="${CONTENTS}/MacOS"
RESOURCES_DIR="${CONTENTS}/Resources"

echo "🔨 Iniciando compilação do ${APP_NAME} para macOS..."

# 1. Limpar build anterior
rm -rf "${APP_BUNDLE}"
mkdir -p "${MACOS_DIR}"
mkdir -p "${RESOURCES_DIR}"

# 2. Copiar Info.plist
echo "📄 Copiando metadados (Info.plist)..."
cp "mac/Info.plist" "${CONTENTS}/Info.plist"

# 3. Copiar Ícone do Aplicativo (.icns)
if [ -f "assets/AppIcon.icns" ]; then
    echo "🎨 Copiando ícone oficial do macOS..."
    cp "assets/AppIcon.icns" "${RESOURCES_DIR}/AppIcon.icns"
fi

# 4. Copiar Recursos Web (HTML, CSS, JS, Vendor)
echo "📦 Copiando recursos da interface (HTML, CSS, JS, bibliotecas locais)..."
cp "src/index.html" "${RESOURCES_DIR}/index.html"
cp -R "src/css" "${RESOURCES_DIR}/"
cp -R "src/js" "${RESOURCES_DIR}/"
cp -R "src/vendor" "${RESOURCES_DIR}/"

# 5. Compilar binário Swift Universal (Apple Silicon arm64 + Intel x86_64)
echo "⚡ Compilando binário nativo Swift Universal (arm64 + x86_64)..."
swiftc -O -target arm64-apple-macos11.0 mac/main.swift -o "${MACOS_DIR}/${APP_NAME}_arm64"
swiftc -O -target x86_64-apple-macos11.0 mac/main.swift -o "${MACOS_DIR}/${APP_NAME}_x86_64"
lipo -create -output "${MACOS_DIR}/${APP_NAME}" "${MACOS_DIR}/${APP_NAME}_arm64" "${MACOS_DIR}/${APP_NAME}_x86_64"
rm -f "${MACOS_DIR}/${APP_NAME}_arm64" "${MACOS_DIR}/${APP_NAME}_x86_64"

chmod +x "${MACOS_DIR}/${APP_NAME}"

# 6. Assinatura ad-hoc (para execução local sem avisos de segurança no macOS)
echo "🔒 Aplicando assinatura de código ad-hoc..."
codesign --force --deep --sign - "${APP_BUNDLE}" 2>/dev/null || true
xattr -cr "${APP_BUNDLE}" 2>/dev/null || true

echo ""
echo "✅ Aplicativo compilado com sucesso!"
echo "📍 Localização do App: ${APP_BUNDLE}"
echo "📊 Tamanho total do pacote:"
du -sh "${APP_BUNDLE}"
echo ""
echo "🚀 Para abrir o aplicativo:"
echo "   open \"${APP_BUNDLE}\""
echo ""
echo "📥 Para instalar na pasta Aplicativos do Mac:"
echo "   cp -R \"${APP_BUNDLE}\" /Applications/"
