
echo "$@"

set -eu
#set -o xtrace

BASE_DIR="$(dirname "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)")"
#TMP_DIR="$(mktemp -d)"
#DEST="${TMP_DIR}/addon"
ADDON_VERSION=$(node -p -e "require('./package.json').version");
ADDON_ID=$(node -p -e "require('./package.json').addon.id")
XPI_NAME=target.xpi

pushd addon > /dev/null
zip -r  "../${XPI_NAME}" .
popd > /dev/null

echo "SUCCESS: xpi at ${XPI_NAME}"
