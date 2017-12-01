FROM microsoft/aspnetcore-build:2.0 AS build-env
WORKDIR /src

# Build
COPY ./Analyze.Domain ./Analyze.Domain
RUN dotnet restore ./Analyze.Domain
RUN dotnet build ./Analyze.Domain

COPY ./Analyze.Infrastructure ./Analyze.Infrastructure
RUN dotnet restore ./Analyze.Infrastructure
RUN dotnet build ./Analyze.Infrastructure

COPY ./Analyze.Application ./Analyze.Application
RUN dotnet restore ./Analyze.Application
RUN dotnet build ./Analyze.Application

COPY ./Analyze.Persistence ./Analyze.Persistence
RUN dotnet restore ./Analyze.Persistence
RUN dotnet build ./Analyze.Persistence

COPY ./Analyze.Service ./Analyze.Service
RUN dotnet restore ./Analyze.Service
RUN dotnet publish ./Analyze.Service -c Release -o /publish

# Build runtime image
FROM microsoft/aspnetcore:2.0
WORKDIR /app
COPY --from=build-env /publish .
ENTRYPOINT ["dotnet", "Analyze.Service.dll"]

EXPOSE 3000