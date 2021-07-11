---
id: amazon
title: "Amazon Web Services"
---

Questo documento descrive i vari approcci per sviluppare Verdaccio nell'AWS cloud.

## EC2

[Il CloudFormation template per sviluppare questo stack.](https://github.com/verdaccio/verdaccio/blob/master/contrib/aws/cloudformation-ec2-efs.yaml)

Architettura:

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
    

Note sull'architettura: * Sviluppare questo stack nella regione più vicina agli utenti per la massima prestazione. * Utilizziamo un gruppo auto scaling principalmente per il self-healing. I requisiti di sistema di Verdaccio sono piuttosto bassi, quindi è improbabile che avrai bisogno di più istanze di gestire il carico di traffico. * Poiché Amazon Linux 2 non include Node, eseguiamo Verdaccio come un'immagine Docker anziché in modo nativo nell'istanza. Questo è più veloce e più sicuro del fare affidamento su fonti di pacchetti di terze parti per Node. * Elastic File System è economico e stateful e funziona sulle AZ. Un'alternativa sarebbe il [plugin di archiviazione di terze parti S3](https://github.com/remitly/verdaccio-s3-storage). * Per effettuare il backup, utilizzare AWS Backup

Costo mensile stimato per un piccolo impianto (zona us-east-1): * ALB (1 LCU in media): $ 22,265/mese * EC2 (t3.nano): $ 3,796/mese * EBS (8 gb): $ 0,80/mese * EFS (5 gb): $ 1,5/mese * Trasferimento dati: (10 gb): $ 0,9/mese * **TOTALE:** Meno di $30/mese

## ECS

È possibile sviluppare Verdaccio come una funzione con un [ECS Volume](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html) per l'archiviazione persistente.

Nota: Fargate non supporta volumi persistenti, quindi è necessario utilizzare il plugin di archiviazione S3.

## EKS

Vedere le pagine della documentazione su [Kubernetes](kubernetes) e [Docker](docker).