curl -L -O https://download.elastic.co/kibana/kibana/kibana-4.5.1-windows.zip
unzip -o kibana-4.5.1-windows.zip
cd kibana-4.5.1-windows
./bin/kibana.bat plugin --install elastic/sense
cd bin