#!/bin/bash
export PATH="$HOME/go/bin:$PATH"

name=""

usage () {
  echo "Usage: ./create_migration OPTIONS"
  echo ""
  echo "OPTIONS:"
  echo "      -h       Display this help message"
  echo "      -n       Migration name"
  echo ""
  echo "Commands:"
  echo "      ./create_migration.sh -n migration_name"
}

while getopts ":n:h" opt;
do
  case "$opt" in
    h )
      usage;
      exit 1
      ;;
    n )
      name=$OPTARG
      ;;
    \? ) echo "Unknown option: -$OPTARG" 1>&2
      exit 1
      ;;
  esac
done

if ((OPTIND == 1))
then
    echo "No options specified"
    exit 1;
fi

shift $((OPTIND -1))

migrate create -ext sql -dir 'db/migrations' -format unix $name