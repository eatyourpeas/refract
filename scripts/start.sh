#!/usr/bin/env bash
set -euo pipefail

# Generate repo-info.json so the running app can show branch/commit
# Prefer git values when available, otherwise fall back to env vars.
REPO_ROOT=$(pwd)
BRANCH="${GIT_BRANCH:-}"
COMMIT="${GIT_COMMIT:-}"
REPO="${GIT_REPO:-eatyourpeas/refract}"

if [ -z "$COMMIT" ] || [ -z "$BRANCH" ]; then
	if [ -d ".git" ]; then
		# best-effort; these commands may be HEAD or detached in some CI setups
		BRANCH_CMD=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)
		COMMIT_CMD=$(git rev-parse HEAD 2>/dev/null || true)
		if [ -n "$BRANCH_CMD" ] && [ "$BRANCH_CMD" != "HEAD" ]; then
			BRANCH="$BRANCH_CMD"
		fi
		if [ -n "$COMMIT_CMD" ]; then
			COMMIT="$COMMIT_CMD"
		fi
		REMOTE_URL=$(git config --get remote.origin.url 2>/dev/null || true)
		if [ -n "$REMOTE_URL" ]; then
			# normalize to owner/repo if possible
			if [[ "$REMOTE_URL" == git@github.com:* ]]; then
				REPO=$(echo "$REMOTE_URL" | sed -E 's/git@github.com:(.*)\.git/\1/')
			else
				REPO=$(echo "$REMOTE_URL" | sed -E 's#https://github.com/##; s#\.git$##')
			fi
		fi
	fi
fi

cat > repo-info.json <<EOF
{ "branch": "${BRANCH}", "commit": "${COMMIT}", "repo": "${REPO}" }
EOF

echo "Wrote repo-info.json: branch=${BRANCH:-unknown} commit=${COMMIT:-unknown} repo=${REPO}"

# Usage: ./scripts/start.sh [--prod|--dev] [--build|--no-build]
# Default: dev (uses docker-compose.yml) and does not force an image rebuild.
MODE="dev"
FORCE_BUILD=""

for arg in "$@"; do
	case "$arg" in
		--prod|prod)
			MODE="prod"
			;;
		--dev|dev)
			MODE="dev"
			;;
		--build)
			FORCE_BUILD="1"
			;;
		--no-build)
			FORCE_BUILD="0"
			;;
		-h|--help)
			echo "Usage: $0 [--prod|--dev] [--build|--no-build]"
			exit 0
			;;
		*)
			echo "Unknown option: $arg" >&2
			echo "Usage: $0 [--prod|--dev] [--build|--no-build]"
			exit 2
			;;
	esac
done

if [ "$MODE" = "prod" ]; then
	DO_BUILD="1"
else
	DO_BUILD="0"
fi

if [ -n "$FORCE_BUILD" ]; then
	DO_BUILD="$FORCE_BUILD"
fi

if [ "$MODE" = "prod" ]; then
	echo "Starting production compose (docker-compose.prod.yml)"
	if [ "$DO_BUILD" = "1" ]; then
		echo "Build enabled"
		APP_ENV=production docker compose -f docker-compose.prod.yml up -d --build
	else
		echo "Build disabled"
		APP_ENV=production docker compose -f docker-compose.prod.yml up -d
	fi
else
	echo "Starting development compose (docker-compose.yml)"
	if [ "$DO_BUILD" = "1" ]; then
		echo "Build enabled"
		APP_ENV=development docker compose -f docker-compose.yml up -d --build
	else
		echo "Build disabled (use --build to rebuild image)"
		APP_ENV=development docker compose -f docker-compose.yml up -d
	fi
fi