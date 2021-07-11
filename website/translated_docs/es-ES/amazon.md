---
id: amazon
title: "Amazon Web Services"
---

Este documento describe varios enfoques para implementar Verdaccio en la nube de AWS.

## EC2

[CloudFormation template for deploying this stack.](https://github.com/verdaccio/verdaccio/blob/master/contrib/aws/cloudformation-ec2-efs.yaml)

Arquitectura:

```
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
```

Architecture notes:
* Deploy this stack into the region closest to your users for maximum performance.
* * Usamos un grupo de auto escalamiento principalmente para autorecuperación. Los requerimientos de sistema de Verdaccio son bastante bajos, por tanto es poco probable que necesites multiples instancias para manejar la carga de tráfico.
* Dado que Amazon Linux 2 no soporta Node, corremos Verdaccio como una imagen de Docker en lugar de correrlo de forma nativa en la instancia. Esto es más rápido y más seguro que confiar en librerías de paquetes de terceros para Node.
* * Elastic File System is cheap and stateful, and works across AZs. An alternative would be the [third-party S3 storage plugin](https://github.com/remitly/verdaccio-s3-storage).
  * * For backup, use AWS Backup

Estimated monthly cost for a small installation (in us-east-1): * ALB (1 LCU average): $22.265/mo * EC2 (t3.nano): $3.796/mo * EBS (8gb): $0.80/mo * EFS (5gb): $1.5/mo * Data transfer: (10gb): $0.9/mo * **TOTAL:** Under $30/mo
* ALB (1 LCU average): $22.265/mo
* EC2 (t3.nano): $3.796/mo
* EBS (8gb): $0.80/mo
* EFS (5gb): $1.5/mo
* Data transfer: (10gb): $0.9/mo
* **TOTAL:** Under $30/mo

## ECS

You can deploy Verdaccio as a task with an [ECS Volume](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html) for persistent storage.

Note: Fargate doesn't support persistent volumes, so you have to use the S3 storage plugin.

## EKS

See the documentation pages on [Kubernetes](kubernetes) and [Docker](docker).
