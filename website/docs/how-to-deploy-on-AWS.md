---
id: aws
title: "Amazon Web Services"
---

This document describes simple steps to setup Verdaccio private registry on Amazon Web Services platform using EC2 service. This assumes you have already created an EC2 Amazon Linux instance; if not then please check this tutorial on [AWS EC2 Setup](https://www.howtoinmagento.com/2018/04/aws-cli-commands-for-aws-ec2-amazon.html).

## Setup & Configuration {#setup--configuration}

**Step 1:** Open SSH & Login in using your EC2 key.

**Step 2:** Install Node Version Manager (nvm) first

 ```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
   ```
**Step 3:** Install Node using Node Version Manager (nvm)

 ``` nvm install node ```

**Step 4:** Install Verdaccio & pm2, will require to run Verdaccio service in background

 ```yaml npm i -g verdaccio pm2 ```

**Step 5:** Set the verdaccio registry as a source. By default original NPM registry set.
 
 ``` npm set registry http://localhost:4873 ```
 
 ``` npm set ca null ```

**Step 6:** Run Verdaccio and stop it. It will create a config file we will use.

 ``` verdaccio ```
 
**Step 7:** Now do below configuration for listening to all addresses on that server machine / EC2 instance. [(read more)](https://github.com/verdaccio/verdaccio/blob/master/conf/full.yaml)

Open and edit `config.yaml` file:

 ```  nano .config/verdaccio/config.yaml ```

Add below lines at the end. [(read more)](https://github.com/verdaccio/verdaccio/blob/ff409ab7c05542a152100e3bc39cfadb36a8a080/conf/full.yaml#L113)

 ```yaml listen:
  - 0.0.0.0:4873
```

Change below line so that only authenticated person can access our registry

 ``` Replace "access: $all" with "access: $authenticated" ```

There are some more parameters available to configure it. Like storage, proxy, default port change. [(read more)](https://github.com/verdaccio/verdaccio/blob/ff409ab7c05542a152100e3bc39cfadb36a8a080/conf/full.yaml#L113)

**Step 8:** Run Verdaccio in background using PM2:

 ``` pm2 start verdaccio ```

**Step 9:** Now, You can access your Verdaccio web UI.

The URL will look like something:

 ``` http://ec2-..compute.amazonaws.com:4873 ```

{or}

 ``` http://your-ec2-public-ip-address:4873 (You can check your EC2 instance public ip from AWS console) ```

To confirm Verdaccio's running status, run the command below:

 ```  pm2 list ```

**Step 10:** Registering a user in verdaccio registry

 ```  npm set always-auth true ```
 
 ```  npm adduser ```

It will ask for username, password and valid email id to be entered. Make a note of this details that will use later to login in verdaccio registry to publish our library.


**Step 11:** Now we are ready to use our AWS server instance work as a private registry.

Login into verdaccio registry. Enter the same username, password and email id set in above Step.

 ```  npm set registry http://your-ec2-public-ip-address:4873 ```
 
 ```  npm login ```

**Step 12:** Go to your custom library package path. In my case this is my Angular 7 package path -> `/libraries/dist/your-library-name/your-library-name-0.0.1.tgz`

If you like to know how to create angular 7 library/package then [(click here)](https://www.howtoinmagento.com/2019/11/how-to-create-your-first-angular-7.html)

 ```   cd [custom library package path] ```

**Step 13:** Finally publish our library `your-library-name-0.0.1.tgz` on verdaccio registry

 ```  [custom library package path] >> npm publish your-library-name-0.0.1.tgz ```

{or}

 ```  [custom library package path] >> npm publish ```

{or}

 ```  [custom library package path] >> npm publish --registry http://your-ec2-public-ip-address:4873 ```

Now browse  ```  http://your-ec2-public-ip-address:4873 ``` and you will see new library package there.



