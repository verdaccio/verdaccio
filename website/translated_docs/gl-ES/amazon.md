---
id: amazon
title: "Amazon Web Services"
---

Este documento describe varios enfoques para despregar Verdaccio na nube AWS.

## EC2

[Modelo CloudFormation para despregar este stack.](https://github.com/verdaccio/verdaccio/blob/master/contrib/aws/cloudformation-ec2-efs.yaml)

Arquitectura:

    Clientes
     |
     | (HTTPS)
     v
    Balanceador de Carga de Aplicacións
     |
     | (HTTP)
     v
    EC2 Grupo de Autoescalado (Amazon Linux 2)
    Imaxe Docker (Verdaccio)
     |
     | (NFS)
     v
    Sistema de Ficheiros Elástico
    

* Desprega este stack na rexión máis próxima aos seus usuarios para obter o máximo rendemento. * Usamos un grupo de autoescalamento principalmente para autorecuperación. Os requirimentos do sistema de Verdaccio son bastante baixos, polo que é improbable que necesite varias instancias para xestionar a carga de tráfico. * Debido a que Amazon Linux 2 non inclúe NodeJS, executamos Verdaccio como imaxe Docker en lugar de nativa na instancia. Isto é máis rápido e seguro que depender de fontes de paquetes de terceiros para NodeJS. * O Elastic File System é barato e de estado e funciona en AZ. Unha alternativa sería o [ complemento de almacenamento S3 de terceiros ](https://github.com/remitly/verdaccio-s3-storage). * Para backup, use o AWS Backup

Custo mensual estimado para unha pequena instalación (en us-east-1): * ALB (1 LCU media): 22.265 $/mes * EC2 (t3.nano): 3.796 $ / mes * EBS (8gb): 0,80 $/mes * EFS (5 gb): $ 1,5/mes * Transferencia de datos: (10gb): 0,9 $/mes * ** TOTAL: ** Menos de $ 30 ao mes

## ECS

Podes despregar Verdaccio como unha tarefa cun [ ECS Volume ](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html) para almacenamento persistente.

Nota: Fargate non admite volumes persistentes, polo que tes que empregar o complemento de almacenamento S3.

## EKS

Consulte as páxinas de documentación en [ Kubernetes ](kubernetes) e [ Docker ](docker).