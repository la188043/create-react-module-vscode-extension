#!/bin/bash

style_extension="$2"

if [ -z $1 ]; then
	echo "A component name must be specified as first parameter\nYou can also specify style file extension as second parameter"
	exit 1
fi

if [ -z $2 ]; then
	style_extension="scss"
fi

mkdir $1

# Creating .tsx file
echo -e "import React from 'react';\n
import styles from './$1.module.$style_extension';\n
interface Props {\n}\n
const $1 = (props: Props) => {
  const {} = props;\n
  return (
  );
};\n
export default $1;
" > "$1"/"$1".tsx

# Creating index.ts file
echo -e "export { default } from './$1'\n" > "$1"/index.ts

# Creating style file
touch "$1"/"$1".module."$style_extension"

