FROM mongo:latest

RUN apt-get update && apt-get install -y curl nano

COPY initializeWithReplicas.sh ./
RUN chmod 700 initializeWithReplicas.sh
COPY keyfile.txt ./
RUN chmod 600 keyfile.txt
RUN chown 999 keyfile.txt



