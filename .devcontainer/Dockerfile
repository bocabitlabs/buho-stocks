FROM buhostocksdocker

# https://github.com/microsoft/vscode-dev-containers/blob/main/script-library/docs/common.md
COPY .devcontainer/library-scripts/common-debian.sh /tmp/library-scripts/
RUN apt-get update && bash /tmp/library-scripts/common-debian.sh