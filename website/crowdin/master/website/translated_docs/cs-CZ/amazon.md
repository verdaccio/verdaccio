---
id: amazon
title: "Amazon Web Services"
---

Tento dokument popisuje několik postupů jak nasadit Verdaccio v AWS cloud.

## EC2

[CloudFormation šablona pro nasazení tohoto stacku.](https://github.com/verdaccio/verdaccio/blob/master/contrib/aws/cloudformation-ec2-efs.yaml)

Architektura:

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
    

Poznámky k architektuře: * Pro maximální výkon nasaďte tento stack do regionu, který je nejblíže Vašim klientům. * Automatické škálování používáme primárně pro sebeléčení. Systémové požadavky Verdaccia jsou dost nízké, takže je nepravděpodobné, že budete potřebovat více instancí pro zpracování provozu. * Protože Amazon Linux 2 neobsahuje Node, spouštíme raději Verdaccio jako Docker obraz nežli jako nativní aplikaci v instanci. Toto je rychlejší a bezpečnější než spoléhání se na zdroje balíčků třetích stran pro Node. * Elastic File System je levný a stavový a funguje napříč AZ. Alternativa může bých [doplněk pro úložiště S3 od třetí strany](https://github.com/remitly/verdaccio-s3-storage). * Pro zálohování použijte AWS Backup

Odhadovaná cena malé instance za měsíc (v us-east-1): * ALB (1 LCU průměr): $22.265/měsíc * EC2 (t3.nano): $3.796/měsíc * EBS (8gb): $0.80/měsíc * EFS (5gb): $1.5/měsíc * Přenos dat: (10gb): $0.9/měsíc * **CELKEM:** Pod $30/měsíc

## ECS

Verdaccio lze nasadit jako task v [ECS Volume](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html) pro trvalé uložení.

Poznámka: Fargate nepodporuje trvalé svazky, takže budete muset použít doplněk pro úložiště S3.

## EKS

Dokumentaci naleznete na stránkách pro [Kubernetes](kubernetes) a [Docker](docker).