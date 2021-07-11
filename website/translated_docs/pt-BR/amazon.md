---
id: amazon
title: "Amazon Web Services"
---

Este documento descreve várias abordagens para implantar o Verdaccio na nuvem da AWS.

## EC2

[Template para implantar este stack na CloudFormation.](https://github.com/verdaccio/verdaccio/blob/master/contrib/aws/cloudformation-ec2-efs.yaml)

Arquitetura:

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
    

Observações de arquitetura: * Implemente esta stack na região mais próxima de seus usuários para obter o máximo desempenho. * Nós usamos um grupo de escalonamento automático principalmente para self-healing. Os requisitos de sistema do Verdaccio são muito baixos, desta forma é improvável que você precise de várias instâncias para lidar com a carga de tráfego. * Como o Amazon Linux 2 não inclui o Node, rodamos o Verdaccio como uma imagem Docker em vez de nativamente na instância. Isso é mais rápido e seguro do que depender de fontes de pacotes de terceiros para o Node. * Elastic File System é barato e stateful, e funciona através de AZs. Uma alternativa seria o [third-party S3 storage plugin](https://github.com/remitly/verdaccio-s3-storage). * Para backup, use o AWS Backup

Custo mensal estimado para uma pequena instalação (na zona us-east-1): * ALB (1 LCU em média): $22.265/mês * EC2 (t3.nano): $3.796/mês * EBS (8gb): $0.80/mês * EFS (5gb): $1.5/mês * Transferência de dados: (10gb): $0.9/mês * **TOTAL:** Próximo de $30/mês

## ECS

Você pode implantar o Verdaccio como uma função com um [ECS Volume](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html) para armazenamento persistente.

Nota: Fargate não suporta volumes persistentes, desta forma você tem que usar o plugin de armazenamento S3.

## EKS

Veja as páginas de documentação em [Kubernetes](kubernetes) e [Docker](docker).