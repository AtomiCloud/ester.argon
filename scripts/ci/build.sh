#!/usr/bin/env bash

set -eou pipefail
bun i
bunx --bun astro build
