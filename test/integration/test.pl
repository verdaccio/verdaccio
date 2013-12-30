#!/usr/bin/perl

# note to readers: in perl it's useful, in javascript it isn't
use strict;

# setting up working environment && chdir there
use Cwd 'abs_path';
use File::Basename;
$ENV{HOME} = dirname(abs_path( __FILE__ )) . '/.sinopia_test_env';
system('rm -rf .sinopia_test_env ; mkdir .sinopia_test_env') and quit('fail');
chdir $ENV{HOME};

use Data::Dumper;
my $pid;

sub quit {
	print $_[0]."\n";
	exec("kill $pid ; exit 1");
}

# run sinopia in a child process
if (($pid = fork()) == 0) {
	exec "../../../bin/sinopia ../config.yaml";
	die "exec failed";
}

system('mkdir node_modules') and quit('fail');
system('npm set sinopia_test_config 12345') and quit('fail');

if (`cat .npmrc` !~ /sinopia_test_config/) {
	quit "npm is using wrong config";
}

system('npm set registry http://localhost:55501') and quit('fail');
system(q{/bin/echo -e 'test\ntest\ns@s.s\n' | npm adduser}) and quit('fail');

system('npm install jju') and quit('fail');
(`node -e 'console.log(require("jju").parse("{qwerty:123}").qwerty+456)'` =~ /579/) or quit('fail');

system('npm publish ../sinopia-test-1.2.3.tgz') and quit('fail');
system('npm tag sinopia-test@1.2.3 meow') and quit('fail');
system('npm install sinopia-test@meow') and quit('fail');

(`node -e 'require("sinopia-test")'` =~ /w==w/) or quit('fail');

quit("
==================================================================
All tests seem to be executed successfully, nothing is broken yet.
==================================================================");

