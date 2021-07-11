---
id: amazon
title: "Amazon Web Services"
---

Tento dokument popisuje několik postupů jak nasadit Verdaccio v AWS cloud.

## EC2

[CloudFormation šablona pro nasazení tohoto stacku.](https://github.com/verdaccio/verdaccio/blob/master/contrib/aws/cloudformation-ec2-efs.yaml)

Architektura:

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
* We use an auto scaling group primarily for self-healing. Systémové požadavky Verdaccia jsou dost nízké, takže je nepravděpodobné, že budete potřebovat více instancí pro zpracování provozu.
* Because Amazon Linux 2 doesn't include Node, we run Verdaccio as a Docker image rather than natively on the instance. Toto je rychlejší a bezpečnější než spoléhání se na zdroje balíčků třetích stran pro Node.
* Elastic File System is cheap and stateful, and works across AZs. Alternativa může bých [doplněk pro úložiště S3 od třetí strany](https://github.com/remitly/verdaccio-s3-storage).
  * For backup, use AWS Backup

Odhadovaná cena malé instance za měsíc (v us-east-1): * ALB (1 LCU průměr): $22.265/měsíc * EC2 (t3.nano): $3.796/měsíc * EBS (8gb): $0.80/měsíc * EFS (5gb): $1.5/měsíc * Přenos dat: (10gb): $0.9/měsíc * **CELKEM:** Pod $30/měsíc
* ALB (1 LCU average): $22.265/mo
* EC2 (t3.nano): $3.796/mo
* EBS (8gb): $0.80/mo
* EFS (5gb): $1.5/mo
* Data transfer: (10gb): $0.9/mo
* **TOTAL:** Under $30/mo

## ECS

Verdaccio lze nasadit jako task v [ECS Volume](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html) pro trvalé uložení.

Poznámka: Fargate nepodporuje trvalé svazky, takže budete muset použít doplněk pro úložiště S3.

## EKS

Dokumentaci naleznete na stránkách pro [Kubernetes](kubernetes) a [Docker](docker).
