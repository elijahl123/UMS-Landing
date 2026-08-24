#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
output_dir="${project_dir}/dist"

if [[ "${output_dir}" != "${project_dir}/dist" ]]; then
  echo "Refusing to build outside the project dist directory" >&2
  exit 1
fi

mkdir -p "${output_dir}"
find "${output_dir}" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
mkdir -p "${output_dir}/assets" "${output_dir}/ucd" "${output_dir}/palomar" "${output_dir}/privacy-policy" "${output_dir}/terms"
cp "${project_dir}/index.html" "${project_dir}/manifest.json" "${project_dir}/sitemap.xml" "${project_dir}/offline.html" "${project_dir}/sw.js" "${output_dir}/"
cp "${project_dir}/ucd/index.html" "${output_dir}/ucd/index.html"
cp "${project_dir}/palomar/index.html" "${output_dir}/palomar/index.html"
cp "${project_dir}/privacy-policy/index.html" "${output_dir}/privacy-policy/index.html"
cp "${project_dir}/terms/index.html" "${output_dir}/terms/index.html"
cp -R "${project_dir}/assets/." "${output_dir}/assets/"

echo "Static site built at ${output_dir}"
