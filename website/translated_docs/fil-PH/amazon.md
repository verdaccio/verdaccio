---
id: amazon
title: "Mga Serbisyo sa Web ng Amazon"
---

Ang dokumento na ito ay naglalarawan ng mga ilang diskarte para ipamahagi ng Verdaccio sa AWS cloud.

## Ang EC2

[CloudFormation template for deploying this stack.](https://github.com/verdaccio/verdaccio/blob/master/contrib/aws/cloudformation-ec2-efs.yaml)

Ang Arkitektura:

    Clients
     |
     | (HTTPS)
     v
    Application Load Balancer
     |
     | (HTTP)
     v
    EC2 Auto Scaling Group (Amazon Linux 2)
    Docker image (Verdaccio)
     |
     | (NFS)
     v
    Elastic File System
    

Architecture notes: * Deploy this stack into the region closest to your users for maximum performance. Kami ay gumagamit ng auto scaling na grupo para sa pagpapagaling sa sarili. The system requirements of Verdaccio are pretty low, so it's unlikely you'll need multiple instances to handle traffic load. * Because Amazon Linux 2 doesn't include Node, we run Verdaccio as a Docker image rather than natively on the instance. This is faster and more secure than relying on third party package sources for Node. * Elastic File System is cheap and stateful, and works across AZs. An alternative would be the [third-party S3 storage plugin](https://github.com/remitly/verdaccio-s3-storage). Para sa Backup, gamitin mo ang AWS Backup

Estimated monthly cost for a small installation (in us-east-1): * ALB (1 LCU average): $22.265/mo * EC2 (t3.nano): $3.796/mo * EBS (8gb): $0.80/mo * EFS (5gb): $1.5/mo * Data transfer: (10gb): $0.9/mo * **TOTAL:** Under $30/mo

## Ang ECS

You can deploy Verdaccio as a task with an [ECS Volume](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html) for persistent storage.

Note: Fargate doesn't support persistent volumes, so you have to use the S3 storage plugin.

## Ang EKS

See the documentation pages on [Kubernetes](kubernetes) and [Docker](docker).