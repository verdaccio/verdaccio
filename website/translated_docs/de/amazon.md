---
id: amazon
title: "Amazon Web Services"
---

Dieses Dokument beschreibt die Vorgehensweise, um Verdaccio in der AWS Cloud bereitzustellen.

## EC2

[CloudFormation Template des Systems.](https://github.com/verdaccio/verdaccio/blob/master/contrib/aws/cloudformation-ec2-efs.yaml)

Architektur:

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
    

Anmerkung zur Architektur: * Veröffentliche diesen Stack in der deinen Nutzern nächsten Region, um eine maximale Performance zu gewährleisten. * Wir nutzen die Auto Scaling Group primär, um Auto Healing zu verwenden. Aufgrund der sehr geringen Systemvoraussetzungen von Verdaccio ist es sehr unwahrscheinlich, dass um den Traffic abzuarbeiten, mehrere Instanzen benötigt werden. * Die Amazon Linux 2 Standard Repositorys enthalten kein Node. Daher stellen wir Verdaccio in einem Docker Container bereit. Dies ist sowohl schneller, als auch sicherer als die Nutzung von Third-Party Paketen zur Installation von Node. * Das Elastic File System ist kostengünstig sowie Stateful und funktioniert zonenübergreifend. Eine Alternative wäre das Verdaccio [Third Party Storage Plugin](https://github.com/remitly/verdaccio-s3-storage). Zur Sicherung nutze AWS Backup

Geschätzte Monatskosten für eine minimale Installation (in us-east-1): * ALB (1 LCU average): $22.265 * EC2 (t3.nano): $3.796 * EBS (8gb): $0.80 * EFS (5gb): $1.5 * Datentransfer: (10gb): $0.9 * **Gesamt:** Unter $30

## ECS

Verdaccio kann als Task mit einem [ ECS Volumen](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html) als persistenten Speicher genutzt werden.

Anmerkung: Fargate unterstützt keine persistenten Volumes, daher muss in diesem Fall das [S3 Storage Plugin](https://github. com/remitly/verdaccio-s3-storage) verwendet werden.

## EKS

Siehe: [Kubernetes](kubernetes) and [Docker](docker) Dokumentation.