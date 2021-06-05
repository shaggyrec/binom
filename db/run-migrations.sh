#!/bin/bash

db_name=""
db_type=""
db_user=""
db_password="password"
db_host=""
db_port=""
path="."
count=""

usage () {
  echo "Usage: ./run_migrate OPTIONS"
  echo ""
  echo "OPTIONS:"
  echo "      -h       Display this help message"
  echo "      -d       Database name"
  echo "      -t       Database type"
  echo "      -u       Database user"
  echo "      -p       Database password"
  echo "      -H       Database host"
  echo "      -P       Database port"
  echo "      -i       Path to migration files"
  echo "      -c N     Up migration count"
  echo ""
  echo "Commands:"
  echo "      ./run_migrate -d database -t type -u user -p password -H host -P port -i path/to/migrations [-c N]"
}

while getopts ":d:t:u:p:H:P:i:c:h" opt;
do
  case "$opt" in
    h )
      usage;
      exit 1
      ;;
    c )
      count=$OPTARG
      ;;
    d )
      db_name=$OPTARG
      ;;
    t )
      db_type=$OPTARG
      ;;
    u )
      db_user=$OPTARG
      ;;
    p )
      db_password=`python -c "import urllib.parse; print(urllib.parse.quote('$OPTARG', ''))"`
      ;;
    H )
      db_host=$OPTARG
      ;;
    P )
      db_port=$OPTARG
      ;;
    i )
      path=$OPTARG
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

export PATH="$HOME/go/bin:$PATH"
migrate -database "$db_type://$db_user:$db_password@tcp($db_host:$db_port)/$db_name" -path $path up $count