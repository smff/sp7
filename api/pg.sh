#!/bin/bash

docker run -d -e POSTGRES_DB=sp7 -p 5432:5432 --name sp7_db postgres