---
id: amazon
title: "Amazon Web Services"
---

Этот документ описывает несколько способов запустить Verdaccio в облаке AWS.

## EC2

[Шаблон CloudFormation для этого стека.](https://github.com/verdaccio/verdaccio/blob/master/contrib/aws/cloudformation-ec2-efs.yaml)

Архитектура:

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
    

Заметки по архитектуре: * Выбирайте регион, который ближе к вашим пользователям - для максимальной производительности. * Мы используем auto scaling group, в основном для самовосстановления. Системные требования для Verdaccio невысоки, так что вам, скорее всего, не понадобится использовать несколько инстансов для обслуживания трафика. * Так как Amazon Linux 2 не включает в себя Node, мы запускаем Verdaccio как Docker-образ, а не устанавливаем его в инстансе. Это быстрее и безопаснее, чем полагаться на сторонние источники для установки Node. * Elastic File System дешева и сохраняет состояние, и работает между несколькими AZ. Как альтернативу, можно использовать [third-party S3 storage plugin](https://github.com/remitly/verdaccio-s3-storage). * Для бэкапа, используйте AWS Backup

Примерные месячные траты для небольшого инстанса (в us-east-1): * ALB (1 LCU average): $22.265/мес * EC2 (t3.nano): $3.796/мес * EBS (8gb): $0.80/мес * EFS (5gb): $1.5/мес * Передача данных: (10gb): $0.9/мес * **TOTAL:** Меньше $30/мес

## ECS

Вы можете задеплоить Verdaccio в виде задачи с [ECS Volume](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html) в качестве постоянного хранилища данных.

Заметка: Fargate не поддерживает постоянное хранение данных, так что вам придется использовать S3 storage plugin.

## EKS

См. документацию на [Kubernetes](kubernetes) and [Docker](docker).