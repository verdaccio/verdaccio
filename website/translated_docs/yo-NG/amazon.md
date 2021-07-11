---
id: amazon
title: "Awọn Iṣẹ Ayelujara ti Amazon"
---

Iwe yii n ṣe apejuwe awọn orisirisi ọna fun sisẹ amulo Verdaccio ni ipamọ ayelujara ti AWS.

## EC2

[Awoṣe CloudFormation fun ṣiṣe amulo eto akopọ yii.](https://github.com/verdaccio/verdaccio/blob/master/contrib/aws/cloudformation-ec2-efs.yaml)

Iyaworan:

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
    

Awọn akọsilẹ Iyaworan: * Ṣe amulo eto akopọ yii si agbegbe ti o sunmọ julọ fun awọn olumulo rẹ fun iṣẹ to peye julọ. * A lo akojọpọ ti o ni ipele agbara alaifọwọyi nipataki fun imularada alara-ẹni. Awọn inilo eto ti Verdaccio kere jọjọ, nitorina o sọwọn pe o ma nilo awọn isẹlẹ pupọ lati mojuto ẹru abẹwo. * Nitoripe Amazon Linux 2 ko ni Oju ipade, a n lo Verdaccio gẹgẹbi aworan Docker dipo ilo abinibi lori isẹlẹ. Eleyi tubọ yara si ati tubọ ni aabo sii ju gbigbe ara le awọn orisun akojọ ti alagata lọ fun Oju ipade. * Eto Faili Oniriran jẹ olowo pọku ati oniranti ipo ibasepọ, atipe o n ṣiṣẹ jakejado AZs. Ọna miiran yoo jẹ ti [ohun-elo ipamọ S3 ti alagata](https://github.com/remitly/verdaccio-s3-storage). * Fun atilẹyin, lo Atilẹyin AWS

Afojuda iye owo osoosu fun igbekalẹ kekere kan (ni us-east-1): * ALB (agbede 1 LCU): $22.265/osu * EC2 (t3.nano): $3.796/osu * EBS (8gb): $0.80/osu * EFS (5gb): $1.5/osu * Data transfer: (10gb): $0.9/osu * **APAPỌ:** Koju $30/osu lọ

## ECS

O le ṣe amulo Verdaccio bi iṣẹ pẹlu [ECS Volume](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html) fun ibi ipamọ alatẹnumọ.

Akiyesi: Fargate ko ṣe atilẹyin fun awọn iwọn iye alatẹnumọ, nitorina o ni lati lo ohun elo ipamọ S3.

## EKS

Wo awọn oju ewe iwe lori [Kubernetes](kubernetes) ati [Docker](docker).