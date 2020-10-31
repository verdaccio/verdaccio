#!/usr/bin/env bash
sleep 5
ldapsearch -v -h openldap -x -D "cn=admin,dc=example,dc=org" -w admin -b "dc=example,dc=org" -s sub
ldapadd -v -h openldap -c -D "cn=admin,dc=example,dc=org" -w admin -f /ldif_files/people.ldif