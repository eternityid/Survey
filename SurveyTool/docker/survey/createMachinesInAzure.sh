#/bin/sh
# --azure-image CoreOS:CoreOS:Stable:latest \  #This version ships with older docker (I'm no Docker Edge)

docker-machine create -d azure \
  --azure-size Basic_A1 \
  --azure-ssh-user ops \
  --azure-subscription-id df5f0c0f-9642-46cd-b92a-970ac4f458ce \
  --azure-open-port 9200 \
  --azure-open-port 9300 \
  --azure-open-port 27019 \
  --azure-location southeastasia \
  --azure-resource-group dockerSwarmTest \
  manager1

docker-machine create -d azure \
  --azure-size Basic_A1 \
  --azure-ssh-user ops \
  --azure-subscription-id df5f0c0f-9642-46cd-b92a-970ac4f458ce \
  --azure-open-port 9200 \
  --azure-open-port 9300 \
  --azure-open-port 27017 \
  --azure-location southeastasia \
  --azure-resource-group dockerSwarmTest \
  worker1

docker-machine create -d azure \
  --azure-size Basic_A1 \
  --azure-ssh-user ops \
  --azure-subscription-id df5f0c0f-9642-46cd-b92a-970ac4f458ce \
  --azure-open-port 9200 \
  --azure-open-port 9300 \
  --azure-open-port 27018 \
  --azure-location southeastasia \
  --azure-resource-group dockerSwarmTest \
  worker2
