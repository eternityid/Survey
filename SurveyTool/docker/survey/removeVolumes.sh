eval $(docker-machine env manager1)
docker volume rm survey_mongo3data-configdb
docker volume rm survey_mongo3data-db

eval $(docker-machine env worker1)
docker volume rm survey_mongo1data-configdb
docker volume rm survey_mongo1data-db

eval $(docker-machine env worker2)
docker volume rm survey_mongo2data-configdb
docker volume rm survey_mongo2data-db
docker volume rm survey_elasticsearchdata