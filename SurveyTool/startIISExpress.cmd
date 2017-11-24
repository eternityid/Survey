set dotnet=C:\Program Files\dotnet\dotnet.exe
set currentPath=%cd%
pushd ..\AccountsCore\Accounts
set accountsPath=%CD%
popd

"c:\Program Files (x86)\IIS Express\iisexpress.exe" /apppool:Clr4IntegratedAppPool /config:./applicationhost.config