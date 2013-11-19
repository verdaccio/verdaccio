This is mostly basic linux server configuration stuff but I felt it important to document and share the steps I took to get sinopia running permanently on my server. You will need root (or sudo) permissions for the following.

## Running as a separate user
First create the sinopia user:
```bash
$ sudo adduser --disabled-login --gecos 'Sinopia NPM mirror' sinopia
```

You create a shell as the sinopia user using the following command:
```bash
$ sudo su sinopia
$ cd ~
```

The 'cd ~' command send you to the home directory of the sinopia user. Make sure you run sinopia at least once to generate the config file. Edit it according to your needs.

## Listening on all addresses
If you want to listen to every external address set the listen directive in the config to:
```
# you can specify listen address (or simply a port)
listen: 0.0.0.0:4873
```

## Keeping sinopia running forever
We can use the node package called 'forever' to keep sinopia running all the time.
https://github.com/nodejitsu/forever

First install forever globally:
```bash
$ sudo npm install -g forever
```

Make sure you've started sinopia at least once to generate the config file and write down the created admin user. You can then use the following command to start sinopia:
```bash
$ forever start `which sinopia`
```

You can check the documentation for more information on how to use forever.

## Surviving server restarts
We can use crontab and forever together to restart sinopia after a server reboot.
When you're logged in as the sinopia user do the following:

```bash
$ crontab -e
```

This might ask you to choose an editor. Pick your favorite and proceed.
Add the following entry to the file:
```
@reboot /usr/bin/forever start /usr/lib/node_modules/sinopia/bin/sinopia
```

The locations may vary depending on your server setup. If you want to know where your files are you can use the 'which' command:
```bash
$ which forever
$ which sinopia
```